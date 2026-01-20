/**
 * Gemini AI Service for Content Generation
 * Handles SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization)
 * Integrated with German e-commerce platform-specific templates
 */

import { GoogleGenAI } from '@google/genai';
import { Platform } from '@/types/product';
import { DashboardProduct } from '@/types/crawled-product';
import { platformConfigs } from '@/data/sample-products';

// Initialize Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
};

// Platform-specific content requirements based on German e-commerce platform specifications
interface PlatformRequirements {
  titleMaxLength: number;
  titleMobileMaxLength?: number; // Mobile-optimized length
  titleFormat: string;
  descriptionMaxLength: number;
  descriptionFormat: 'plain' | 'html' | 'markdown';
  bulletPointsMax: number;
  bulletPointsMin?: number;
  bulletPointFormat?: string; // e.g., "CAPS LOCK BENEFIT - explanation"
  imageRequirements: {
    minResolution: string;
    maxResolution?: string;
    background: string;
    maxSize?: string;
    minQuantity: number;
    maxQuantity: number;
    allowWatermarks: boolean;
    allowText: boolean;
  };
  tone: string;
  keywords: string[];
  philosophy: string;
  restrictions: string[];
  compliance: string[];
  globalCompliance: string[]; // German-wide requirements
  categoryMapping: {
    required: boolean;
    system: string; // e.g., "MMS Taxonomy", "Kaufland Category Tree"
  };
  seoNotes: string;
  priceHistory?: boolean; // Whether platform shows price history
}

// Global German e-commerce compliance requirements (applies to ALL platforms)
export const GERMAN_GLOBAL_COMPLIANCE = {
  LUCID: {
    name: 'LUCID Packaging Register',
    description: 'German Packaging Act registration number required for all sellers',
    required: true,
    url: 'https://lucid.verpackungsregister.org/',
  },
  WEEE: {
    name: 'WEEE Registration',
    description: 'Electronic waste disposal registration required for all electronics',
    required: true,
    categories: ['TV', 'Audio', 'Laptop', 'Monitor', 'Projector', 'Vacuum', 'Air Conditioner'],
    url: 'https://www.stiftung-ear.de/',
  },
  EAN_GTIN: {
    name: 'EAN/GTIN',
    description: '13-digit barcode matching official manufacturer barcode',
    required: true,
    format: /^\d{13}$/,
  },
  GERMAN_RETURN_ADDRESS: {
    name: 'German Return Address',
    description: 'Return address within Germany required for most platforms',
    required: true,
  },
  IMPRESSUM: {
    name: 'Impressum',
    description: 'Legal business address and contact information (German law)',
    required: true,
  },
};

