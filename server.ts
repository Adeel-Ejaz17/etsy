import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Shared Gemini client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    productTitle: { type: Type.STRING, description: 'Descriptive title of the digital product shown' },
    productCategory: { type: Type.STRING, description: 'Etsy digital category (e.g. Wall Art, Printable Planner, SVG Bundle, Canva Template, Tumbler Wrap, Sticker Pack)' },
    aestheticStyle: { type: Type.STRING, description: 'Aesthetic classification (e.g. Boho Botanical, 70s Retro Groovy, Dark Academia, Minimalist Neutral, Watercolor Floral)' },
    targetAudience: { type: Type.STRING, description: 'Specific buyer persona on Etsy' },
    estimatedPriceRange: { type: Type.STRING, description: 'Realistic Etsy pricing estimate in USD' },
    overallScore: { type: Type.INTEGER, description: 'Market appeal and design score from 1 to 100' },
    colorPalette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          hex: { type: Type.STRING },
          role: { type: Type.STRING, description: 'Role of color in the design (Background, Main Subject, Accent, Text)' },
        },
        required: ['name', 'hex', 'role'],
      },
    },
    uniqueSellingPoints: {
      type: Type.ARRAY,
      description: 'The USPs that make this design attractive or convert buyers',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impact: { type: Type.STRING, description: 'Crucial, High, or Moderate' },
          visualHook: { type: Type.STRING, description: 'The visual element that grabs attention in search results' },
        },
        required: ['title', 'description', 'impact', 'visualHook'],
      },
    },
    weakPointsAndFlaws: {
      type: Type.ARRAY,
      description: 'Design flaws, technical weaknesses, or commercial shortcomings of this reference',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: 'Typography, Composition, Color Harmony, Commercial Value, or Saturation' },
          title: { type: Type.STRING },
          critique: { type: Type.STRING, description: 'What is wrong or suboptimal about this element' },
          fixRecommendation: { type: Type.STRING, description: 'Actionable step-by-step fix to improve upon it' },
          severity: { type: Type.STRING, description: 'High, Medium, or Low' },
        },
        required: ['category', 'title', 'critique', 'fixRecommendation', 'severity'],
      },
    },
    competitiveOpportunity: {
      type: Type.OBJECT,
      properties: {
        howToBeatThisListing: { type: Type.STRING, description: 'Strategic formula to create a 10x superior listing' },
        bundleStrategy: { type: Type.STRING, description: 'Suggested multi-pack or bundle angle to increase average order value' },
        untappedNicheAngles: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3-4 related underserved micro-niches or keywords',
        },
      },
      required: ['howToBeatThisListing', 'bundleStrategy', 'untappedNicheAngles'],
    },
    prompts: {
      type: Type.OBJECT,
      properties: {
        midjourney: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: 'Production-ready Midjourney v6 prompt optimizing strengths and correcting flaws' },
            parameters: { type: Type.STRING, description: 'Recommended flags (e.g. --ar 4:5 --v 6.1 --style raw --stylize 120)' },
            rationale: { type: Type.STRING, description: 'Why this prompt produces a superior design to the reference' },
            negativePrompt: { type: Type.STRING, description: 'Elements to avoid (--no ...)' },
          },
          required: ['prompt', 'parameters', 'rationale', 'negativePrompt'],
        },
        flux: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: 'Production-ready prompt for FLUX.1 (detailed natural language phrasing)' },
            guidance: { type: Type.STRING, description: 'Recommended steps, CFG scale, or LoRA advice' },
            rationale: { type: Type.STRING, description: 'Why this prompt works well on FLUX.1' },
          },
          required: ['prompt', 'guidance', 'rationale'],
        },
        ideogram: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: 'Prompt specialized for Ideogram v2 (handles integrated typography and graphic badges)' },
            typographyInstructions: { type: Type.STRING, description: 'Quotes or font styling specifications' },
            rationale: { type: Type.STRING, description: 'Why Ideogram is suited for this text/graphic structure' },
          },
          required: ['prompt', 'typographyInstructions', 'rationale'],
        },
        dalle3: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING, description: 'Clean descriptive prompt tailored for DALL-E 3 / ChatGPT Plus' },
            styleSettings: { type: Type.STRING, description: 'Vivid or Natural recommendation' },
            rationale: { type: Type.STRING, description: 'Why this works for DALL-E 3' },
          },
          required: ['prompt', 'styleSettings', 'rationale'],
        },
        variations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Name of the spin-off concept (e.g. Seasonal Holiday Variant, Moody Monochrome, Duo Tone)' },
              conceptAngle: { type: Type.STRING, description: 'The unique angle or spin-off direction' },
              prompt: { type: Type.STRING, description: 'Complete prompt ready to generate' },
              recommendedModel: { type: Type.STRING, description: 'Midjourney, FLUX, or Ideogram' },
            },
            required: ['title', 'conceptAngle', 'prompt', 'recommendedModel'],
          },
        },
      },
      required: ['midjourney', 'flux', 'ideogram', 'dalle3', 'variations'],
    },
    etsyListingSEO: {
      type: Type.OBJECT,
      properties: {
        suggestedTitles: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 high-converting Etsy listing titles using Etsy search algorithm conventions (under 140 chars)'
        },
        thirteenTags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Exactly 13 high-volume search tags for Etsy listing (each under 20 characters)',
        },
        targetBuyerPersona: { type: Type.STRING, description: 'Detailed breakdown of who buys this and what occasion' },
        descriptionHook: { type: Type.STRING, description: 'First 2 punchy lines of the Etsy listing description' },
      },
      required: ['suggestedTitles', 'thirteenTags', 'targetBuyerPersona', 'descriptionHook'],
    },
  },
  required: [
    'productTitle',
    'productCategory',
    'aestheticStyle',
    'targetAudience',
    'estimatedPriceRange',
    'overallScore',
    'colorPalette',
    'uniqueSellingPoints',
    'weakPointsAndFlaws',
    'competitiveOpportunity',
    'prompts',
    'etsyListingSEO',
  ],
};

