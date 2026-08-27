from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, FloatObject, NameObject, StreamObject, TextStringObject


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "USATII_Software_QR_Business_Card_Print_Ready.pdf"
TMP = ROOT / "tmp" / "pdfs"
SOURCE_QR = ROOT / "public" / "qr" / "usatii-software.png"
QR_CMYK = TMP / "usatii-software-cmyk.tif"
HEADER_LOGO_CMYK = TMP / "usatii-header-logo-exact-cmyk.tif"
RAW_PDF = TMP / "usatii-business-card-raw.pdf"
ICC_PROFILE = Path("/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc")

PAGE_W = 3.75 * 72
PAGE_H = 2.25 * 72
BLEED = 0.125 * 72
TRIM_W = 3.5 * 72
TRIM_H = 2 * 72

WHITE = CMYKColor(0, 0, 0, 0)
INK = CMYKColor(0.60, 0.40, 0.35, 1.0)
MUTED = CMYKColor(0, 0, 0, 0.72)
VIOLET = CMYKColor(0.46, 0.84, 0, 0)


def register_fonts():
    pdfmetrics.registerFont(TTFont("USATII-Regular", str(ROOT / "tmp" / "Inter-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("USATII-Bold", str(ROOT / "tmp" / "Inter-Bold.ttf")))


def prepare_qr():
    with Image.open(SOURCE_QR) as image:
        monochrome = image.convert("L").point(lambda value: 255 if value > 127 else 0)
        cmyk = Image.new("CMYK", monochrome.size, (0, 0, 0, 0))
        source = monochrome.load()
        target = cmyk.load()
        for y in range(monochrome.height):
            for x in range(monochrome.width):
                target[x, y] = (0, 0, 0, 0 if source[x, y] else 255)
        cmyk.save(QR_CMYK, format="TIFF", compression="tiff_lzw", dpi=(300, 300))


def prepare_header_logo():
    # Exact measured header lockup: 18px/28px Inter Black italic, -0.45px tracking,
    # 18px orb, and 8px gap. Rendered 30x for lossless print placement.
    scale = 30
    line_height = 28 * scale
    orb_size = 18 * scale
    gap = 8 * scale
    pad = 14 * scale
    font_size = 18 * scale
    tracking = -0.45 * scale
    label = "USATII MEDIA"

    font = ImageFont.truetype("/Users/vladusatii/Library/Fonts/Inter-Variable.ttf", font_size)
    font.set_variation_by_name("Black")

    measured_width = sum(font.getlength(char) for char in label) + tracking * (len(label) - 1)
    text_upright = Image.new("RGBA", (round(measured_width + font_size), line_height), (0, 0, 0, 0))
    text_draw = ImageDraw.Draw(text_upright)
    cursor = 0
    bbox = font.getbbox(label)
    text_y = (line_height - (bbox[3] - bbox[1])) / 2 - bbox[1]
    for char in label:
        text_draw.text((cursor, text_y), char, font=font, fill=(0, 0, 0, 255))
        cursor += font.getlength(char) + tracking

    shear = 0.2493  # tan(14 degrees), matching synthesized CSS italic.
    text_layer = text_upright.transform(
        text_upright.size,
        Image.Transform.AFFINE,
        (1, shear, -shear * line_height, 0, 1, 0),
        resample=Image.Resampling.BICUBIC,
    )

    content_width = round(orb_size + gap + measured_width + font_size * 0.28)
    base = Image.new("RGBA", (content_width + pad * 2, line_height + pad * 2), (255, 255, 255, 255))
    orb_x = pad
    orb_y = pad + (line_height - orb_size) // 2

    outer_shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(outer_shadow).ellipse(
        (orb_x, orb_y + round(4.5 * scale), orb_x + orb_size, orb_y + orb_size + round(4.5 * scale)),
        fill=(168, 85, 247, 82),
    )
    outer_shadow = outer_shadow.filter(ImageFilter.GaussianBlur(round(12.6 * scale / 2)))
    base = Image.alpha_composite(base, outer_shadow)

    orb = Image.new("RGBA", (orb_size, orb_size), (0, 0, 0, 0))
    px = orb.load()
    stops = [(0.0, (219, 55, 255)), (0.42, (185, 28, 255)), (1.0, (139, 22, 239))]
    for y in range(orb_size):
        ny = y / (orb_size - 1)
        for x in range(orb_size):
            nx = x / (orb_size - 1)
            if (nx - 0.5) ** 2 + (ny - 0.5) ** 2 > 0.25:
                continue
            t = (nx + ny) / 2
            if t <= 0.42:
                local, first, second = t / 0.42, stops[0][1], stops[1][1]
            else:
                local, first, second = (t - 0.42) / 0.58, stops[1][1], stops[2][1]
            color = [round(first[i] + (second[i] - first[i]) * local) for i in range(3)]
            radial = ((nx - 0.32) ** 2 + (ny - 0.24) ** 2) ** 0.5
            highlight = max(0.0, 1 - radial / 0.30) * 0.42
            color = [round(channel + (255 - channel) * highlight) for channel in color]
            # Measured lower-right inset shadow from the CSS lockup.
            inset_distance = ((nx - 0.78) ** 2 + (ny - 0.76) ** 2) ** 0.5
            inset = max(0.0, 1 - inset_distance / 0.72) * 0.20
            color = [round(channel * (1 - inset) + target * inset) for channel, target in zip(color, (67, 0, 142))]
            px[x, y] = (*color, 255)

    base.alpha_composite(orb, (orb_x, orb_y))
    base.alpha_composite(text_layer, (orb_x + orb_size + gap, pad))

    rgb = base.convert("RGB")
    difference = ImageChops.difference(rgb, Image.new("RGB", rgb.size, "white")).convert("L")
    visible = difference.point(lambda value: 255 if value > 3 else 0)
    bounds = visible.getbbox()
    if bounds:
        margin = 2 * scale
        bounds = (
            max(0, bounds[0] - margin),
            max(0, bounds[1] - margin),
            min(rgb.width, bounds[2] + margin),
            min(rgb.height, bounds[3] + margin),
        )
        rgb = rgb.crop(bounds)
    rgb.convert("CMYK").save(HEADER_LOGO_CMYK, format="TIFF", compression="tiff_lzw", dpi=(1200, 1200))


def fill_page(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def draw_header_logo(c, left, center_y, height=18):
    with Image.open(HEADER_LOGO_CMYK) as logo:
        ratio = logo.width / logo.height
    width = height * ratio
    c.drawImage(str(HEADER_LOGO_CMYK), left, center_y - height / 2, width=width, height=height, mask=None)


def draw_front(c):
    fill_page(c)
    safe_left = BLEED + 18
    safe_right = PAGE_W - BLEED - 18

    draw_header_logo(c, safe_left, 125, height=18)

    c.setFillColor(INK)
    c.setFont("USATII-Bold", 17)
    c.drawString(safe_left, 69, "Vladislav Usatii")

    c.setFillColor(MUTED)
    c.setFont("USATII-Regular", 8.2)
    c.drawString(safe_left, 53, "Founder")

    c.setStrokeColor(CMYKColor(0, 0, 0, 0.14))
    c.setLineWidth(0.45)
    c.line(safe_left, 40, safe_right, 40)

    c.setFillColor(INK)
    c.setFont("USATII-Bold", 8)
    c.drawString(safe_left, 25, "(701) 864-0782")
    c.showPage()


def draw_back(c):
    fill_page(c)
    safe_left = BLEED + 18

    c.setFont("USATII-Bold", 12.8)
    c.setFillColor(INK)
    headline = c.beginText(safe_left, 110)
    headline.setLeading(14.5)
    headline.textLine("Your operation.")
    headline.textLine("One intelligent")
    headline.textLine("system.")
    c.drawText(headline)

    c.setFont("USATII-Regular", 6.4)
    c.setFillColor(MUTED)
    supporting = c.beginText(safe_left, 56)
    supporting.setLeading(8.7)
    supporting.textLine("Custom software for")
    supporting.textLine("construction teams, built around")
    supporting.textLine("the way you work.")
    c.drawText(supporting)

    c.setFont("USATII-Bold", 6.5)
    c.setFillColor(VIOLET)
    c.drawString(safe_left, 24, "SCAN TO EXPLORE")

    qr_size = 96
    qr_x = PAGE_W - BLEED - 18 - qr_size
    qr_y = 39
    c.drawImage(str(QR_CMYK), qr_x, qr_y, width=qr_size, height=qr_size, preserveAspectRatio=True, mask=None)
    url = "usatii.com/software"
    c.setFont("USATII-Bold", 6.7)
    c.setFillColor(INK)
    c.drawCentredString(qr_x + qr_size / 2, 24, url)
    c.showPage()


def apply_print_boxes_and_profile():
    reader = PdfReader(RAW_PDF)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)

    media_box = ArrayObject([FloatObject(0), FloatObject(0), FloatObject(PAGE_W), FloatObject(PAGE_H)])
    trim_box = ArrayObject([
        FloatObject(BLEED),
        FloatObject(BLEED),
        FloatObject(BLEED + TRIM_W),
        FloatObject(BLEED + TRIM_H),
    ])
    for page in writer.pages:
        page[NameObject("/MediaBox")] = media_box
        page[NameObject("/CropBox")] = media_box
        page[NameObject("/BleedBox")] = media_box
        page[NameObject("/TrimBox")] = trim_box
        page[NameObject("/ArtBox")] = trim_box

    if ICC_PROFILE.exists():
        profile = StreamObject()
        profile.set_data(ICC_PROFILE.read_bytes())
        profile[NameObject("/N")] = FloatObject(4)
        profile_ref = writer._add_object(profile)
        intent = DictionaryObject({
            NameObject("/Type"): NameObject("/OutputIntent"),
            NameObject("/S"): NameObject("/GTS_PDFX"),
            NameObject("/OutputConditionIdentifier"): TextStringObject("Generic CMYK Profile"),
            NameObject("/Info"): TextStringObject("Generic CMYK Profile"),
            NameObject("/DestOutputProfile"): profile_ref,
        })
        writer.root_object[NameObject("/OutputIntents")] = ArrayObject([writer._add_object(intent)])

    writer.add_metadata({
        "/Title": "USATII Software QR Business Card - Print Ready",
        "/Author": "USATII MEDIA",
        "/Subject": "Two-sided 3.5 x 2 inch business card with 0.125 inch bleed",
        "/GTS_PDFXVersion": "PDF/X-4",
        "/Trapped": "False",
    })
    writer.pdf_header = "%PDF-1.6"
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("wb") as stream:
        writer.write(stream)


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    register_fonts()
    prepare_qr()
    prepare_header_logo()
    c = canvas.Canvas(
        str(RAW_PDF),
        pagesize=(PAGE_W, PAGE_H),
        pageCompression=1,
        pdfVersion=(1, 6),
        initialFontName="USATII-Regular",
        initialFontSize=10,
    )
    c.setTitle("USATII Software QR Business Card - Print Ready")
    c.setAuthor("USATII MEDIA")
    draw_front(c)
    draw_back(c)
    c.save()
    apply_print_boxes_and_profile()
    print(OUTPUT)


if __name__ == "__main__":
    main()