// Detailed platform templates based on German e-commerce marketplace specifications
const platformRequirementsMap: Record<Platform, PlatformRequirements> = {
  mediamarkt: {
    titleMaxLength: 150,
    titleMobileMaxLength: 80,
    titleFormat: '[Brand] [Model Name] [Key Spec] [Product Type]',
    descriptionMaxLength: 2000,
    descriptionFormat: 'plain',
    bulletPointsMax: 5,
    bulletPointsMin: 3,
    imageRequirements: {
      minResolution: '1000x1000 px (zoom trigger)',
      background: 'Pure white (RGB 255,255,255)',
      maxSize: '10MB',
      minQuantity: 3,
      maxQuantity: 5,
      allowWatermarks: false,
      allowText: false,
    },
    tone: 'Professional and technical. German buyers want hard data (refresh rate, wattage, ports).',
    keywords: ['Technik', 'Premium', 'Qualität', 'Innovation'],
    philosophy: 'Trust & Professionalism. Brick-and-mortar giants - listings must look as official as in-store products.',
    restrictions: [
      'No all-caps',
      'No promotional text ("Best Price")',
      'No subjective adjectives ("Fast")',
      'Keep under 80 chars for mobile optimization',
    ],
    compliance: [
      'EAN/GTIN (13-digit) mandatory - must match official manufacturer barcode',
      'German return address required',
      'MMS Taxonomy category mapping required',
    ],
    globalCompliance: ['LUCID', 'WEEE', 'EAN_GTIN', 'GERMAN_RETURN_ADDRESS'],
    categoryMapping: {
      required: true,
      system: 'MMS Taxonomy',
    },
    seoNotes: 'Focus on technical specifications. Plain text safer, basic HTML accepted for long descriptions.',
  },
  saturn: {
    titleMaxLength: 150,
    titleMobileMaxLength: 80,
    titleFormat: '[Brand] [Model Name] [Key Spec] [Product Type]',
    descriptionMaxLength: 2000,
    descriptionFormat: 'plain',
    bulletPointsMax: 5,
    bulletPointsMin: 3,
    imageRequirements: {
      minResolution: '1000x1000 px',
      background: 'Pure white (RGB 255,255,255)',
      maxSize: '10MB',
      minQuantity: 3,
      maxQuantity: 5,
      allowWatermarks: false,
      allowText: false,
    },
    tone: 'Tech-savvy and modern. Same backend as MediaMarkt (MMS Marketplace).',
    keywords: ['Tech', 'Smart', 'Leistung', 'Entertainment'],
    philosophy: 'Trust & Professionalism. Same platform as MediaMarkt - upload once, appear on both.',
    restrictions: [
      'No all-caps',
      'No promotional text',
      'No subjective adjectives',
    ],
    compliance: [
      'EAN/GTIN (13-digit) mandatory',
      'German return address required',
    ],
    globalCompliance: ['LUCID', 'WEEE', 'EAN_GTIN', 'GERMAN_RETURN_ADDRESS'],
    categoryMapping: {
      required: true,
      system: 'MMS Taxonomy',
    },
    seoNotes: 'Technical specs focused. Same requirements as MediaMarkt.',
  },
  amazon: {
    titleMaxLength: 200,
    titleFormat: '[Brand] [Series] [Model] [Product Type] [Key Specs (Size, Color, Tech)]',
    descriptionMaxLength: 2000,
    descriptionFormat: 'html',
    bulletPointsMax: 5,
    bulletPointsMin: 5,
    bulletPointFormat: 'CAPS LOCK BENEFIT - followed by explanation',
    imageRequirements: {
      minResolution: '1500x1500 px',
      background: 'Pure white (RGB 255,255,255)',
      minQuantity: 1,
      maxQuantity: 9,
      allowWatermarks: false,
      allowText: false, // Main image only, secondary can have infographics
    },
    tone: 'Conversion-focused. START WITH CAPS LOCK BENEFIT - followed by explanation.',
    keywords: ['Premium', 'Best Seller', 'Top Rated', 'Award-winning'],
    philosophy: 'Conversion is King. Algorithm favors listings that get clicks and sales.',
    restrictions: [
      'No auto-translation - use German terms (Handy vs Smartphone based on keyword volume)',
      'Main image: NO text/badges, product fills 85%+',
      'Secondary images: infographics highly effective',
    ],
    compliance: [
      'EAN/GTIN mandatory',
      'Impressum (business address/contact) required on seller profile',
      'A+ Content highly recommended for electronics',
    ],
    globalCompliance: ['LUCID', 'WEEE', 'EAN_GTIN', 'IMPRESSUM'],
    categoryMapping: {
      required: true,
      system: 'Amazon Browse Nodes',
    },
    seoNotes: 'German localization critical. Use comparison charts for models. Infographics for technical features.',
  },
  otto: {
    titleMaxLength: 120,
    titleFormat: '[Brand] [Product Type] [Model] [Major Feature]',
    descriptionMaxLength: 1500,
    descriptionFormat: 'plain',
    bulletPointsMax: 5,
    bulletPointsMin: 5,
    bulletPointFormat: 'Lifestyle benefit + spec combined (e.g., "Energy efficient A++ rating saves power")',
    imageRequirements: {
      minResolution: '1500px width recommended',
      background: 'Strict pure white/grey. No shadows, no props, no logos.',
      minQuantity: 3,
      maxQuantity: 8,
      allowWatermarks: false,
      allowText: false,
    },
    tone: 'Curated quality. Lifestyle benefits + specs combined.',
    keywords: ['Zuhause', 'Familie', 'Lifestyle', 'Qualität'],
    philosophy: 'Curated Quality. Otto sees itself as a catalog, not a bazaar. Manual data quality checks.',
    restrictions: [
      'No duplicate info - check system auto-concatenation',
      'No repeated brand in model name if system auto-adds',
      'Ethical sourcing declaration required',
    ],
    compliance: [
      'EAN/GTIN mandatory',
      'German warehouse for returns often required',
      'Sustainability and fair labor declaration',
      'Specific materials may be banned (certain furs, sandblasted denim)',
    ],
    globalCompliance: ['LUCID', 'WEEE', 'EAN_GTIN', 'GERMAN_RETURN_ADDRESS'],
    categoryMapping: {
      required: true,
      system: 'Otto Partner Connect Categories',
    },
    seoNotes: 'Exactly 5 bullets recommended. Example: "Energy efficient A++ rating saves power".',
  },
  galaxus: {
    titleMaxLength: 60,
    titleFormat: '[Model Name] [Key Spec] - DO NOT include Brand or Category separately',
    descriptionMaxLength: 2000,
    descriptionFormat: 'plain',
    bulletPointsMax: 5,
    imageRequirements: {
      minResolution: '600x600 px minimum, 1000px+ preferred',
      background: 'Clean, no watermarks or text',
      minQuantity: 1,
      maxQuantity: 10,
      allowWatermarks: false,
      allowText: false,
    },
    tone: 'No Bullsh*t. Clean data only. No marketing fluff.',
    keywords: ['Präzision', 'Qualität', 'Schweizer Standard'],
    philosophy: 'No marketing fluff. Community will mock keyword-stuffing. Algorithm flags it.',
    restrictions: [
      'Keep titles SHORT - system auto-generates full display title from attributes',
      'No watermarks or promotional text on images - INSTANT REJECTION',
      'Bad: "Samsung Galaxy S23 Ultra Smartphone 5G 256GB Phantom Black Android Best Camera"',
      'Good: "Galaxy S23 Ultra"',
    ],
    compliance: [
      'GTIN/EAN used for product clustering',
      'May be grouped with other sellers on same product page',
      'Detailed attribute sheets critical - fill completely',
    ],
    globalCompliance: ['EAN_GTIN'],
    categoryMapping: {
      required: true,
      system: 'Galaxus Category Tree',
    },
    seoNotes: 'Most critical: fill detailed specs. Missing "Panel Type" = vanish from OLED filter.',
    priceHistory: true,
  },
  kaufland: {
    titleMaxLength: 200,
    titleFormat: '[Brand] [Model] [Product Type] [Key Specs]',
    descriptionMaxLength: 4000,
    descriptionFormat: 'html',
    bulletPointsMax: 10,
    bulletPointsMin: 5,
    imageRequirements: {
      minResolution: '1024px longest side',
      background: 'White mandatory for Google Shopping feed approval',
      minQuantity: 1,
      maxQuantity: 10,
      allowWatermarks: false,
      allowText: false,
    },
    tone: 'SEO-friendly. High volume marketplace heavily indexed by Google Shopping.',
    keywords: ['Original', 'Neu', 'OVP', 'Garantie', 'ohne Simlock'],
    philosophy: 'High Volume / SEO. Heavily indexed by Google Shopping.',
    restrictions: [
      'Must use relevant keywords - Google indexes heavily',
      'Incorrect categorization tanks visibility',
    ],
    compliance: [
      'EAN/GTIN mandatory',
      'LUCID Packaging Register number REQUIRED - account blocked immediately without it',
      'Kaufland category tree mapping required',
    ],
    globalCompliance: ['LUCID', 'WEEE', 'EAN_GTIN'],
    categoryMapping: {
      required: true,
      system: 'Kaufland Category Tree',
    },
    seoNotes: 'HTML allowed in description. Use bold headers to separate sections (Display, Battery). Similar to Amazon keyword strategy.',
  },
  ebay: {
    titleMaxLength: 80,
    titleFormat: '[Brand] [Model] [Key Feature] [Condition]',
    descriptionMaxLength: 4000,
    descriptionFormat: 'html',
    bulletPointsMax: 10,
    imageRequirements: {
      minResolution: '1600x1600 px',
      background: 'White preferred',
      minQuantity: 1,
      maxQuantity: 12,
      allowWatermarks: false,
      allowText: true,
    },
    tone: 'Value-focused, detailed, trust-building.',
    keywords: ['Original', 'Neu', 'OVP', 'Garantie', 'Händler'],
    philosophy: 'Trust and value. Established marketplace with buyer protection.',
    restrictions: [],
    compliance: [
      'German seller requirements apply',
      'Return policy compliance',
    ],
    globalCompliance: ['LUCID', 'WEEE', 'EAN_GTIN'],
    categoryMapping: {
      required: true,
      system: 'eBay Categories',
    },
    seoNotes: 'Detailed descriptions help with search visibility.',
  },
  shopee: {
    titleMaxLength: 120,
    titleFormat: '[Brand] [Model] [Key Feature]',
    descriptionMaxLength: 3000,
    descriptionFormat: 'plain',
    bulletPointsMax: 5,
    imageRequirements: {
      minResolution: '800x800 px',
      background: 'Clean background',
      minQuantity: 3,
      maxQuantity: 9,
      allowWatermarks: true,
      allowText: true,
    },
    tone: 'Casual, engaging, deal-focused.',
    keywords: ['Flash Sale', 'Best Price', 'Free Shipping', 'Official'],
    philosophy: 'Deal-oriented marketplace.',
    restrictions: [],
    compliance: [],
    globalCompliance: [],
    categoryMapping: {
      required: true,
      system: 'Shopee Categories',
    },
    seoNotes: 'Keywords for deals and promotions work well.',
  },
  lazada: {
    titleMaxLength: 255,
    titleFormat: '[Brand] [Category] [Model] [Specs]',
    descriptionMaxLength: 5000,
    descriptionFormat: 'html',
    bulletPointsMax: 8,
    imageRequirements: {
      minResolution: '800x800 px',
      background: 'White preferred',
      minQuantity: 3,
      maxQuantity: 8,
      allowWatermarks: false,
      allowText: true,
    },
    tone: 'Comprehensive, feature-rich, SEO-optimized.',
    keywords: ['Official Store', 'Authentic', 'Warranty', 'Best Deal'],
    philosophy: 'Feature-rich listings with comprehensive details.',
    restrictions: [],
    compliance: ['Official store verification helps'],
    globalCompliance: [],
    categoryMapping: {
      required: true,
      system: 'Lazada Categories',
    },
    seoNotes: 'Long-form content performs well.',
  },
  tiktok: {
    titleMaxLength: 100,
    titleFormat: '[Brand] [Product] [Trending Feature]',
    descriptionMaxLength: 1000,
    descriptionFormat: 'plain',
    bulletPointsMax: 5,
    imageRequirements: {
      minResolution: '800x800 px',
      background: 'Lifestyle-oriented',
      minQuantity: 1,
      maxQuantity: 9,
      allowWatermarks: true,
      allowText: true,
    },
    tone: 'Trendy, viral-friendly, short and punchy.',
    keywords: ['Trending', 'Viral', 'Must-have', 'TikTok Made Me Buy'],
    philosophy: 'Social commerce with viral potential.',
    restrictions: ['Keep content authentic and relatable'],
    compliance: [],
    globalCompliance: [],
    categoryMapping: {
      required: true,
      system: 'TikTok Shop Categories',
    },
    seoNotes: 'Hashtags and trending sounds important. Video content preferred.',
  },
  mercadolibre: {
    titleMaxLength: 60,
    titleMobileMaxLength: 55,
    titleFormat: '[Marca] [Modelo] [Característica Principal] [Especificación]',
    descriptionMaxLength: 50000,
    descriptionFormat: 'plain',
    bulletPointsMax: 7,
    bulletPointsMin: 3,
    imageRequirements: {
      minResolution: '1200x1200 px',
      background: 'Pure white background mandatory',
      maxSize: '10MB',
      minQuantity: 1,
      maxQuantity: 12,
      allowWatermarks: false,
      allowText: false,
    },
    tone: 'Informative and detailed. Latin American buyers value thorough product information.',
    keywords: ['Original', 'Garantía', 'Envío Gratis', 'Oficial', 'Nuevo'],
    philosophy: 'Trust through detail. Comprehensive listings with complete specifications perform best.',
    restrictions: [
      'No all-caps titles',
      'No promotional text in title ("El Mejor", "Oferta")',
      'No special characters or emojis',
      'Title must accurately describe the product',
      'No competitor brand mentions',
    ],
    compliance: [
      'RFC (Tax ID) required for Mexico sellers',
      'Official store verification recommended',
      'Warranty information must be accurate',
      'Product certification may be required for electronics',
    ],
    globalCompliance: ['RFC_TAX_ID', 'WARRANTY_INFO'],
    categoryMapping: {
      required: true,
      system: 'Mercado Libre Category Tree',
    },
    seoNotes: 'Ficha técnica (spec sheet) heavily indexed. Complete all attributes. Use regional Spanish (Mexican Spanish for MX). Preguntas frecuentes (FAQ) section highly valued.',
  },
};

