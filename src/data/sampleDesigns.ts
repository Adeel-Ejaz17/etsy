import { SampleEtsyDesign } from '../types';

// Helper to convert inline SVG string to data URI
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg.trim())))}`;
}

// Sample 1: Boho Botanical Sun & Abstract Arch Wall Art (A top-selling Etsy genre)
const bohoWallArtSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#F8F4EE" />
  <!-- Textured Background Subtle Circle -->
  <circle cx="300" cy="300" r="160" fill="#E8D8C8" />
  <!-- Terracotta Sun Arch -->
  <path d="M 200 450 A 100 100 0 0 1 400 450 L 400 620 L 200 620 Z" fill="#C86D51" />
  <!-- Warm Mustard Sun Disk -->
  <circle cx="300" cy="320" r="70" fill="#D99B43" />
  <!-- Abstract Palm & Monstera Leaves -->
  <path d="M 300 600 Q 250 480 300 360 Q 350 480 300 600 Z" fill="#6A7A60" opacity="0.9" />
  <path d="M 300 520 Q 200 460 170 380 Q 240 430 300 490 Z" fill="#58674E" />
  <path d="M 300 500 Q 400 440 430 360 Q 360 410 300 470 Z" fill="#7D8D72" />
  <path d="M 300 560 Q 210 540 160 490 Q 230 520 300 540 Z" fill="#4B5842" />
  <path d="M 300 550 Q 390 530 440 480 Q 370 510 300 530 Z" fill="#617257" />
  <!-- Minimalist Line Art Vase -->
  <ellipse cx="300" cy="620" rx="90" ry="24" fill="#3D352E" />
  <path d="M 230 620 Q 210 700 240 730 L 360 730 Q 390 700 370 620 Z" fill="#2E2823" />
  <!-- Typography Mockup Badge -->
  <rect x="50" y="740" width="500" height="40" rx="6" fill="#FFFFFF" opacity="0.85" />
  <text x="300" y="765" font-family="sans-serif" font-size="14" font-weight="bold" fill="#333333" text-anchor="middle" letter-spacing="3">ETSY BESTSELLER • 300 DPI PRINTABLE WALL ART</text>
</svg>
`;

// Sample 2: Retro 70s Groovy Flower Power Clipart & SVG
const retroGroovySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#FFF6EB" />
  <!-- Vintage Checkerboard Strip -->
  <pattern id="checker" width="30" height="30" patternUnits="userSpaceOnUse">
    <rect width="15" height="15" fill="#E89B84" />
    <rect x="15" width="15" height="15" fill="#FFF6EB" />
    <rect y="15" width="15" height="15" fill="#FFF6EB" />
    <rect x="15" y="15" width="15" height="15" fill="#E89B84" />
  </pattern>
  <rect x="40" y="40" width="520" height="720" rx="20" fill="none" stroke="#E89B84" stroke-width="8" />
  
  <!-- Retro Groovy Flower -->
  <g transform="translate(300, 360)">
    <circle cx="0" cy="-90" r="45" fill="#F4A261" />
    <circle cx="78" cy="-45" r="45" fill="#E76F51" />
    <circle cx="78" cy="45" r="45" fill="#E9C46A" />
    <circle cx="0" cy="90" r="45" fill="#F4A261" />
    <circle cx="-78" cy="45" r="45" fill="#E76F51" />
    <circle cx="-78" cy="-45" r="45" fill="#E9C46A" />
    <!-- Flower Center with Happy Face -->
    <circle cx="0" cy="0" r="60" fill="#2A9D8F" />
    <circle cx="-20" cy="-10" r="8" fill="#FFFFFF" />
    <circle cx="20" cy="-10" r="8" fill="#FFFFFF" />
    <circle cx="-18" cy="-10" r="4" fill="#1D3557" />
    <circle cx="22" cy="-10" r="4" fill="#1D3557" />
    <path d="M -22 15 Q 0 35 22 15" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" />
  </g>

  <!-- Retro Typography -->
  <text x="300" y="180" font-family="serif" font-size="44" font-weight="900" fill="#E76F51" text-anchor="middle" font-style="italic">Stay Groovy</text>
  <text x="300" y="580" font-family="sans-serif" font-size="28" font-weight="bold" fill="#2A9D8F" text-anchor="middle" letter-spacing="4">GOOD VIBES ONLY</text>
  <rect x="150" y="630" width="300" height="50" rx="25" fill="#E76F51" />
  <text x="300" y="663" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SVG • PNG • EPS • DXF CUT FILE</text>
