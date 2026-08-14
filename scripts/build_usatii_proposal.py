from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "deliverables"
OBJECTIVE = Path("/Users/vladusatii/.codex/attachments/109d8682-8310-43ef-b271-604d95997742/goal-objective.md")
PRICE_SHEET_OBJECTIVE = Path("/Users/vladusatii/Downloads/USATII_MEDIA_Comprehensive_Price_Sheet_August_2026.md")
BRAND_WORDMARK = ROOT / "assets" / "usatii-media-header-logo.png"

INK = "111318"
MUTED = "62666D"
BRAND_PURPLE = "7C3AED"
PALE = "F5F6F7"
TABLE_HEAD = "E9EBED"
RULE = "333333"
WHITE = "FFFFFF"


def add_brand_wordmark(paragraph, width):
    """Insert a tightly cropped screenshot of the actual usatii.com header mark."""
    image_run = paragraph.add_run()
    image_run.add_picture(str(BRAND_WORDMARK), width=Inches(width))
    return image_run


def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=90, start=110, bottom=90, end=110):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for edge, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        tag = "w:" + edge
        node = tc_mar.find(qn(tag))
        if node is None:
            node = OxmlElement(tag)
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def prevent_row_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    cant_split.set(qn("w:val"), "true")
    tr_pr.append(cant_split)


def clear_container(element):
    for child in list(element):
        element.remove(child)


def force_inter(doc):
    def set_run(run):
        run.font.name = "Inter"
        rpr = run._r.get_or_add_rPr()
        rfonts = rpr.rFonts
        if rfonts is None:
            rfonts = OxmlElement("w:rFonts")
            rpr.insert(0, rfonts)
        for key in ("ascii", "hAnsi", "eastAsia", "cs"):
            rfonts.set(qn("w:" + key), "Inter")

    def walk_table(table):
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for run in p.runs:
                        set_run(run)
                for nested in cell.tables:
                    walk_table(nested)

    for p in doc.paragraphs:
        for run in p.runs:
            set_run(run)
    for table in doc.tables:
        walk_table(table)
    for section in doc.sections:
        for container in (section.header, section.footer):
            for p in container.paragraphs:
                for run in p.runs:
                    set_run(run)
            for table in container.tables:
                walk_table(table)


def add_page_number(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("Page ")
    run.font.size = Pt(8)
    run.font.color.rgb = RGBColor.from_string(MUTED)
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr_text = OxmlElement("w:instrText")
    instr_text.set(qn("xml:space"), "preserve")
    instr_text.text = "PAGE"
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char1)
    run._r.append(instr_text)
    run._r.append(fld_char2)


def configure_section(section, first_page=False, document_title="Document", date_value="August 10, 2026", prepared_for="Lindsay · Property Manager"):
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(2.12 if first_page else 0.68)
    section.bottom_margin = Inches(0.56)
    section.left_margin = Inches(0.60)
    section.right_margin = Inches(0.60)
    section.header_distance = Inches(0.25)
    section.footer_distance = Inches(0.14)
    section.different_first_page_header_footer = False

    header = section.header
    header.is_linked_to_previous = False
    clear_container(header._element)
    if first_page:
        table = header.add_table(rows=1, cols=2, width=Inches(7.3))
        table.autofit = False
        table.columns[0].width = Inches(3.60)
        table.columns[1].width = Inches(3.70)
        left, right = table.rows[0].cells
        left.width, right.width = Inches(3.60), Inches(3.70)
        for c in (left, right):
            set_cell_margins(c, top=0, bottom=0, start=0, end=0)
        p = left.paragraphs[0]
        p.paragraph_format.space_after = Pt(3)
        add_brand_wordmark(p, width=1.55)
        p = left.add_paragraph("Usatii Media\nusatii.com\nvlad@usatii.com")
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.03
        for r in p.runs:
            r.font.name = "Inter"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor.from_string(INK)

        meta = right.add_table(rows=4, cols=2)
        meta.autofit = False
        meta.columns[0].width = Inches(1.18)
        meta.columns[1].width = Inches(2.32)
        values = [
            ("Date", "Document details"),
            (date_value, document_title),
            ("Prepared by", "Prepared for"),
            ("Vladislav Usatii", prepared_for),
        ]
        for i, vals in enumerate(values):
            for j, val in enumerate(vals):
                cell = meta.cell(i, j)
                set_cell_margins(cell, top=45, bottom=45, start=65, end=65)
                cell.width = meta.columns[j].width
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i in (0, 2) else WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_after = Pt(0)
                r = p.add_run(val)
                r.font.name = "Inter"
                r.font.size = Pt(7.5 if i in (0, 2) else 7)
                r.bold = i in (0, 2)
                r.font.color.rgb = RGBColor.from_string(INK)
                tc_pr = cell._tc.get_or_add_tcPr()
                borders = OxmlElement("w:tcBorders")
                for edge in ("top", "left", "bottom", "right"):
                    node = OxmlElement("w:" + edge)
                    node.set(qn("w:val"), "single")
                    node.set(qn("w:sz"), "4")
                    node.set(qn("w:color"), RULE)
                    borders.append(node)
                tc_pr.append(borders)
    else:
        table = header.add_table(rows=1, cols=2, width=Inches(7.3))
        table.autofit = False
        table.columns[0].width = Inches(1.35)
        table.columns[1].width = Inches(5.95)
        left, right = table.rows[0].cells
        for c in (left, right):
            set_cell_margins(c, top=0, bottom=50, start=0, end=0)
            tc_pr = c._tc.get_or_add_tcPr()
            borders = OxmlElement("w:tcBorders")
            bottom = OxmlElement("w:bottom")
            bottom.set(qn("w:val"), "single")
            bottom.set(qn("w:sz"), "4")
            bottom.set(qn("w:color"), BRAND_PURPLE)
            borders.append(bottom)
            tc_pr.append(borders)
        p = left.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        add_brand_wordmark(p, width=.78)
        p = right.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(document_title)
        r.bold = True
        r.font.name = "Inter"
        r.font.size = Pt(7)

    footer = section.footer
    footer.is_linked_to_previous = False
    clear_container(footer._element)
    p = footer.add_paragraph()
    add_page_number(p)


