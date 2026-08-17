export const DEFAULT_QR_URL = "https://usatii.com/software?utm_source=qr&utm_campaign=software-qr";

export const QR_COLORS = {
  dark: "#111827",
  light: "#ffffff",
};

export function normalizeQrUrl(value) {
  const candidate = String(value || "").trim();
  if (!candidate) return DEFAULT_QR_URL;

  const url = new URL(candidate);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only http and https URLs are supported.");
  }
  return url.toString();
}
