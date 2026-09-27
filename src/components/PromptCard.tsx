import React, { useState } from 'react';
import { Copy, Check, Sparkles, Terminal, Sliders, AlertCircle } from 'lucide-react';

interface PromptCardProps {
  toolName: string;
  badgeColor: string;
  icon?: React.ReactNode;
  prompt: string;
  parameters?: string;
  negativePrompt?: string;
  specialInstructions?: string;
  rationale: string;
  onCustomize?: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  toolName,
  badgeColor,
  icon,
  prompt,
  parameters,
  negativePrompt,
  specialInstructions,
  rationale,
  onCustomize,
}) => {
  const [copied, setCopied] = useState(false);

  const fullPromptText = `${prompt}${parameters ? ` ${parameters}` : ''}${negativePrompt ? ` --no ${negativePrompt}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${badgeColor}`} />
          <h3 className="font-bold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
            {icon}
            {toolName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onCustomize && (
            <button
              onClick={onCustomize}
              className="text-xs px-2.5 py-1 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>Modify</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Body: Prompt Box */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="relative group">
            <div className="p-3.5 bg-stone-950 text-stone-100 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto select-all border border-stone-800 shadow-inner">
              <span className="text-amber-400 select-none">/imagine prompt: </span>
              <span className="text-stone-100">{prompt}</span>
              {parameters && (
                <span className="text-cyan-400 font-semibold select-all"> {parameters}</span>
              )}
              {negativePrompt && (
                <span className="text-rose-400 font-semibold select-all"> --no {negativePrompt}</span>
              )}
            </div>
          </div>

          {/* Parameters badge pill */}
          {parameters && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <Terminal className="w-3 h-3 text-stone-400" />
              <span>Parameters: </span>
              <code className="text-cyan-700 font-mono bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                {parameters}
              </code>
            </div>
          )}

          {/* Negative prompt */}
          {negativePrompt && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <AlertCircle className="w-3 h-3 text-rose-500" />
              <span>Exclusions: </span>
              <code className="text-rose-700 font-mono bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                {negativePrompt}
              </code>
            </div>
          )}

          {/* Special instructions like typography or guidance scale */}
          {specialInstructions && (
            <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-lg text-purple-900 text-xs">
              <span className="font-semibold text-purple-950">Tip: </span>
              {specialInstructions}
            </div>
          )}
        </div>

        {/* Prompt Rationale */}
        <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="line-clamp-3">
            <span className="font-semibold text-stone-700">Design rationale: </span>
            {rationale}
          </p>
        </div>
      </div>
    </div>
  );
};