def configure_doc(doc: Document, first_page=True, document_title="Document", date_value="August 10, 2026", prepared_for="Lindsay · Property Manager"):
    section = doc.sections[0]
    configure_section(section, first_page=first_page, document_title=document_title, date_value=date_value, prepared_for=prepared_for)

    styles = doc.styles
    for style in styles:
        if getattr(style, "font", None) is None:
            continue
        style.font.name = "Inter"
        rpr = style.element.get_or_add_rPr()
        rfonts = rpr.rFonts
        if rfonts is None:
            rfonts = OxmlElement("w:rFonts")
            rpr.insert(0, rfonts)
        for key in ("ascii", "hAnsi", "eastAsia", "cs"):
            rfonts.set(qn("w:" + key), "Inter")
    normal = styles["Normal"]
    normal.font.name = "Inter"
    normal.font.size = Pt(8.7)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_after = Pt(3.2)
    normal.paragraph_format.line_spacing = 1.06

    for name, size, before, after, color in (
        ("Title", 18, 0, 16, INK),
        ("Heading 1", 12.4, 13, 5, INK),
        ("Heading 2", 10.4, 9, 4, INK),
        ("Heading 3", 9.4, 7, 3, INK),
    ):
        st = styles[name]
        st.font.name = "Inter"
        st.font.size = Pt(size)
        st.font.bold = True
        st.font.color.rgb = RGBColor.from_string(color)
        st.paragraph_format.space_before = Pt(before)
        st.paragraph_format.space_after = Pt(after)
        st.paragraph_format.keep_with_next = True



def add_runs(paragraph, text):
    parts = re.split(r"(\*\*.*?\*\*|(?<!\*)\*[^*]+?\*(?!\*)|`[^`]+`)", text)
    for token in parts:
        if not token:
            continue
        if token.startswith("**") and token.endswith("**"):
            run = paragraph.add_run(token[2:-2])
            run.bold = True
        elif token.startswith("*") and token.endswith("*"):
            run = paragraph.add_run(token[1:-1])
            run.italic = True
        elif token.startswith("`") and token.endswith("`"):
            paragraph.add_run(token[1:-1])
        else:
            paragraph.add_run(token)


def add_label(doc, label, value):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(label.upper() + "  ")
    r.bold = True
    r.font.size = Pt(7.5)
    r.font.color.rgb = RGBColor.from_string(INK)
    r = p.add_run(value)
    r.font.size = Pt(9.5)


