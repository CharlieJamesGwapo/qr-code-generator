"use client";

import { useState, useEffect } from "react";
import { generateQRCode } from "@/lib/qr-generator";
import { qrStorage, analyticsStorage } from "@/lib/qr-storage";
import ColorPicker from "./ColorPicker";
import LogoUploader from "./LogoUploader";
import QRPreview from "./QRPreview";
import { Save } from "lucide-react";

interface QRGeneratorProps {
  initialId?: string;
}

export default function QRGenerator({ initialId }: QRGeneratorProps) {
  const [text, setText] = useState("");
  const [foreColor, setForeColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing QR code if editing
  useEffect(() => {
    if (initialId) {
      const existing = qrStorage.getById(initialId);
      if (existing) {
        setText(existing.text);
        setForeColor(existing.foreColor);
        setBgColor(existing.bgColor);
        setLogoUrl(existing.logoUrl);
      }
    }
  }, [initialId]);

  // Generate QR code on text change
  useEffect(() => {
    if (!text.trim()) {
      setQrCodeData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await generateQRCode({
          text,
          foreColor,
          bgColor,
        });
        setQrCodeData(data);
      } catch (error) {
        console.error("Error generating QR code:", error);
        setQrCodeData(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [text, foreColor, bgColor]);

  const handleSaveQRCode = async () => {
    if (!text.trim() || !qrCodeData) {
      alert("Please generate a QR code first");
      return;
    }

    setIsSaving(true);
    try {
      const id = initialId || `qr-${Date.now()}`;
      qrStorage.save({
        id,
        text,
        foreColor,
        bgColor,
        logoUrl,
        createdAt: Date.now(),
        downloadCount: 0,
      });

      analyticsStorage.recordGeneration(text);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving QR code:", error);
      alert("Failed to save QR code");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!initialId) {
      handleSaveQRCode();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Text or URL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, email, or phone number..."
            className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {text.length} characters
          </p>
        </div>

        <ColorPicker
          label="Foreground Color"
          value={foreColor}
          onChange={setForeColor}
        />

        <ColorPicker
          label="Background Color"
          value={bgColor}
          onChange={setBgColor}
        />

        <LogoUploader value={logoUrl} onChange={setLogoUrl} />

        <button
          onClick={handleSaveQRCode}
          disabled={!text.trim() || !qrCodeData || isSaving}
          className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-colors ${
            saveSuccess
              ? "bg-green-500 text-white"
              : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save to History"}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Preview
        </h2>
        <QRPreview
          qrCodeData={qrCodeData}
          isLoading={isLoading}
          text={text}
          timestamp={Date.now()}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
