import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const outputDirectory = new URL("../public/qr/", import.meta.url);
const target = "https://usatii.com/software?utm_source=qr&utm_campaign=software-qr";
const options = {
  errorCorrectionLevel: "H",
  margin: 4,
  width: 1600,
  color: { dark: "#111827", light: "#ffffff" },
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  QRCode.toFile(fileURLToPath(new URL("usatii-software.svg", outputDirectory)), target, { ...options, type: "svg" }),
  QRCode.toFile(fileURLToPath(new URL("usatii-software.png", outputDirectory)), target, { ...options, type: "png" }),
]);

console.log(`Generated QR assets for ${target}`);