// Export platform requirements for use in pipeline
export { platformRequirementsMap };

export interface GeneratedContentResult {
  platform: Platform;
  title: string;
  description: string;
  bulletPoints: string[];
  seoKeywords: string[];
  aeoSnippet: string;
  geoSummary: string;
  metaDescription: string;
}

export interface ContentGenerationOptions {
  product: DashboardProduct;
  platform: Platform;
  language: string;
  optimizationGoals: ('seo' | 'aeo' | 'geo' | 'conversion')[];
}

/**
 * Generate optimized product content for a specific platform
 */
export async function generatePlatformContent(
  options: ContentGenerationOptions
): Promise<GeneratedContentResult> {
  const { product, platform, language, optimizationGoals } = options;
  const requirements = platformRequirementsMap[platform];
  const ai = getGeminiClient();

  const prompt = buildContentPrompt(product, platform, requirements, language, optimizationGoals);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '';
    return parseGeneratedContent(text, platform);
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return fallback content based on product data
    return generateFallbackContent(product, platform);
  }
}

/**
 * Generate SEO-optimized meta tags
 */
export async function generateSEOMetaTags(
  product: DashboardProduct,
  platform: Platform
): Promise<{ title: string; description: string; keywords: string[] }> {
  const ai = getGeminiClient();
  const features = product.rawData?.features || [];

  const prompt = `
Generate SEO-optimized meta tags for this product listing on ${platform}:

Product: ${product.title}
Model: ${product.modelNumber}
Category: ${product.categoryName}
Key Features: ${features.slice(0, 5).join(', ')}

Generate:
1. Meta Title (max 60 chars, include brand and key feature)
2. Meta Description (max 160 chars, include call-to-action)
3. 10 SEO Keywords (comma-separated, include long-tail keywords)

Format as JSON: { "title": "", "description": "", "keywords": [] }
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('SEO generation error:', error);
  }

  // Fallback
  return {
    title: `${product.title} | ${product.modelNumber}`,
    description: product.description || product.title,
    keywords: [product.categoryName, product.modelNumber, 'LG', platform],
  };
}

/**
 * Generate Answer Engine Optimized (AEO) content
 * Optimized for voice search and featured snippets
 */
export async function generateAEOContent(
  product: DashboardProduct
): Promise<{ qaSnippets: Array<{ question: string; answer: string }> }> {
  const ai = getGeminiClient();
  const specs = product.rawData?.specifications || {};
  const features = product.rawData?.features || [];
  const specEntries = Object.entries(specs).slice(0, 10);

  const prompt = `
Generate Answer Engine Optimized (AEO) content for this LG product:

Product: ${product.title}
Category: ${product.categoryName}
Key Specs: ${specEntries.map(([key, value]) => `${key}: ${value}`).join(', ')}
Features: ${features.slice(0, 5).join('; ')}

Generate 5 FAQ-style Q&A pairs that:
1. Target common voice search queries (What is..., How does..., Does it have...)
2. Provide concise, direct answers (50-100 words each)
3. Include specific product features and specifications
4. Use natural language suitable for featured snippets

Format as JSON: { "qaSnippets": [{ "question": "", "answer": "" }] }
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('AEO generation error:', error);
  }

  return { qaSnippets: [] };
}

