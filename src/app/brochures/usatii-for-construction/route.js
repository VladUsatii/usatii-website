import { NextResponse } from "next/server";

export function GET(request) {
  return NextResponse.redirect(new URL("/brochures/usatii-for-construction.pdf", request.url));
}
