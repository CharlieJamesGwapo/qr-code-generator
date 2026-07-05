"use client";

import { useEffect, useState } from "react";
import { QRCodeData, qrStorage } from "@/lib/qr-storage";
import { Trash2, Download, Edit2, Copy, Check } from "lucide-react";
import { downloadQRCode, generateQRCode, generateFileName } from "@/lib/qr-generator";
import Link from "next/link";

export default function HistoryList() {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = () => {
    const codes = qrStorage.getAll();
    setQrCodes(codes.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      qrStorage.delete(id);
      loadQRCodes();
    }
  };

  const handleDownload = async (qr: QRCodeData) => {
    try {
      const data = await generateQRCode({
        text: qr.text,
        foreColor: qr.foreColor,
        bgColor: qr.bgColor,
      });
      downloadQRCode(data, generateFileName(qr.text, qr.createdAt));
      qrStorage.incrementDownloadCount(qr.id);
      loadQRCodes();
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const handleCopyToClipboard = async (qr: QRCodeData) => {
    try {
      const data = await generateQRCode({
        text: qr.text,
        foreColor: qr.foreColor,
        bgColor: qr.bgColor,
      });
      const blob = await (await fetch(data)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopiedId(qr.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          No QR codes generated yet
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Create First QR Code
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {qrCodes.map((qr) => (
        <div
          key={qr.id}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-blue-500/20 transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all">
                {qr.text}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Created: {new Date(qr.createdAt).toLocaleDateString()} at{" "}
                {new Date(qr.createdAt).toLocaleTimeString()}
              </p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Downloads: <span className="font-semibold">{qr.downloadCount}</span>
                </span>
                <span
                  className="w-4 h-4 rounded inline-block border border-slate-300 dark:border-slate-600"
                  style={{ backgroundColor: qr.bgColor }}
                  title={`BG: ${qr.bgColor}`}
                />
                <span
                  className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 inline-block"
                  style={{ backgroundColor: qr.foreColor }}
                  title={`FG: ${qr.foreColor}`}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopyToClipboard(qr)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
                title="Copy to clipboard"
              >
                {copiedId === qr.id ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => handleDownload(qr)}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>

              <Link
                href={`/?edit=${qr.id}`}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </Link>

              <button
                onClick={() => handleDelete(qr.id)}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
