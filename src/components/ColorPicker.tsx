"use client";

import { useState } from "react";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
];

export default function ColorPicker({
  label,
  value,
  onChange,
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        <Palette className="inline w-4 h-4 mr-2" />
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600"
        />

        <button
          onClick={() => setShowPicker(!showPicker)}
          className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
        >
          Presets
        </button>

        <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">
          {value}
        </div>
      </div>

      {showPicker && (
        <div className="grid grid-cols-6 gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                onChange(color);
                setShowPicker(false);
              }}
              className="w-10 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