/**
 * Generate Generative Engine Optimized (GEO) content
 * Optimized for AI-powered search engines like Perplexity, ChatGPT, etc.
 */
export async function generateGEOContent(
  product: DashboardProduct
): Promise<{ summary: string; keyPoints: string[]; citations: string[] }> {
  const ai = getGeminiClient();
  const specs = product.rawData?.specifications || {};
  const features = product.rawData?.features || [];
  const specEntries = Object.entries(specs).slice(0, 15);

  const prompt = `
Generate Generative Engine Optimized (GEO) content for this LG product:

Product: ${product.title}
Category: ${product.categoryName}
Description: ${product.description || ''}
Specifications: ${specEntries.map(([key, value]) => `${key}: ${value}`).join(', ')}
Key Features: ${features.slice(0, 5).join(', ')}

Generate content optimized for AI search engines:
1. A comprehensive summary (200-300 words) that AI assistants can cite
2. 5 key points with specific, verifiable data
3. Suggested citation anchors for AI systems

The content should:
- Be factual and verifiable
- Include specific numbers and specifications
- Be structured for easy extraction by AI systems
- Position LG as a trusted authority

Format as JSON: { "summary": "", "keyPoints": [], "citations": [] }
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('GEO generation error:', error);
  }

  return {
    summary: product.description || '',
    keyPoints: features.slice(0, 5),
    citations: [`${product.title} - LG Official`],
  };
}

/**
 * Optimize existing content for a platform
 */
export async function optimizeContentForPlatform(
  content: string,
  platform: Platform,
  contentType: 'title' | 'description' | 'bullets'
): Promise<string> {
  const requirements = platformRequirementsMap[platform];
  const ai = getGeminiClient();

  const maxLength =
    contentType === 'title'
      ? requirements.titleMaxLength
      : contentType === 'description'
        ? requirements.descriptionMaxLength
        : 500;

  const prompt = `
Optimize this ${contentType} for ${platform} marketplace:

Original content:
"${content}"

Requirements:
- Max length: ${maxLength} characters
- Tone: ${requirements.tone}
- Include keywords: ${requirements.keywords.join(', ')}

Optimize for:
1. SEO (search visibility)
2. Conversion (compelling copy)
3. Platform compliance (character limits)

Return ONLY the optimized content, no explanations.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text?.trim() || content;
  } catch (error) {
    console.error('Content optimization error:', error);
    return content;
  }
}

