export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface USPItem {
  title: string;
  description: string;
  impact: 'Crucial' | 'High' | 'Moderate' | string;
  visualHook: string;
}

export interface WeakPointItem {
  category: 'Typography' | 'Composition' | 'Color Harmony' | 'Commercial Value' | 'Saturation' | string;
  title: string;
  critique: string;
  fixRecommendation: string;
  severity: 'High' | 'Medium' | 'Low' | string;
}

export interface CompetitiveOpportunity {
  howToBeatThisListing: string;
  bundleStrategy: string;
  untappedNicheAngles: string[];
}

export interface MidjourneyPrompt {
  prompt: string;
  parameters: string;
  rationale: string;
  negativePrompt: string;
}

export interface FluxPrompt {
  prompt: string;
  guidance: string;
  rationale: string;
}

export interface IdeogramPrompt {
  prompt: string;
  typographyInstructions: string;
  rationale: string;
}

export interface Dalle3Prompt {
  prompt: string;
  styleSettings: string;
  rationale: string;
}

export interface PromptVariation {
  title: string;
  conceptAngle: string;
  prompt: string;
  recommendedModel: string;
}

export interface EtsyListingSEO {
  suggestedTitles: string[];
  thirteenTags: string[];
  targetBuyerPersona: string;
  descriptionHook: string;
}

export interface EtsyAnalysisResult {
  productTitle: string;
  productCategory: string;
  aestheticStyle: string;
  targetAudience: string;
  estimatedPriceRange: string;
  overallScore: number;
  colorPalette: ColorSwatch[];
  uniqueSellingPoints: USPItem[];
  weakPointsAndFlaws: WeakPointItem[];
  competitiveOpportunity: CompetitiveOpportunity;
  prompts: {
    midjourney: MidjourneyPrompt;
    flux: FluxPrompt;
    ideogram: IdeogramPrompt;
    dalle3: Dalle3Prompt;
    variations: PromptVariation[];
  };
  etsyListingSEO: EtsyListingSEO;
}

export interface SampleEtsyDesign {
  id: string;
  title: string;
  category: string;
  style: string;
  imageUrl: string;
  dataUrl?: string;
  sampleDescription: string;
}
