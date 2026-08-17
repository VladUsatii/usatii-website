import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { normalizeQrUrl, QR_COLORS } from "@/lib/qr-code";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const target = normalizeQrUrl(request.nextUrl.searchParams.get("url"));
    const format = request.nextUrl.searchParams.get("format") || "svg";
    const size = Math.min(
      Math.max(Number(request.nextUrl.searchParams.get("size")) || 1024, 256),
      2048,
    );

    const options = {
      errorCorrectionLevel: "H",
      margin: 4,
      width: size,
      color: QR_COLORS,
    };

    if (format === "png") {
      const image = await QRCode.toBuffer(target, { ...options, type: "png" });
      return new NextResponse(image, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="usatii-qr-code.png"',
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    const image = await QRCode.toString(target, { ...options, type: "svg" });
    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Content-Disposition": 'inline; filename="usatii-qr-code.svg"',
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid QR code request." },
      { status: 400 },
    );
  }
}