</svg>
`;

// Sample 3: Dark Academia Vintage Mushroom & Fern Botanical Print
const darkAcademiaSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#1E231C" />
  <!-- Gold Vintage Filigree Border -->
  <rect x="35" y="35" width="530" height="730" fill="none" stroke="#C5A059" stroke-width="2" />
  <rect x="45" y="45" width="510" height="710" fill="none" stroke="#C5A059" stroke-width="1" stroke-dasharray="4,4" />
  
  <!-- Vintage Moon & Constellations -->
  <circle cx="300" cy="190" r="80" fill="none" stroke="#C5A059" stroke-width="1.5" />
  <circle cx="300" cy="190" r="74" fill="#283025" />
  <circle cx="320" cy="180" r="66" fill="#1E231C" />

  <!-- Botanical Mushroom & Fungi -->
  <g transform="translate(300, 460)">
    <!-- Stem -->
    <path d="M -25 150 Q -15 0 -10 -40 L 10 -40 Q 15 0 25 150 Z" fill="#EAD9BC" stroke="#C5A059" stroke-width="2" />
    <!-- Mushroom Cap -->
    <path d="M -130 -40 Q -70 -160 0 -160 Q 70 -160 130 -40 Q 0 -60 -130 -40 Z" fill="#8B3A2B" stroke="#C5A059" stroke-width="2" />
    <!-- Spots on Cap -->
    <circle cx="-50" cy="-90" r="14" fill="#EAD9BC" opacity="0.9" />
    <circle cx="20" cy="-115" r="16" fill="#EAD9BC" opacity="0.9" />
    <circle cx="65" cy="-75" r="12" fill="#EAD9BC" opacity="0.9" />
    <circle cx="-10" cy="-70" r="10" fill="#EAD9BC" opacity="0.9" />
    <!-- Fern leaves below -->
    <path d="M -120 120 Q -40 80 0 140 Q -60 150 -120 120 Z" fill="#475841" />
    <path d="M 120 120 Q 40 80 0 140 Q 60 150 120 120 Z" fill="#475841" />
  </g>

  <!-- Typography -->
  <text x="300" y="670" font-family="serif" font-size="22" font-style="italic" fill="#EAD9BC" text-anchor="middle" letter-spacing="3">Amanita Muscaria</text>
  <text x="300" y="700" font-family="sans-serif" font-size="12" fill="#C5A059" text-anchor="middle" letter-spacing="5">VINTAGE BOTANICAL MYCOLOGY ILLUSTRATION</text>
</svg>
`;

