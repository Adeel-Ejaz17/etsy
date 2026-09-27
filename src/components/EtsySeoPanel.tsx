import React, { useState } from 'react';
import { EtsyListingSEO } from '../types';
import { Tag, Copy, Check, Users, Sparkles, FileText, CheckCircle } from 'lucide-react';

interface EtsySeoPanelProps {
  seo: EtsyListingSEO;
}

export const EtsySeoPanel: React.FC<EtsySeoPanelProps> = ({ seo }) => {
  const [copiedAllTags, setCopiedAllTags] = useState(false);
  const [copiedTagIdx, setCopiedTagIdx] = useState<number | null>(null);
  const [copiedTitleIdx, setCopiedTitleIdx] = useState<number | null>(null);
  const [copiedHook, setCopiedHook] = useState(false);

  const handleCopyAllTags = () => {
    const tagString = seo.thirteenTags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopiedAllTags(true);
    setTimeout(() => setCopiedAllTags(false), 2000);
  };

  const handleCopySingleTag = (tag: string, idx: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedTagIdx(idx);
    setTimeout(() => setCopiedTagIdx(null), 1500);
  };

  const handleCopyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title);
    setCopiedTitleIdx(idx);
    setTimeout(() => setCopiedTitleIdx(null), 2000);
  };

  const handleCopyHook = (hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">Etsy SEO & Listing Launch Pack</h2>
            <p className="text-xs text-stone-500">Algorithmically optimized titles, tags, and listing hooks</p>
          </div>
        </div>

        <button
          onClick={handleCopyAllTags}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
            copiedAllTags
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
          }`}
        >
          {copiedAllTags ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAllTags ? 'Copied 13 Tags!' : 'Copy All 13 Tags'}</span>
        </button>
      </div>

      {/* Suggested Listing Titles */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>High-Converting Etsy Search Titles (Click to Copy)</span>
        </h3>
        <div className="space-y-2">
          {seo.suggestedTitles?.map((title, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyTitle(title, idx)}
              className="p-3 bg-stone-50 hover:bg-orange-50/60 border border-stone-200 hover:border-orange-300 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-200 group-hover:bg-orange-200 text-stone-700 group-hover:text-orange-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-stone-800 group-hover:text-orange-950">
                  {title}
                </span>
              </div>
              <span className="text-[11px] text-stone-400 group-hover:text-orange-600 font-mono shrink-0 flex items-center gap-1">
                {copiedTitleIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <span>{title.length}/140 chars</span>
                    <Copy className="w-3.5 h-3.5 opacity-60" />
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 13 Etsy Search Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>The 13 Etsy Search Tags (Click single tag to copy)</span>
          </h3>
          <span className="text-[11px] text-stone-500 font-mono">
            {seo.thirteenTags?.length || 0}/13 used
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {seo.thirteenTags?.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleCopySingleTag(tag, idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                copiedTagIdx === idx
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{tag}</span>
              {copiedTagIdx === idx ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <span className="text-[10px] text-stone-400 font-mono">({tag.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Target Buyer Persona & Description Hook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Buyer Persona */}
        <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Target Buyer Persona</span>
          </div>
          <p className="text-xs text-purple-950 leading-relaxed">
            {seo.targetBuyerPersona}
          </p>
        </div>

        {/* Description Hook */}
        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-2 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Opening Listing Hook</span>
            </div>
            <button
              onClick={() => handleCopyHook(seo.descriptionHook)}
              className="text-[11px] text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              {copiedHook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHook ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed italic">
            &ldquo;{seo.descriptionHook}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