def add_callout(doc, text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    prevent_row_split(table.rows[0])
    cell = table.cell(0, 0)
    shade(cell, PALE)
    set_cell_margins(cell, 150, 175, 150, 175)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    add_runs(p, text)


def add_data_table(doc, rows):
    # The proposal's list-style Markdown tables have one heading and a long
    # single column of comparable items. Flow those items across two columns
    # to make the tables more compact and easier to scan.
    two_column_list = max(len(r) for r in rows) == 1 and len(rows) > 2
    if two_column_list:
        items = [row[0] for row in rows[1:]]
        rows = [rows[0]] + [items[i:i + 2] for i in range(0, len(items), 2)]
        cols = 2
    else:
        cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    total = 7.3
    widths = ([total / 2, total / 2] if two_column_list else
              ([total] if cols == 1 else
               ([total * .72, total * .28] if cols == 2 else [total / cols] * cols)))
    if two_column_list:
        table.cell(0, 0).merge(table.cell(0, 1))
    for i, row in enumerate(rows):
        for j in range(cols):
            if two_column_list and i == 0 and j == 1:
                continue
            cell = table.cell(i, j)
            cell.width = Inches(total if two_column_list and i == 0 else widths[j])
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_margins(cell, top=62, bottom=62, start=90, end=90)
            text = row[j] if j < len(row) else ""
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            add_runs(p, text)
            if i == 0:
                shade(cell, TABLE_HEAD)
                for run in p.runs:
                    run.bold = True
                    run.font.color.rgb = RGBColor.from_string(INK)
            tc_pr = cell._tc.get_or_add_tcPr()
            borders = OxmlElement("w:tcBorders")
            bottom = OxmlElement("w:bottom")
            bottom.set(qn("w:val"), "single")
            bottom.set(qn("w:sz"), "5" if i == 0 else "3")
            bottom.set(qn("w:color"), RULE if i == 0 else "8A8A8A")
            borders.append(bottom)
            tc_pr.append(borders)
    set_repeat_table_header(table.rows[0])
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def parse_table(lines, index):
    rows = []
    while index < len(lines) and lines[index].strip().startswith("|"):
        raw = lines[index].strip().strip("|")
        row = [c.strip() for c in raw.split("|")]
        if not all(re.fullmatch(r":?-{3,}:?", c or "") for c in row):
            rows.append(row)
        index += 1
    return rows, index


def add_markdown(doc, markdown):
    lines = markdown.splitlines()
    i = 0
    in_code = False
    code_lines = []
    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()
        if stripped.startswith("```"):
            if in_code:
                add_callout(doc, "\n".join(code_lines))
                code_lines = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_lines.append(line)
            i += 1
            continue
        if not stripped or stripped == "---":
            i += 1
            continue
        if stripped.startswith("|"):
            rows, i = parse_table(lines, i)
            add_data_table(doc, rows)
            continue
        m = re.match(r"^(#{1,3})\s+(.*)$", stripped)
        if m:
            level = len(m.group(1))
            title = m.group(2)
            if level == 1:
                # Numbered proposal sections behave as major headings; feature headings as H2.
                level = 1 if re.match(r"\d+\.", title) or title.startswith("Proposal:") else 2
            p = doc.add_paragraph(style=f"Heading {level}")
            add_runs(p, title)
            i += 1
            continue
        m = re.match(r"^[-*]\s+(.*)$", stripped)
        if m:
            p = doc.add_paragraph(style="List Bullet")
            p.paragraph_format.space_after = Pt(2.2)
            add_runs(p, m.group(1))
            i += 1
            continue
        m = re.match(r"^(\d+)\.\s+(.*)$", stripped)
        if m:
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.26)
            p.paragraph_format.first_line_indent = Inches(-0.26)
            p.paragraph_format.space_after = Pt(2.2)
            add_runs(p, f"{m.group(1)}.  {m.group(2)}")
            i += 1
            continue
        if stripped.startswith(">"):
            quote = stripped.lstrip("> ")
            while i + 1 < len(lines) and lines[i + 1].strip().startswith(">"):
                i += 1
                quote += "\n" + lines[i].strip().lstrip("> ")
            if doc.paragraphs:
                doc.paragraphs[-1].paragraph_format.keep_with_next = True
            add_callout(doc, quote)
            i += 1
            continue
        if stripped.startswith("**Prepared by:**"):
            # Preserve the proposal's opening metadata as four distinct lines.
            while i < len(lines):
                metadata_line = lines[i].strip()
                if not re.match(r"^\*\*[^*]+:\*\*", metadata_line):
                    break
                p = doc.add_paragraph()
                p.paragraph_format.space_after = Pt(1.5)
                add_runs(p, metadata_line)
                i += 1
            continue
        para_lines = [stripped]
        while i + 1 < len(lines):
            nxt = lines[i + 1].strip()
            if (not nxt or nxt.startswith(("#", "|", "```", ">")) or
                    re.match(r"^[-*]\s+", nxt) or re.match(r"^\d+\.\s+", nxt)):
                break
            i += 1
            para_lines.append(nxt)
        p = doc.add_paragraph()
        add_runs(p, " ".join(para_lines))
        i += 1


