import React from 'react';
import { X, Key, ShieldCheck, Cpu, Lightbulb, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ApiKeyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyInfoModal: React.FC<ApiKeyInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-xs">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">How It Works & API Key Answer</h2>
          </div>
          <p className="text-orange-100 text-sm">
            Answers to your exact question: How this is built and whether an API key is used.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-700 text-sm leading-relaxed">
          {/* Answer 1: Where to get a free Gemini API key */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 font-semibold text-emerald-950 text-base">
              <Key className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Where to Get a 100% Free Gemini API Key</span>
            </div>
            <p className="text-emerald-900 text-xs sm:text-sm">
              You can get a free Gemini API key directly from <strong>Google AI Studio</strong> in under 60 seconds with no credit card required for the free tier.
            </p>
            
            <div className="bg-white/80 rounded-xl p-3 border border-emerald-200/80 space-y-2 text-xs">
              <div className="font-semibold text-emerald-950">Quick Step-by-Step:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-emerald-900">
                <li>
                  Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-700 hover:text-emerald-900">Google AI Studio (aistudio.google.com/app/apikey)</a>.
                </li>
                <li>Sign in with your regular Google account.</li>
                <li>Click <strong>&ldquo;Create API key&rdquo;</strong> (or <strong>&ldquo;Get API key&rdquo;</strong>).</li>
                <li>Choose or create a free Google Cloud project and click <strong>&ldquo;Create API key in existing project&rdquo;</strong>.</li>
                <li>Copy your key! The free tier includes high rate limits (up to 15 Requests Per Minute on flash models at no cost).</li>
              </ol>
            </div>

            <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 bg-emerald-100/60 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>In this Applet:</strong> If running in Google AI Studio Build, the key is already connected under the hood through your project environment!</span>
            </div>
          </div>

          {/* Answer 2: Is an API key used? */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-900 text-base">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Is an API key used in this tool?</span>
            </div>
            <p className="text-amber-800">
              <strong>Yes!</strong> This tool uses a <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">GEMINI_API_KEY</code> to communicate with Google&apos;s multimodal vision models.
            </p>
            <ul className="space-y-1.5 pt-1 text-amber-900 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Browser Exposure:</strong> The API key is stored securely on the Node.js Express backend server via <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">process.env.GEMINI_API_KEY</code>. It is never exposed to the client or browser bundle.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Manual Key Paste Required:</strong> In this Google AI Studio environment, the server automatically reads your configured API key seamlessly.</span>
              </li>
            </ul>
          </div>

          {/* Answer 2: How is this tool built? */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-600" />
              <span>How this tool is built (Architecture & Stack)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border border-stone-200 rounded-xl bg-stone-50">
                <div className="flex items-center gap-2 font-medium text-stone-900 mb-1 text-xs">
                  <Code2 className="w-4 h-4 text-orange-600" />
                  <span>1. Multimodal Vision Pipeline</span>
                </div>
                <p className="text-xs text-stone-600">
                  Uploaded screenshots (PNG/JPEG) are converted into base64 inline buffers and sent to <code className="font-mono text-orange-700 font-medium">gemini-3.8-flash</code> on the backend.
                </p>
              </div>

              <div className="p-3 border border-stone-200 rounded-xl bg-stone-50">
                <div className="flex items-center gap-2 font-medium text-stone-900 mb-1 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>2. Etsy Heuristic Prompting</span>
                </div>
                <p className="text-xs text-stone-600">
                  A specialized system instruction commands Gemini to act as a top 0.1% Etsy seller and commercial art director to extract USPs, weak points, and market gaps.
                </p>
              </div>

              <div className="p-3 border border-stone-200 rounded-xl bg-stone-50">
                <div className="flex items-center gap-2 font-medium text-stone-900 mb-1 text-xs">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>3. Structured Schema Enforcement</span>
                </div>
                <p className="text-xs text-stone-600">
                  The API uses <code className="font-mono text-purple-700 font-medium">responseSchema</code> to guarantee 100% valid JSON with exact types for color swatches, flaw severity, and Midjourney flags.
                </p>
              </div>

              <div className="p-3 border border-stone-200 rounded-xl bg-stone-50">
                <div className="flex items-center gap-2 font-medium text-stone-900 mb-1 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>4. Midjourney & FLUX Synthesizer</span>
                </div>
                <p className="text-xs text-stone-600">
                  The reference strengths are preserved while the identified flaws are systematically inverted into positive prompting instructions and negative flags.
                </p>
              </div>
            </div>
          </div>

          {/* Etsy Seller Workflow */}
          <div className="p-4 bg-stone-100 rounded-xl space-y-2">
            <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">How to use for your Etsy Shop</h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600">
              <li>Take a screenshot of any trending or competitor Etsy digital product (wall art, SVG, planner, clipart).</li>
              <li>Drop it into this tool to instantly see why it sells (USPs) and what it does wrong (weak points).</li>
              <li>Copy the optimized Midjourney, FLUX, or Ideogram prompt into your AI generator.</li>
              <li>Use the provided 13 Etsy SEO tags and listing titles to launch your own superior product!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Got it, Let&apos;s Analyze
          </button>
        </div>
      </div>
    </div>
  );
};