// Helper functions

function buildContentPrompt(
  product: DashboardProduct,
  platform: Platform,
  requirements: PlatformRequirements,
  language: string,
  goals: string[]
): string {
  // Extract specifications from rawData
  const specs = product.rawData?.specifications || {};
  const specsText = Object.entries(specs)
    .slice(0, 15)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  // Extract features from rawData
  const features = product.rawData?.features || [];
  const featuresText = features
    .slice(0, 10)
    .map(f => `- ${f}`)
    .join('\n');

  // Get price info from DashboardProduct
  const priceInfo = product.price;

  return `
You are an expert e-commerce content writer specializing in ${platform} marketplace optimization for the German market.

Generate optimized product content for this LG product:

PRODUCT INFORMATION:
- Name: ${product.title}
- Model Number: ${product.modelNumber}
- Category: ${product.categoryName}
- Brand: LG
- Price: ${priceInfo ? `${product.currency} ${priceInfo}` : 'N/A'}

DESCRIPTION:
${product.description || 'N/A'}

SPECIFICATIONS:
${specsText || 'N/A'}

KEY FEATURES:
${featuresText || 'N/A'}

PLATFORM REQUIREMENTS (${platform.toUpperCase()}):
- Title format: ${requirements.titleFormat}
- Title max length: ${requirements.titleMaxLength} characters
- Description max length: ${requirements.descriptionMaxLength} characters
- Bullet points: ${requirements.bulletPointsMax} max
- Tone: ${requirements.tone}
- Platform philosophy: ${requirements.philosophy}
- Platform keywords: ${requirements.keywords.join(', ')}
- Restrictions: ${requirements.restrictions.join('; ')}
- SEO notes: ${requirements.seoNotes}

IMAGE REQUIREMENTS (for reference):
- Resolution: ${requirements.imageRequirements.minResolution}
- Background: ${requirements.imageRequirements.background}
- Quantity: ${requirements.imageRequirements.minQuantity}-${requirements.imageRequirements.maxQuantity} images
- Watermarks allowed: ${requirements.imageRequirements.allowWatermarks ? 'Yes' : 'No'}
- Text overlay allowed: ${requirements.imageRequirements.allowText ? 'Yes' : 'No'}

COMPLIANCE REQUIREMENTS:
${requirements.compliance.join('\n')}

OPTIMIZATION GOALS: ${goals.join(', ')}

LANGUAGE: ${language}

Generate the following content in ${language === 'de-DE' ? 'German' : 'English'}:

1. TITLE: Following format "${requirements.titleFormat}" within ${requirements.titleMaxLength} character limit
2. DESCRIPTION: Engaging product description with key features and benefits (max ${requirements.descriptionMaxLength} chars)
3. BULLET_POINTS: Exactly ${requirements.bulletPointsMax} feature-focused bullet points
4. SEO_KEYWORDS: 10 relevant search keywords for German market
5. AEO_SNIPPET: Short answer for voice search (50 words) - optimized for "What is...", "How does..."
6. GEO_SUMMARY: AI-citation-friendly summary (100 words) - factual, verifiable data
7. META_DESCRIPTION: SEO meta description (160 chars max)

Format response as JSON:
{
  "title": "",
  "description": "",
  "bulletPoints": [],
  "seoKeywords": [],
  "aeoSnippet": "",
  "geoSummary": "",
  "metaDescription": ""
}
`;
}

