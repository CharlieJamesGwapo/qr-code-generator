"use client";

import { useSearchParams } from "next/navigation";
import QRGenerator from "@/components/QRGenerator";

export default function Home() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {editId ? "Edit QR Code" : "Generate QR Code"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {editId
              ? "Customize and update your QR code"
              : "Create custom QR codes with your own colors and branding"}
          </p>
        </div>

        <QRGenerator initialId={editId || undefined} />
      </div>
    </div>
  );
}
