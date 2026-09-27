import { EtsyAnalysisResult } from '../types';

/**
 * Reads a File object and converts to Base64 data URL.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Ensures any image data URL (especially SVG) is rasterized to a PNG
 * so Gemini Vision model receives standard image/png or image/jpeg bytes.
 */
export async function ensureRasterImage(dataUrl: string): Promise<{ base64: string; mimeType: string }> {
  // If already standard JPEG/PNG/WEBP raster image, extract mime and base64 directly
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
    return {
      base64: dataUrl.replace(/^data:image\/jpeg;base64,/, '').replace(/^data:image\/jpg;base64,/, ''),
      mimeType: 'image/jpeg',
    };
  }

  if (dataUrl.startsWith('data:image/png')) {
    return {
      base64: dataUrl.replace(/^data:image\/png;base64,/, ''),
      mimeType: 'image/png',
    };
  }

  if (dataUrl.startsWith('data:image/webp')) {
    return {
      base64: dataUrl.replace(/^data:image\/webp;base64,/, ''),
      mimeType: 'image/webp',
    };
  }

  // If SVG data URL or other format, render onto canvas to convert to PNG
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context not available'));
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngDataUrl = canvas.toDataURL('image/png', 0.95);
      const cleanBase64 = pngDataUrl.replace(/^data:image\/png;base64,/, '');
      resolve({
        base64: cleanBase64,
        mimeType: 'image/png',
      });
    };
    img.onerror = (e) => reject(new Error('Failed to load image for rasterization: ' + e));
    img.src = dataUrl;
  });
}

/**
 * Generates and downloads a rich Markdown report of the analysis
 */
export function downloadAnalysisMarkdown(result: EtsyAnalysisResult) {
  const md = `# Etsy Digital Design Audit & AI Prompt Report
**Product Title:** ${result.productTitle}
**Category:** ${result.productCategory}
**Aesthetic Style:** ${result.aestheticStyle}
**Market Potential Score:** ${result.overallScore}/100
**Target Buyer Persona:** ${result.targetAudience}
**Estimated Price Sweet Spot:** ${result.estimatedPriceRange}

---

## 🎨 Aesthetic Color Palette
${result.colorPalette.map(c => `- **${c.name}** (\`${c.hex}\`): ${c.role}`).join('\n')}

---

## 🌟 Unique Selling Propositions (USPs)
${result.uniqueSellingPoints.map((usp, i) => `### ${i + 1}. ${usp.title} [Impact: ${usp.impact}]
- **Why it converts:** ${usp.description}
- **Visual Hook in search:** ${usp.visualHook}`).join('\n\n')}

---

## ⚠️ Weak Points & Design Flaws
${result.weakPointsAndFlaws.map((w, i) => `### ${i + 1}. [${w.category}] ${w.title} [Severity: ${w.severity}]
- **Critique:** ${w.critique}
- **Recommended Action:** ${w.fixRecommendation}`).join('\n\n')}

---

## 🏆 Competitive 10x Moat & Expansion Strategy
- **How to Beat This Listing:** ${result.competitiveOpportunity.howToBeatThisListing}
- **High AOV Bundle Strategy:** ${result.competitiveOpportunity.bundleStrategy}
- **Untapped Micro-Niche Keywords:**
${result.competitiveOpportunity.untappedNicheAngles.map(n => `  - ${n}`).join('\n')}

---

## 🤖 Production-Ready AI Art Prompts

### 1. Midjourney v6.1 Prompt
\`\`\`
/imagine prompt: ${result.prompts.midjourney.prompt} ${result.prompts.midjourney.parameters} --no ${result.prompts.midjourney.negativePrompt}
\`\`\`
*Rationale:* ${result.prompts.midjourney.rationale}

### 2. FLUX.1 Prompt
\`\`\`
${result.prompts.flux.prompt}
\`\`\`
*Guidance:* ${result.prompts.flux.guidance}
*Rationale:* ${result.prompts.flux.rationale}

### 3. Ideogram v2 Prompt (Typography Specialized)
\`\`\`
${result.prompts.ideogram.prompt}
\`\`\`
*Typography styling:* ${result.prompts.ideogram.typographyInstructions}
*Rationale:* ${result.prompts.ideogram.rationale}

### 4. DALL-E 3 Prompt
\`\`\`
${result.prompts.dalle3.prompt}
\`\`\`
*Settings:* ${result.prompts.dalle3.styleSettings}

### 💡 Creative Product Spin-Off Variations
${result.prompts.variations.map((v, i) => `#### Variation ${i + 1}: ${v.title} (${v.recommendedModel})
- **Concept Angle:** ${v.conceptAngle}
- **Prompt:** \`${v.prompt}\``).join('\n\n')}

---

## 🏷️ Etsy Listing SEO Pack
### Suggested Titles:
${result.etsyListingSEO.suggestedTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### 13 Search Tags:
\`${result.etsyListingSEO.thirteenTags.join(', ')}\`

### Description Hook:
> "${result.etsyListingSEO.descriptionHook}"

---
*Generated by EtsyVision AI • Powered by Google Gemini 3.8 Flash Vision*
`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Etsy-Audit-${result.productTitle.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}.md`;
  link.click();
  URL.revokeObjectURL(url);
}
