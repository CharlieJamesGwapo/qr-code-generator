import QRCode from "qrcode";

export interface QRGenerationOptions {
  text: string;
  foreColor?: string;
  bgColor?: string;
  size?: number;
  logoUrl?: string;
}

export const generateQRCode = async (
  options: QRGenerationOptions
): Promise<string> => {
  const {
    text,
    foreColor = "#000000",
    bgColor = "#ffffff",
    size = 500,
  } = options;

  try {
    const canvas = await QRCode.toCanvas(text, {
      color: {
        dark: foreColor,
        light: bgColor,
      },
      width: size,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw error;
  }
};

export const downloadQRCode = (dataUrl: string, filename: string = "qr-code.png"): void => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateFileName = (text: string, timestamp: number): string => {
  const truncated = text.substring(0, 20).replace(/[^a-z0-9]/gi, "_");
  const date = new Date(timestamp).toISOString().split("T")[0];
  return `qr_${truncated}_${date}.png`;
};
