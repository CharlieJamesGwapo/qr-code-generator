"use client";

import { useEffect, useRef } from "react";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { downloadQRCode, generateFileName } from "@/lib/qr-generator";

interface QRPreviewProps {
  qrCodeData: string | null;
  isLoading: boolean;
  text: string;
  timestamp?: number;
  onDownload?: () => void;
}

export default function QRPreview({
  qrCodeData,
  isLoading,
  text,
  timestamp = Date.now(),
  onDownload,
}: QRPreviewProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrCodeData && canvasRef.current) {
      const img = new Image();
      img.src = qrCodeData;
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          canvasRef.current!.width = img.width;
          canvasRef.current!.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [qrCodeData]);

  const handleDownload = () => {
    if (qrCodeData) {
      const filename = generateFileName(text, timestamp);
      downloadQRCode(qrCodeData, filename);
      onDownload?.();
    }
  };

  const handleCopyToClipboard = async () => {
    if (qrCodeData) {
      try {
        const blob = await (await fetch(qrCodeData)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Generating QR Code...</p>
        </div>
      </div>
    );
  }

  if (!qrCodeData) {
    return (
      <div className="flex items-center justify-center h-80 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">
          Enter text above to generate a QR code
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-96 max-h-96"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </button>

        <button
          onClick={handleCopyToClipboard}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
