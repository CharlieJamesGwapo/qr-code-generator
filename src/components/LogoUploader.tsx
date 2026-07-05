"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface LogoUploaderProps {
  value?: string;
  onChange: (logoUrl: string | undefined) => void;
}

export default function LogoUploader({ value, onChange }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        <Upload className="inline w-4 h-4 mr-2" />
        Logo (Optional)
      </label>

      {value ? (
        <div className="space-y-2">
          <div className="relative w-32 h-32 rounded-lg border-2 border-slate-300 dark:border-slate-600 p-2">
            <img
              src={value}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => onChange(undefined)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Logo will appear in center of QR code
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/50"
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PNG or JPG (max 100KB recommended)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