def build_template(path):
    doc = Document()
    configure_doc(doc, first_page=True, document_title="[Document title]", date_value="[Date]", prepared_for="[Recipient]")
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(24)
    r = p.add_run("[DOCUMENT TITLE]")
    r.bold = True
    r.font.name = "Inter"
    r.font.size = Pt(17)
    r.font.color.rgb = RGBColor.from_string(INK)
    p = doc.add_paragraph("[Recipient name]\n[Organization]\n[Street address]\n[City, State ZIP]")
    p.paragraph_format.space_after = Pt(14)
    doc.add_heading("Included", level=1)
    doc.add_paragraph("[Begin the document here. Use concise sections, restrained rules, and tables only for comparable data.]")
    doc.add_heading("Details", level=1)
    doc.add_paragraph("[Add the document body.]")
    force_inter(doc)
    doc.save(path)


def build_proposal(path):
    content = OBJECTIVE.read_text(encoding="utf-8")
    content = re.sub(r"(?m)^\s*(?:Phone:\s*)?\(?701\)?[\s.-]*864[\s.-]*0782\s*$", "", content)
    letter, proposal = content.split("# Proposal: Private Property Operations System", 1)
    letter = letter[letter.index("Hi. I'm Vlad."):].strip()

    doc = Document()
    configure_doc(doc, first_page=True, document_title="Property Operations Proposal")
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(22)
    r = p.add_run("PRIVATE PROPERTY OPERATIONS SYSTEM")
    r.bold = True
    r.font.name = "Inter"
    r.font.size = Pt(17)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(14)
    r = p.add_run("Lindsay\nProperty Manager\n0609 Condado Avenue\nSan Juan, Puerto Rico")
    r.font.name = "Inter"
    r.font.size = Pt(8.5)
    p = doc.add_paragraph("Dear Lindsay,")
    p.paragraph_format.space_after = Pt(6)
    for para in re.split(r"\n\s*\n", letter):
        p = doc.add_paragraph()
        add_runs(p, para.replace("\n", "\n"))
    section = doc.add_section(WD_SECTION.NEW_PAGE)
    configure_section(section, first_page=False, document_title="Private Property Operations System")

    # Preserve the supplied proposal title, metadata, and wording verbatim.
    proposal = re.sub(r"^\s*\n", "", proposal)
    proposal = "# Proposal: Private Property Operations System\n\n" + proposal
    proposal = proposal.replace("# Payment and Deliverables\n", "# 3. Payment and Deliverables\n")
    proposal = proposal.replace("# Next Step\n", "# Next Steps\n")
    add_markdown(doc, proposal)
    force_inter(doc)
    doc.save(path)


def build_price_sheet(path):
    content = PRICE_SHEET_OBJECTIVE.read_text(encoding="utf-8")
    content = re.sub(r"(?m)^\s*(?:Phone:\s*)?\(?701\)?[\s.-]*864[\s.-]*0782\s*$", "", content)
    content = content[content.index("# Comprehensive Price Sheet"):].strip()
    first_line, body = content.split("\n", 1)
    title = first_line.lstrip("# ").strip()

    doc = Document()
    configure_doc(
        doc,
        first_page=True,
        document_title="Comprehensive Price Sheet",
        date_value="August 2026",
        prepared_for="Clients & Partners",
    )
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(22)
    r = p.add_run(title.upper())
    r.bold = True
    r.font.name = "Inter"
    r.font.size = Pt(18)
    r.font.color.rgb = RGBColor.from_string(INK)

    add_markdown(doc, body)
    force_inter(doc)
    doc.save(path)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    build_template(OUT / "USATII_MEDIA_Letterhead_Template.docx")
    build_proposal(OUT / "USATII_MEDIA_Private_Property_Operations_Proposal.docx")
    build_price_sheet(OUT / "USATII_MEDIA_Comprehensive_Price_Sheet.docx")
    print(OUT / "USATII_MEDIA_Letterhead_Template.docx")
    print(OUT / "USATII_MEDIA_Private_Property_Operations_Proposal.docx")
    print(OUT / "USATII_MEDIA_Comprehensive_Price_Sheet.docx")


if __name__ == "__main__":
    main()
