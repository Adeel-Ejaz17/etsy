import React, { useState } from 'react';
import { X, Sparkles, Sliders, RefreshCw, Copy, Check, ArrowRight } from 'lucide-react';

interface PromptStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  modelType: string;
}

export const PromptStudioModal: React.FC<PromptStudioModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  modelType,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aesthetic, setAesthetic] = useState('Scandi Minimalist Neutral');
  const [lighting, setLighting] = useState('Soft diffused morning light');
  const [medium, setMedium] = useState('Fine art watercolor wash on textured paper');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [customNote, setCustomNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<{
    enhancedPrompt: string;
    recommendedSettings: string;
    keyChangesSummary: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTweak = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tweak-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basePrompt: prompt,
          modelType,
          aestheticModifier: aesthetic,
          lightingModifier: lighting,
          mediumModifier: medium,
          customInstruction: `${customNote}. Target aspect ratio: ${aspectRatio}`,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setEnhancedResult(resData.data);
      }
    } catch (err) {
      console.error('Failed to tweak prompt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">Prompt Studio & Modifier</h2>
              <p className="text-stone-500 text-xs">Tune style, lighting, texture, and aspect ratio for {modelType}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Base Prompt */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Working Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full text-xs font-mono p-3 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Quick Modifier Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">Aspect Ratio (Print standard)</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="4:5">4:5 (Standard Etsy 8x10, 16x20 Wall Art)</option>
                <option value="2:3">2:3 (24x36 Poster Print)</option>
                <option value="3:4">3:4 (18x24 Print Frame)</option>
                <option value="1:1">1:1 (Square, Clipart, Tumbler, Stickers)</option>
                <option value="16:9">16:9 (Frame TV Art, Desktop Wallpaper)</option>
              </select>
            </div>

            {/* Aesthetic Style */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">Aesthetic Preset</label>
              <select
                value={aesthetic}
                onChange={(e) => setAesthetic(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Scandi Minimalist Neutral">Scandi Minimalist Neutral & Japandi</option>
                <option value="Boho Earthy Terracotta">Boho Earthy Terracotta & Mustard Warm</option>
                <option value="70s Retro Groovy Vintage">70s Retro Groovy Vintage & Halftone</option>
                <option value="Dark Academia Botanical">Dark Academia Botanical & Gold Accents</option>
                <option value="Pastel Cute Kawaii Nursery">Pastel Cute Kawaii Nursery</option>
                <option value="Bold Modern Abstract Bauhaus">Bold Modern Abstract Bauhaus</option>
              </select>
            </div>

            {/* Lighting */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">Lighting Mood</label>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Soft diffused morning studio light">Soft Diffused Studio Daylight</option>
                <option value="Warm golden hour sunlight with delicate shadows">Warm Golden Hour Sunlight</option>
                <option value="Moody cinematic chiaroscuro shadow play">Moody Cinematic Chiaroscuro</option>
                <option value="Clean shadowless flat light (best for SVG/clipart)">Clean Shadowless Flat Light</option>
              </select>
            </div>

            {/* Medium & Texture */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">Medium & Texture</label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Fine art watercolor wash on heavy cotton rag paper">Fine Art Watercolor Wash</option>
                <option value="Crisp clean vector illustration with smooth edges">Crisp Flat Vector (SVG style)</option>
                <option value="Vintage risograph screenprint with grain texture">Vintage Risograph Screenprint</option>
                <option value="Textured acrylic impasto palette knife painting">Textured Acrylic Impasto</option>
                <option value="Minimalist line art illustration with delicate stroke">Delicate Minimalist Line Art</option>
              </select>
            </div>
          </div>

          {/* Custom instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">Custom Adjustment (Optional)</label>
            <input
              type="text"
              placeholder="e.g., 'Make it more suitable for a nursery wall', 'add gold leaf veins'"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Action button */}
          <button
            onClick={handleTweak}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-engineering Prompt with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Enhanced Prompt Variation</span>
              </>
            )}
          </button>

          {/* Enhanced Result Box */}
          {enhancedResult && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                  Enhanced New Prompt
                </span>
                <button
                  onClick={() => handleCopy(`${enhancedResult.enhancedPrompt} ${enhancedResult.recommendedSettings}`)}
                  className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-stone-950 text-stone-100 rounded-xl font-mono text-xs leading-relaxed border border-stone-800">
                <span className="text-stone-100">{enhancedResult.enhancedPrompt}</span>{' '}
                <span className="text-cyan-400 font-semibold">{enhancedResult.recommendedSettings}</span>
              </div>

              <div className="text-xs text-amber-800">
                <span className="font-semibold text-amber-950">Enhancement Summary: </span>
                {enhancedResult.keyChangesSummary}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