// API Endpoint to analyze uploaded Etsy design screenshot
app.post('/api/analyze-etsy-design', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', sellerFocus, preferredModel = 'midjourney' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body.' });
    }

    // Strip data URL prefix if provided
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const systemInstruction = `You are a world-class Etsy Top 0.1% Digital Product Strategist, Senior Commercial Art Director, and Master AI Prompt Engineer for Midjourney v6, FLUX.1, Ideogram v2, and DALL-E 3.
Your mission is to meticulously inspect the uploaded Etsy digital product screenshot or artwork.
Conduct a rigorous commercial teardown:
1. Identify the EXACT Unique Selling Propositions (USPs) that capture buyers' clicks in crowded Etsy search feeds.
2. Uncover the subtle or glaring WEAK POINTS (e.g. muddy color contrasts, awkward typography, cluttered layout, poor print scalability, oversaturated cliche motifs, lack of commercial licensing appeal).
3. Create actionable competitive differentiation strategies (how another seller can 10x improve this design and dominate the niche).
4. Formulate precision-engineered AI prompts for Midjourney v6.1, FLUX.1, Ideogram v2, and DALL-E 3 that keep the winning essence of the reference image while systematically fixing all weak points and elevating visual fidelity.
5. Provide Etsy listing SEO optimization including 13 algorithmic tags (max 20 chars each) and click-through-rate optimized titles.`;

    const userPrompt = `Analyze this Etsy digital product screenshot in extreme depth.
Seller focus / specific notes: ${sellerFocus ? sellerFocus : 'General Etsy digital product optimization'}.
Preferred primary AI tool: ${preferredModel}.

Evaluate the visual hierarchy, color palette, typography (if any), composition, target audience, USPs, weak points, and generate optimized AI generation prompts that build upon this reference image while fixing its flaws.`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: userPrompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini API.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error analyzing Etsy screenshot:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze design.',
      details: err.toString(),
    });
  }
});

// API Endpoint to fine-tune or modify prompts based on user tweaks
app.post('/api/tweak-prompt', async (req, res) => {
  try {
    const { basePrompt, modelType, aestheticModifier, lightingModifier, mediumModifier, customInstruction } = req.body;

    const tweakSystemPrompt = `You are a master AI image prompt engineer specializing in Etsy digital products. 
Given an existing prompt and requested modifications (aesthetic style, lighting, medium, and custom instructions), rewrite and optimize the prompt to produce maximum visual impact, crisp commercial render quality, and perfect alignment with print-on-demand requirements.`;

    const tweakUserPrompt = `Original prompt: "${basePrompt}"
Target AI Model: ${modelType || 'Midjourney v6.1'}
Aesthetic Modifier: ${aestheticModifier || 'None'}
Lighting Modifier: ${lightingModifier || 'None'}
Medium / Texture: ${mediumModifier || 'None'}
Custom Request: ${customInstruction || 'Elevate print quality and commercial vibrancy'}

Return a JSON with:
{
  "enhancedPrompt": "The full rewritten prompt",
  "recommendedSettings": "Aspect ratio, model flags, or CFG parameters",
  "keyChangesSummary": "Brief explanation of what was enhanced"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: tweakUserPrompt,
      config: {
        systemInstruction: tweakSystemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: { type: Type.STRING },
            recommendedSettings: { type: Type.STRING },
            keyChangesSummary: { type: Type.STRING },
          },
          required: ['enhancedPrompt', 'recommendedSettings', 'keyChangesSummary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error tweaking prompt:', err);
    return res.status(500).json({ error: err.message || 'Failed to tweak prompt.' });
  }
});

// Dev vs Prod Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
