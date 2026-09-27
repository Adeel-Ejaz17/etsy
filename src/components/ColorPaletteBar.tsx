import React, { useState } from 'react';
import { ColorSwatch } from '../types';
import { Palette, Check, Copy } from 'lucide-react';

interface ColorPaletteBarProps {
  palette: ColorSwatch[];
}

export const ColorPaletteBar: React.FC<ColorPaletteBarProps> = ({ palette }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  if (!palette || palette.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-stone-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Aesthetic Color Palette (Click to Copy HEX)
          </h3>
        </div>
        <span className="text-[11px] text-stone-400">
          {palette.length} Tones
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {palette.map((swatch, idx) => (
          <div
            key={idx}
            onClick={() => handleCopy(swatch.hex)}
            className="group p-2 rounded-xl border border-stone-100 hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer bg-stone-50 flex flex-col gap-1.5"
          >
            <div
              className="h-10 w-full rounded-lg shadow-inner border border-black/5 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-98"
              style={{ backgroundColor: swatch.hex }}
            >
              {copiedHex === swatch.hex && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-stone-800 text-[11px]">
                {swatch.hex}
              </span>
              <span className="text-[10px] text-stone-400 group-hover:text-stone-700">
                {copiedHex === swatch.hex ? 'Copied' : <Copy className="w-3 h-3 inline" />}
              </span>
            </div>

            <div className="text-[10px] text-stone-500 truncate" title={`${swatch.name} (${swatch.role})`}>
              <span className="font-medium text-stone-700">{swatch.name}</span> • {swatch.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
