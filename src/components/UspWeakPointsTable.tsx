import React, { useState } from 'react';
import { USPItem, WeakPointItem, CompetitiveOpportunity } from '../types';
import { CheckCircle2, AlertTriangle, Trophy, PackagePlus, Compass, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface UspWeakPointsTableProps {
  usps: USPItem[];
  weakPoints: WeakPointItem[];
  competitiveOpportunity: CompetitiveOpportunity;
}

export const UspWeakPointsTable: React.FC<UspWeakPointsTableProps> = ({
  usps,
  weakPoints,
  competitiveOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'usps' | 'weaknesses'>('both');

  const getImpactBadge = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'crucial':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">🔥 Crucial Driver</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">High Impact</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">Moderate</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">Critical Flaw</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Moderate Gap</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">Minor Polish</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Design Audit: USPs & Weak Points</h2>
          <p className="text-xs text-stone-500">Commercial viability teardown for the reference Etsy listing</p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'both' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Insights
          </button>
          <button
            onClick={() => setActiveTab('usps')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'usps' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            USPs Only ({usps?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('weaknesses')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'weaknesses' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Weak Points ({weakPoints?.length || 0})
          </button>
        </div>
      </div>

      {/* Grid of USPs vs Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* USPs Column */}
        {(activeTab === 'both' || activeTab === 'usps') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">Unique Selling Propositions (USPs)</h3>
                  <p className="text-emerald-700 text-xs">What hooks buyers and drives clicks in search</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                {usps?.length || 0} Identified
              </span>
            </div>

            <div className="space-y-3">
              {usps?.map((usp, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-emerald-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {usp.title}
                    </h4>
                    {getImpactBadge(usp.impact)}
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed pl-7">
                    {usp.description}
                  </p>

                  {usp.visualHook && (
                    <div className="ml-7 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                      <span className="font-bold text-emerald-950 shrink-0">Visual Hook:</span>
                      <span>{usp.visualHook}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Points Column */}
        {(activeTab === 'both' || activeTab === 'weaknesses') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-rose-50/70 border border-rose-200/80 p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-600 text-white rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 text-sm">Weak Points & Flaws</h3>
                  <p className="text-rose-700 text-xs">Technical or commercial shortcomings to fix</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md">
                {weakPoints?.length || 0} Flaws
              </span>
            </div>

            <div className="space-y-3">
              {weakPoints?.map((weak, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-rose-300 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 mb-1 inline-block">
                        {weak.category}
                      </span>
                      <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {weak.title}
                      </h4>
                    </div>
                    {getSeverityBadge(weak.severity)}
                  </div>

                  {/* Critique */}
                  <div className="pl-7 space-y-1.5">
                    <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="font-semibold text-stone-800">The Problem: </span>
                      {weak.critique}
                    </div>

                    {/* Fix Recommendation */}
                    <div className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                      <span className="font-semibold text-amber-950">How to Fix in Your Prompt: </span>
                      {weak.fixRecommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategic Opportunity & Moat */}
      {competitiveOpportunity && (
        <div className="mt-8 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Competitive 10x Moat Formula</h3>
              <p className="text-stone-400 text-xs">How you can outrank this seller and capture market share</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* How to Outrank */}
            <div className="p-4 bg-stone-800/60 rounded-2xl border border-stone-700/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>Strategy to Beat This Listing</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                {competitiveOpportunity.howToBeatThisListing}
              </p>
            </div>

            {/* High AOV Bundle Strategy */}
            <div className="p-4 bg-stone-800/60 rounded-2xl border border-stone-700/60 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <PackagePlus className="w-4 h-4" />
                <span>Bundle & High-Ticket Expansion</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                {competitiveOpportunity.bundleStrategy}
              </p>
            </div>
          </div>

          {/* Micro-Niches */}
          {competitiveOpportunity.untappedNicheAngles?.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mb-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Untapped Micro-Niche Keywords & Angles:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {competitiveOpportunity.untappedNicheAngles.map((niche, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-950/60 text-purple-200 border border-purple-800/60 rounded-full text-xs"
                  >
                    ✦ {niche}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
