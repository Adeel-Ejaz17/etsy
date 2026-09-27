import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_DESIGNS } from './data/sampleDesigns';
import { EtsyAnalysisResult, SampleEtsyDesign } from './types';
import { fileToDataUrl, ensureRasterImage, downloadAnalysisMarkdown } from './utils/imageHelper';
import { PromptCard } from './components/PromptCard';
import { PromptStudioModal } from './components/PromptStudioModal';
import { UspWeakPointsTable } from './components/UspWeakPointsTable';
import { EtsySeoPanel } from './components/EtsySeoPanel';
import { ColorPaletteBar } from './components/ColorPaletteBar';
import { ApiKeyInfoModal } from './components/ApiKeyInfoModal';
import {
  Upload,
  Sparkles,
  Sliders,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Eye,
  RefreshCw,
  Zap,
  ShoppingBag,
  TrendingUp,
  Image as ImageIcon,
  Copy,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_DESIGNS[0].imageUrl);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(SAMPLE_DESIGNS[0].id);
  const [sellerFocus, setSellerFocus] = useState<string>('Wall Art & Printable Home Decor');
  const [preferredModel, setPreferredModel] = useState<string>('midjourney');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<EtsyAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prompts' | 'audit' | 'seo' | 'comparison'>('prompts');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [copiedMidjourney, setCopiedMidjourney] = useState(false);

  // Active prompt for modifier modal
  const [activeModifierPrompt, setActiveModifierPrompt] = useState<{
    prompt: string;
    modelType: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle paste events so users can just press Ctrl+V / Cmd+V with a screenshot!
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const dataUrl = await fileToDataUrl(file);
            setSelectedImage(dataUrl);
            setSelectedSampleId(null);
            setAnalysisResult(null);
            setErrorMessage(null);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setSelectedImage(dataUrl);
        setSelectedSampleId(null);
        setAnalysisResult(null);
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage('Failed to read uploaded image: ' + err.message);
      }
    }
  };

  // Handle drag and drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setSelectedImage(dataUrl);
        setSelectedSampleId(null);
        setAnalysisResult(null);
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage('Failed to read dropped image: ' + err.message);
      }
    }
  };

  // Run analysis
  const runAnalysis = async () => {
    if (!selectedImage) {
      setErrorMessage('Please upload or select an Etsy design screenshot first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisProgress('Rasterizing screenshot & inspecting visual canvas...');

    try {
      const { base64, mimeType } = await ensureRasterImage(selectedImage);

      setAnalysisProgress('Running Gemini 3.8 Flash Multimodal Vision audit...');

      const response = await fetch('/api/analyze-etsy-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          sellerFocus,
          preferredModel,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error status ${response.status}`);
      }

      setAnalysisProgress('Synthesizing USPs, weak points, and AI prompt matrix...');
      const data = await response.json();

      if (data.success && data.data) {
        setAnalysisResult(data.data);
      } else {
        throw new Error('Analysis response was malformed.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'Failed to complete analysis. Please verify your connection or try another image.'
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // Run initial analysis automatically for the pre-selected sample so the user immediately sees the rich experience
  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSample = (sample: SampleEtsyDesign) => {
    setSelectedImage(sample.imageUrl);
    setSelectedSampleId(sample.id);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const copyMidjourneyCommand = () => {
    if (!analysisResult) return;
    const mj = analysisResult.prompts.midjourney;
    const text = `/imagine prompt: ${mj.prompt} ${mj.parameters} --no ${mj.negativePrompt}`;
    navigator.clipboard.writeText(text);
    setCopiedMidjourney(true);
    setTimeout(() => setCopiedMidjourney(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-stone-900 text-base tracking-tight">
                  EtsyVision AI
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  USP & Prompt Engine
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Multimodal design audit & AI prompt reverse-engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors border border-stone-200"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>How It Works & API Key</span>
            </button>

            {analysisResult && (
              <button
                onClick={() => downloadAnalysisMarkdown(analysisResult)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Report (.md)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 w-full">
        {/* Top Info Banner answering the user prompt immediately */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-orange-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Etsy Digital Design Reverse-Engineering Workflow
              </h2>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Upload any screenshot of an Etsy digital listing. Gemini analyzes what makes it sell (<strong>USPs</strong>), identifies flaws &amp; technical gaps (<strong>weak points</strong>), and creates next-gen <strong>Midjourney v6.1, FLUX.1 &amp; Ideogram</strong> prompts to outrank it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <span className="text-[11px] font-medium text-amber-900 bg-amber-100/90 px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              API Key Configured Server-Side
            </span>
          </div>
        </div>

        {/* Input & Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Uploader & Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-orange-600" />
                  <span>Reference Design Screenshot</span>
                </span>
                <span className="text-[11px] text-stone-400">Paste anywhere (Ctrl+V)</span>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="relative group border-2 border-dashed border-stone-200 hover:border-orange-500 rounded-2xl bg-stone-50 hover:bg-orange-50/20 transition-all cursor-pointer overflow-hidden min-h-[260px] flex flex-col items-center justify-center p-4 text-center"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="relative w-full h-[280px] flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Selected Etsy Design"
                      className="max-h-full max-w-full object-contain rounded-xl shadow-xs group-hover:scale-[1.01] transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-medium gap-2 backdrop-blur-2xs">
                      <Upload className="w-4 h-4" />
                      <span>Click or Drop to Replace Screenshot</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-800">
                        Click to upload or drag &amp; drop screenshot
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        PNG, JPG, WEBP or paste from clipboard (Ctrl+V)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick sample buttons */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                  Or Test with Sample Etsy Digital Products:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_DESIGNS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                        selectedSampleId === sample.id
                          ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-400'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="w-8 h-10 object-cover rounded-md shrink-0 border border-stone-200"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[11px] text-stone-900 truncate">
                          {sample.title}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {sample.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced options */}
              <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Product Focus Niche
                  </label>
                  <select
                    value={sellerFocus}
                    onChange={(e) => setSellerFocus(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Wall Art & Printable Home Decor">Wall Art & Printable Decor</option>
                    <option value="SVG Cut Files & Sublimation Clipart">SVG & Clipart Bundles</option>
                    <option value="Canva Digital Planner & Templates">Canva Planners & Templates</option>
                    <option value="Tumbler Wraps & Mug Sublimation">Tumbler & Mug Wraps</option>
                    <option value="Digital Stickers & GoodNotes">Stickers & GoodNotes Planners</option>
                    <option value="Event Invitations & Stationery">Invitations & Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Primary Target Generator
                  </label>
                  <select
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="midjourney">Midjourney v6.1 (Art & Textures)</option>
                    <option value="flux">FLUX.1 (Photoreal & Composition)</option>
                    <option value="ideogram">Ideogram v2 (Typography & Graphics)</option>
                    <option value="dalle3">DALL-E 3 (Clean Stylization)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !selectedImage}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Design &amp; Crafting Prompts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze USPs, Flaws &amp; Generate Prompts</span>
                  </>
                )}
              </button>

              {/* Progress message */}
              {isAnalyzing && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                  <span>{analysisProgress}</span>
                </div>
              )}

              {/* Error message */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice: </span>
                    {errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Results Dashboard (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {analysisResult ? (
              <div className="space-y-5">
                {/* Score & Header Card */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                          {analysisResult.productCategory}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                          {analysisResult.aestheticStyle}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-stone-900 mt-1.5 tracking-tight">
                        {analysisResult.productTitle}
                      </h2>
                    </div>

                    {/* Overall Score Gauge */}
                    <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-2xl shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          Market Potential
                        </div>
                        <div className="text-lg font-black text-stone-900">
                          {analysisResult.overallScore}<span className="text-xs font-normal text-stone-400">/100</span>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-orange-600 shrink-0" />
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                          Etsy Price Range
                        </span>
                        <span className="font-semibold text-stone-900">
                          {analysisResult.estimatedPriceRange}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-semibold">
                          Target Buyer Persona
                        </span>
                        <span className="font-semibold text-stone-900 truncate block max-w-[240px]">
                          {analysisResult.targetAudience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <ColorPaletteBar palette={analysisResult.colorPalette} />
                </div>

                {/* Dashboard Tabs */}
                <div className="flex items-center gap-2 border-b border-stone-200 pb-1 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('prompts')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'prompts'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Prompt Matrix ({4 + (analysisResult.prompts.variations?.length || 0)})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'audit'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>USPs &amp; Weak Points ({analysisResult.uniqueSellingPoints?.length + analysisResult.weakPointsAndFlaws?.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'seo'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    <span>Etsy SEO &amp; 13 Tags</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('comparison')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === 'comparison'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Side-by-Side View</span>
                  </button>
                </div>

                {/* Tab 1: AI Prompt Engine */}
                {activeTab === 'prompts' && (
                  <div className="space-y-4">
                    {/* Top Action Bar */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-amber-950 font-medium">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Ready-to-use prompts engineered to fix reference flaws</span>
                      </div>
                      <button
                        onClick={copyMidjourneyCommand}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedMidjourney ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedMidjourney ? 'Copied Midjourney!' : 'Quick Copy Midjourney'}</span>
                      </button>
                    </div>

                    {/* Midjourney v6.1 Card */}
                    <PromptCard
                      toolName="Midjourney v6.1 (Production Standard)"
                      badgeColor="bg-cyan-500"
                      prompt={analysisResult.prompts.midjourney.prompt}
                      parameters={analysisResult.prompts.midjourney.parameters}
                      negativePrompt={analysisResult.prompts.midjourney.negativePrompt}
                      rationale={analysisResult.prompts.midjourney.rationale}
                      onCustomize={() =>
                        setActiveModifierPrompt({
                          prompt: analysisResult.prompts.midjourney.prompt,
                          modelType: 'Midjourney v6.1',
                        })
                      }
                    />

                    {/* FLUX.1 Card */}
                    <PromptCard
                      toolName="FLUX.1 (Photorealism & Complex Details)"
                      badgeColor="bg-purple-500"
                      prompt={analysisResult.prompts.flux.prompt}
                      specialInstructions={analysisResult.prompts.flux.guidance}
                      rationale={analysisResult.prompts.flux.rationale}
                      onCustomize={() =>
                        setActiveModifierPrompt({
                          prompt: analysisResult.prompts.flux.prompt,
                          modelType: 'FLUX.1',
                        })
                      }
                    />

                    {/* Ideogram v2 Card */}
                    <PromptCard
                      toolName="Ideogram v2 (Specialized for Graphic Badges & Typography)"
                      badgeColor="bg-emerald-500"
                      prompt={analysisResult.prompts.ideogram.prompt}
                      specialInstructions={analysisResult.prompts.ideogram.typographyInstructions}
                      rationale={analysisResult.prompts.ideogram.rationale}
                      onCustomize={() =>
                        setActiveModifierPrompt({
                          prompt: analysisResult.prompts.ideogram.prompt,
                          modelType: 'Ideogram v2',
                        })
                      }
                    />

                    {/* DALL-E 3 Card */}
                    <PromptCard
                      toolName="DALL-E 3 / ChatGPT Plus"
                      badgeColor="bg-rose-500"
                      prompt={analysisResult.prompts.dalle3.prompt}
                      specialInstructions={analysisResult.prompts.dalle3.styleSettings}
                      rationale={analysisResult.prompts.dalle3.rationale}
                      onCustomize={() =>
                        setActiveModifierPrompt({
                          prompt: analysisResult.prompts.dalle3.prompt,
                          modelType: 'DALL-E 3',
                        })
                      }
                    />

                    {/* Spin-Off Variations */}
                    {analysisResult.prompts.variations?.length > 0 && (
                      <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-purple-600" />
                          <h3 className="text-sm font-bold text-stone-900">
                            3 Creative Product Spin-Off Variations (High-Ticket Bundle Ideas)
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {analysisResult.prompts.variations.map((v, i) => (
                            <div
                              key={i}
                              className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col justify-between space-y-2.5 text-xs hover:border-purple-300 transition-colors"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-stone-900">{v.title}</span>
                                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                    {v.recommendedModel}
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-500 mb-2">{v.conceptAngle}</p>
                                <div className="p-2.5 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] leading-relaxed line-clamp-4 select-all">
                                  {v.prompt}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(v.prompt);
                                }}
                                className="w-full py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg font-medium text-[11px] flex items-center justify-center gap-1 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Variation Prompt</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: USPs & Weak Points Audit */}
                {activeTab === 'audit' && (
                  <UspWeakPointsTable
                    usps={analysisResult.uniqueSellingPoints}
                    weakPoints={analysisResult.weakPointsAndFlaws}
                    competitiveOpportunity={analysisResult.competitiveOpportunity}
                  />
                )}

                {/* Tab 3: Etsy SEO & 13 Tags */}
                {activeTab === 'seo' && (
                  <EtsySeoPanel seo={analysisResult.etsyListingSEO} />
                )}

                {/* Tab 4: Side-by-Side Comparison */}
                {activeTab === 'comparison' && (
                  <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5 shadow-sm">
                    <h3 className="text-base font-bold text-stone-900">
                      Reference Screenshot vs. AI Prompt Upgrade Strategy
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Original */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span>Original Etsy Listing Screenshot</span>
                        </div>
                        <div className="border border-stone-200 rounded-2xl p-2 bg-stone-50 flex items-center justify-center min-h-[300px]">
                          {selectedImage && (
                            <img
                              src={selectedImage}
                              alt="Original"
                              className="max-h-[360px] object-contain rounded-xl shadow-xs"
                            />
                          )}
                        </div>
                        <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-900">
                          <span className="font-bold">Identified Flaws: </span>
                          {analysisResult.weakPointsAndFlaws?.map((w) => w.title).join(' • ')}
                        </div>
                      </div>

                      {/* Upgrade Plan */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Midjourney v6.1 Production Upgrade</span>
                        </div>
                        <div className="border border-stone-800 rounded-2xl p-4 bg-stone-950 text-stone-100 min-h-[300px] flex flex-col justify-between font-mono text-xs">
                          <div className="space-y-3">
                            <span className="text-amber-400 font-bold">/imagine prompt:</span>
                            <p className="text-stone-100 leading-relaxed">
                              {analysisResult.prompts.midjourney.prompt}
                            </p>
                            <p className="text-cyan-400 font-semibold">
                              {analysisResult.prompts.midjourney.parameters}
                            </p>
                            <p className="text-rose-400">
                              --no {analysisResult.prompts.midjourney.negativePrompt}
                            </p>
                          </div>

                          <button
                            onClick={copyMidjourneyCommand}
                            className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-sans font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt Command for Discord / Web</span>
                          </button>
                        </div>
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                          <span className="font-bold">What&apos;s Improved: </span>
                          {analysisResult.prompts.midjourney.rationale}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-sm space-y-4 flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-base font-bold text-stone-900">
                    Ready to Teardown Your Etsy Screenshot
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Click &ldquo;Analyze USPs, Flaws &amp; Generate Prompts&rdquo; to unlock the commercial teardown, color swatches, 13 Etsy SEO tags, and Midjourney/FLUX prompt recipes.
                  </p>
                </div>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing || !selectedImage}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
                >
                  <span>Start Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modifier Modal */}
      {activeModifierPrompt && (
        <PromptStudioModal
          isOpen={!!activeModifierPrompt}
          onClose={() => setActiveModifierPrompt(null)}
          initialPrompt={activeModifierPrompt.prompt}
          modelType={activeModifierPrompt.modelType}
        />
      )}

      {/* API Key & Architecture Explanation Modal */}
      <ApiKeyInfoModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            EtsyVision AI • Built for Etsy Digital Product Creators, Print-On-Demand &amp; AI Prompt Engineers
          </p>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              API Key &amp; Technical Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
