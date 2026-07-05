"use client";

import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            QR Code History
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View and manage all your generated QR codes
          </p>
        </div>

        <HistoryList />
      </div>
    </div>
  );
}
