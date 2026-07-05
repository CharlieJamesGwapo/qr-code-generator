"use client";

import { useEffect, useState } from "react";
import { analyticsStorage } from "@/lib/qr-storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trash2 } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function AnalyticsChart() {
  const [stats, setStats] = useState({ mostUsed: [] as [string, number][], totalGenerated: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadStats();
  }, []);

  const loadStats = () => {
    const data = analyticsStorage.getStats();
    setStats(data);
  };

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      analyticsStorage.clear();
      loadStats();
    }
  };

  if (!mounted) {
    return <div className="text-center text-slate-500 dark:text-slate-400">Loading...</div>;
  }

  const chartData = stats.mostUsed.map(([text, count]) => ({
    name: text.substring(0, 30) + (text.length > 30 ? "..." : ""),
    count: Math.round(count * 10) / 10,
    fullText: text,
  }));

  if (stats.totalGenerated === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          No analytics data yet. Generate some QR codes to see stats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Generation Stats
          </h2>
          <button
            onClick={handleClearAnalytics}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Generated</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(stats.totalGenerated)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Unique Texts</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.mostUsed.length}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Avg Per Text</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.mostUsed.length > 0
                ? (
                    Math.round(
                      (stats.totalGenerated / stats.mostUsed.length) * 10
                    ) / 10
                  ).toFixed(1)
                : "0"}
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Most Used QR Codes
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Detailed Stats
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Text / URL
                  </th>
                  <th className="text-right py-2 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Count
                  </th>
                  <th className="text-right py-2 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                      {item.fullText}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 font-semibold">
                      {item.count}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                      {(
                        (item.count / stats.totalGenerated) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