function parseGeneratedContent(text: string, platform: Platform): GeneratedContentResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        platform,
        title: parsed.title || '',
        description: parsed.description || '',
        bulletPoints: parsed.bulletPoints || [],
        seoKeywords: parsed.seoKeywords || [],
        aeoSnippet: parsed.aeoSnippet || '',
        geoSummary: parsed.geoSummary || '',
        metaDescription: parsed.metaDescription || '',
      };
    }
  } catch (error) {
    console.error('Parse error:', error);
  }

  return {
    platform,
    title: '',
    description: '',
    bulletPoints: [],
    seoKeywords: [],
    aeoSnippet: '',
    geoSummary: '',
    metaDescription: '',
  };
}

function generateFallbackContent(product: DashboardProduct, platform: Platform): GeneratedContentResult {
  const features = product.rawData?.features || [];
  const requirements = platformRequirementsMap[platform];

  // Generate bullet points from features
  const bulletPoints = features.slice(0, requirements.bulletPointsMax);

  // Generate keywords from product data
  const keywords = [
    product.categoryName,
    product.modelNumber,
    'LG',
    platform,
    ...features.slice(0, 3),
  ].filter(Boolean);

  // Generate AEO snippet
  const aeoSnippet = `The ${product.title} (${product.modelNumber}) is LG's ${product.categoryName?.toLowerCase() || 'product'}. ${features[0] || ''} ${features[1] || ''}`.trim();

  // Generate GEO summary
  const geoSummary = `${product.title} (Model: ${product.modelNumber}) is a ${product.categoryName?.toLowerCase() || 'product'} from LG Electronics. ${product.description || ''} Key features include ${features.slice(0, 3).join(', ')}.`.trim();

  return {
    platform,
    title: `LG ${product.title} | ${product.modelNumber}`,
    description: product.description || product.title,
    bulletPoints,
    seoKeywords: keywords,
    aeoSnippet,
    geoSummary,
    metaDescription: `Buy LG ${product.title} (${product.modelNumber}). ${features[0] || product.categoryName || ''}`.slice(0, 160),
  };
}