// Sample 4: Aesthetic Sage Green Weekly Planner Canva Template
const plannerTemplateSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#F4F6F3" />
  <!-- Header Bar -->
  <rect x="40" y="40" width="520" height="70" rx="12" fill="#7C9082" />
  <text x="70" y="85" font-family="serif" font-size="28" font-weight="bold" fill="#FFFFFF">WEEKLY LIFE PLANNER</text>
  <text x="520" y="82" font-family="sans-serif" font-size="14" fill="#E5EDE7" text-anchor="end">EDITABLE IN CANVA</text>
  
  <!-- Days Grid -->
  <rect x="40" y="130" width="245" height="130" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
  <rect x="40" y="130" width="245" height="30" rx="8" fill="#E9EFEA" />
  <text x="55" y="152" font-family="sans-serif" font-size="13" font-weight="bold" fill="#4A5B4F">MONDAY • PRIORITY</text>
  <line x1="55" y1="180" x2="260" y2="180" stroke="#E6EDE8" stroke-width="2" />
  <line x1="55" y1="210" x2="260" y2="210" stroke="#E6EDE8" stroke-width="2" />
  <line x1="55" y1="240" x2="260" y2="240" stroke="#E6EDE8" stroke-width="2" />

  <rect x="315" y="130" width="245" height="130" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
  <rect x="315" y="130" width="245" height="30" rx="8" fill="#E9EFEA" />
  <text x="330" y="152" font-family="sans-serif" font-size="13" font-weight="bold" fill="#4A5B4F">TUESDAY • SCHEDULE</text>
  <line x1="330" y1="180" x2="535" y2="180" stroke="#E6EDE8" stroke-width="2" />
  <line x1="330" y1="210" x2="535" y2="210" stroke="#E6EDE8" stroke-width="2" />
  <line x1="330" y1="240" x2="535" y2="240" stroke="#E6EDE8" stroke-width="2" />

  <!-- Habit Tracker Section -->
  <rect x="40" y="280" width="520" height="190" rx="10" fill="#FFFFFF" stroke="#DDE5DF" />
  <text x="60" y="315" font-family="sans-serif" font-size="16" font-weight="bold" fill="#3D4B41">DAILY HABIT TRACKER</text>
  <circle cx="480" cy="310" r="12" fill="#DDE5DF" />
  <circle cx="510" cy="310" r="12" fill="#7C9082" />
  <circle cx="540" cy="310" r="12" fill="#7C9082" />
  <line x1="60" y1="340" x2="540" y2="340" stroke="#F0F4F1" stroke-width="2" />
  <line x1="60" y1="380" x2="540" y2="380" stroke="#F0F4F1" stroke-width="2" />
  <line x1="60" y1="420" x2="540" y2="420" stroke="#F0F4F1" stroke-width="2" />
  <text x="60" y="365" font-family="sans-serif" font-size="13" fill="#6A7A6E">Morning Hydration (2L)</text>
  <text x="60" y="405" font-family="sans-serif" font-size="13" fill="#6A7A6E">30-Min Daily Movement</text>
  <text x="60" y="445" font-family="sans-serif" font-size="13" fill="#6A7A6E">Reading & Mindfulness</text>

  <!-- Etsy Badge -->
  <rect x="40" y="490" width="520" height="260" rx="12" fill="#E2EAE4" />
  <text x="300" y="560" font-family="serif" font-size="32" font-weight="bold" fill="#3D4B41" text-anchor="middle">Neutral Sage Aesthetic</text>
  <text x="300" y="600" font-family="sans-serif" font-size="16" fill="#586A5E" text-anchor="middle">Includes A4, A5 & US Letter Printable PDFs</text>
  <rect x="180" y="640" width="240" height="46" rx="23" fill="#3D4B41" />
  <text x="300" y="670" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">INSTANT DOWNLOAD</text>
</svg>
`;

export const SAMPLE_DESIGNS: SampleEtsyDesign[] = [
  {
    id: 'boho-wall-art',
    title: 'Minimalist Terracotta Boho Botanical Wall Art',
    category: 'Wall Art / Printable Poster',
    style: 'Boho Neutral & Mid-Century Modern',
    imageUrl: svgToDataUri(bohoWallArtSvg),
    sampleDescription: 'Popular warm terracotta, mustard sun, and botanical leaves printable decor with high Etsy search demand.',
  },
  {
    id: 'retro-groovy-clipart',
    title: 'Retro 70s Groovy Flower Power Clipart & SVG',
    category: 'SVG Cut File & Sublimation Clipart',
    style: '70s Retro Vintage & Y2K Smiley',
    imageUrl: svgToDataUri(retroGroovySvg),
    sampleDescription: 'High-converting Cricut / Silhouette cut file design with daisy smiley face, checkerboard, and wavy font.',
  },
  {
    id: 'dark-academia-botanical',
    title: 'Dark Academia Botanical Mushroom & Fern Print',
    category: 'Printable Art & Vintage Illustration',
    style: 'Dark Academia & Vintage Mycology',
    imageUrl: svgToDataUri(darkAcademiaSvg),
    sampleDescription: 'Antique moody illustration with Amanita mushroom, lunar accents, and ornate gold-trimmed border.',
  },
  {
    id: 'sage-planner-canva',
    title: 'Aesthetic Sage Green Weekly Planner Template',
    category: 'Canva Template & Printable Planner',
    style: 'Clean Scandinavian Minimalist & Productivity',
    imageUrl: svgToDataUri(plannerTemplateSvg),
    sampleDescription: 'Editable digital organization template with habit tracker, weekly priorities, and calming pastel green palette.',
  },
];
