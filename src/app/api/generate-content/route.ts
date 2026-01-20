import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// LG Brand Guidelines
const LG_BRAND = {
  colors: {
    primary: '#A50034', // LG Red
    secondary: '#6B6B6B',
    accent: '#FF0000',
    background: '#FFFFFF',
    backgroundAlt: '#F5F5F5',
    text: '#1A1A1A',
    textLight: '#6B6B6B',
  },
  fonts: {
    headline: "'LG EI Headline', 'Helvetica Neue', Arial, sans-serif",
    body: "'LG EI Text', 'Helvetica Neue', Arial, sans-serif",
  },
};

// Supported locales
type SupportedLocale = 'de' | 'en' | 'es' | 'th';

// Platform-specific styling with country/locale mapping
const PLATFORM_STYLES: Record<string, { color: string; name: string; locale: SupportedLocale; country: string }> = {
  // Germany
  amazon: { color: '#FF9900', name: 'Amazon', locale: 'de', country: 'Germany' },
  mediamarkt: { color: '#DF0000', name: 'MediaMarkt', locale: 'de', country: 'Germany' },
  saturn: { color: '#F79422', name: 'Saturn', locale: 'de', country: 'Germany' },
  otto: { color: '#E63312', name: 'Otto', locale: 'de', country: 'Germany' },
  ebay: { color: '#0064D2', name: 'eBay', locale: 'de', country: 'Germany' },
  kaufland: { color: '#E10915', name: 'Kaufland', locale: 'de', country: 'Germany' },
  galaxus: { color: '#0066CC', name: 'Galaxus', locale: 'de', country: 'Germany' },
  // Thailand
  shopee: { color: '#EE4D2D', name: 'Shopee', locale: 'th', country: 'Thailand' },
  lazada: { color: '#0F146D', name: 'Lazada', locale: 'th', country: 'Thailand' },
  tiktok: { color: '#000000', name: 'TikTok Shop', locale: 'th', country: 'Thailand' },
  // Mexico
  mercadolibre: { color: '#FFE600', name: 'MercadoLibre', locale: 'es', country: 'Mexico' },
};

// eBay Best Practices (from export.ebay.com guidelines)
const EBAY_BEST_PRACTICES = {
  titleMaxLength: 80, // eBay titles must be max 80 characters
  mobileFirst: true, // 80%+ of eBay buyers use mobile
  minImageSize: 500, // Minimum 500px for images
  maxImages: 24,
  formatting: {
    singleTypeface: true, // Use one consistent font
    fontSize: 14, // 14pt black font recommended
    fontColor: '#1A1A1A', // Black text
    noExternalLinks: true, // No links to external websites
    minimalHtml: true, // Simple, clean HTML
  },
};

interface ProductImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: 'main' | 'gallery' | 'lifestyle' | 'feature';
}

interface ProductData {
  title: string;
  modelNumber: string;
  categoryName: string;
  description: string;
  mainImage?: ProductImage;
  galleryImages?: ProductImage[];
  lifestyleImages?: ProductImage[];
  price?: string;
  currency?: string;
  rawData?: {
    specifications?: Record<string, string | number>;
    features?: string[];
    highlights?: string[];
    usps?: Array<{ headline: string; description: string; icon?: string }>;
    basicInfo?: {
      productName?: string;
      headline?: string;
      screenSize?: string;
      series?: string;
      brand?: string;
    };
    faq?: Array<{ question: string; answer: string }>;
    structuredData?: {
      jsonLd?: Array<{
        '@type'?: string;
        name?: string;
        description?: string;
        image?: string;
        mpn?: string;
        brand?: { name?: string };
        offers?: { price?: string; priceCurrency?: string };
        hasEnergyConsumptionDetails?: {
          hasEnergyEfficiencyCategory?: string;
        };
      }>;
    };
  };
}

// Available sections for independent generation
export const AVAILABLE_SECTIONS = [
  'hero',
  'gallery',
  'features',
  'specifications',
  'benefits',
  'warranty',
  'faq',
] as const;

export type SectionType = typeof AVAILABLE_SECTIONS[number];

/**
 * POST /api/generate-content
 *
 * Supports three modes:
 * 1. Single section: { product, platform, section: 'hero' }
 * 2. Multiple sections: { product, platform, sections: ['hero', 'features', 'specifications'] }
 * 3. Full template: { product, platform } (no section specified)
 * 4. Consolidate: { product, platform, action: 'consolidate', sectionHtmls: { hero: '...', features: '...' } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, platform, section, sections, action, sectionHtmls } = body;

    if (!product || !platform) {
      return NextResponse.json(
        { success: false, error: 'Missing product or platform' },
        { status: 400 }
      );
    }

    const platformConfig = PLATFORM_STYLES[platform] || PLATFORM_STYLES.amazon;

    // Action: Consolidate multiple section HTMLs into one template
    if (action === 'consolidate' && sectionHtmls) {
      const consolidatedHtml = consolidateSections(product, platformConfig, sectionHtmls);
      return NextResponse.json({
        success: true,
        data: {
          html: consolidatedHtml,
          platform,
          section: 'consolidated',
          includedSections: Object.keys(sectionHtmls),
        },
      });
    }

    // Generate multiple sections independently
    if (sections && Array.isArray(sections)) {
      const results: Record<string, string> = {};

      for (const sec of sections) {
        if (AVAILABLE_SECTIONS.includes(sec)) {
          const prompt = buildSectionPrompt(product, platformConfig, sec);
          const html = await generateHtml(prompt);
          results[sec] = html;
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          sections: results,
          platform,
          generatedSections: Object.keys(results),
        },
      });
    }

    // Generate single section or full template
    const prompt = buildSectionPrompt(product, platformConfig, section);
    const html = await generateHtml(prompt);

    return NextResponse.json({
      success: true,
      data: {
        html,
        platform,
        section: section || 'full',
      },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

/**
 * Generate HTML from a prompt using Gemini
 */
async function generateHtml(prompt: string): Promise<string> {
  const config = {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.HIGH,
    },
  };

  const contents = [
    {
      role: 'user' as const,
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config,
    contents,
  });

  const htmlContent = response.text || '';

  // Clean up the response - remove markdown code blocks if present
  return htmlContent
    .replace(/```html\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

/**
 * Consolidate multiple section HTMLs into a single template
 */
function consolidateSections(
  product: ProductData,
  platformConfig: { color: string; name: string; locale: SupportedLocale; country: string },
  sectionHtmls: Record<string, string>
): string {
  const truncatedTitle = product.title.substring(0, EBAY_BEST_PRACTICES.titleMaxLength);

  // Order sections properly
  const orderedSections = AVAILABLE_SECTIONS
    .filter(sec => sectionHtmls[sec])
    .map(sec => sectionHtmls[sec])
    .join('\n\n');

  return `
<!DOCTYPE html>
<html lang="${platformConfig.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${truncatedTitle} - LG</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #F5F5F5;
      font-family: 'LG EI Text', 'Helvetica Neue', Arial, sans-serif;
      color: #1A1A1A;
      font-size: 14px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding: 16px;">
    ${orderedSections}
  </div>
</body>
</html>`;
}

// Locale-specific section titles
const SECTION_TITLES: Record<SupportedLocale, Record<string, string>> = {
  de: {
    features: 'Hauptmerkmale',
    specifications: 'Technische Daten',
    benefits: 'Ihre Vorteile',
    warranty: 'Garantie & Service',
    gallery: 'Produktgalerie',
    faq: 'Häufig gestellte Fragen',
  },
  en: {
    features: 'Key Features',
    specifications: 'Technical Specifications',
    benefits: 'Your Benefits',
    warranty: 'Warranty & Service',
    gallery: 'Product Gallery',
    faq: 'Frequently Asked Questions',
  },
  es: {
    features: 'Características Principales',
    specifications: 'Especificaciones Técnicas',
    benefits: 'Sus Beneficios',
    warranty: 'Garantía y Servicio',
    gallery: 'Galería de Productos',
    faq: 'Preguntas Frecuentes',
  },
  th: {
    features: 'คุณสมบัติเด่น',
    specifications: 'ข้อมูลจำเพาะทางเทคนิค',
    benefits: 'ข้อดีของคุณ',
    warranty: 'การรับประกันและบริการ',
    gallery: 'แกลเลอรี่สินค้า',
    faq: 'คำถามที่พบบ่อย',
  },
};

// Locale-specific language instructions
const LANGUAGE_INSTRUCTIONS: Record<SupportedLocale, string> = {
  de: 'Generate ALL text content in GERMAN (Deutsch). Use professional German marketing language.',
  en: 'Generate ALL text content in ENGLISH. Use professional marketing language.',
  es: 'Generate ALL text content in SPANISH (Español). Use professional Spanish marketing language for Mexico market.',
  th: 'Generate ALL text content in THAI (ภาษาไทย). Use professional Thai marketing language.',
};

/**
 * Filter images to only include actual product images (not banners, logos, etc.)
 */
function filterProductImages(images: ProductImage[]): ProductImage[] {
  return images.filter(img => {
    if (!img.src) return false;
    const src = img.src.toLowerCase();
    const alt = (img.alt || '').toLowerCase();

    // Exclude banners, promotions, logos, tracking pixels
    const excludePatterns = [
      '/banners/', '/banner/', '/promotion/', '/promo/',
      '/logo/', 'logo-lg', 'logo.svg', 'logo.png',
      '/wcms/', '/gnb/', '/lifesgood/',
      'teads.tv', 'bazaarvoice', 'tracking',
      'width=0', 'height=0',
      'membership', 'financing', '0-financing',
      'trade-up', 'winter-sale', 'happy-new-year',
      'gaming-chair', 'xboom-landing',
    ];

    // Include patterns that indicate product images
    const includePatterns = [
      '/gallery/', '/thumbnail/', '/product/',
      'basic-01', 'basic-02', 'gallery-',
      '-front', '-back', '-side', '-angle',
    ];

    // Exclude if matches any exclude pattern
    for (const pattern of excludePatterns) {
      if (src.includes(pattern) || alt.includes(pattern)) return false;
    }

    // Include if matches include pattern OR has meaningful alt text about product
    const hasProductAlt = alt.length > 10 && !alt.includes('banner') && !alt.includes('promotion');
    const matchesInclude = includePatterns.some(p => src.includes(p));
    const hasGoodDimensions = (img.width || 0) >= 200 && (img.height || 0) >= 200;

    return matchesInclude || (hasProductAlt && hasGoodDimensions);
  });
}

/**
 * Filter specifications to remove financing/subscription info and keep only tech specs
 */
function filterTechnicalSpecs(specs: Record<string, string | number>): Record<string, string | number> {
  const filtered: Record<string, string | number> = {};

  // Patterns that indicate financing/subscription (NOT tech specs)
  const excludePatterns = [
    'monatliche', 'rate', 'zinssatz', 'zinsen', 'gesamtbetrag',
    'monthly', 'financing', 'interest', 'total amount',
    'mensual', 'financiación', 'interés',
    '€', '$', '฿', 'EUR', 'USD', 'THB',
  ];

  for (const [key, value] of Object.entries(specs)) {
    const keyLower = key.toLowerCase();
    const valueLower = String(value).toLowerCase();

    // Skip if key or value matches financing patterns
    const isFinancing = excludePatterns.some(p =>
      keyLower.includes(p) || valueLower.includes(p)
    );

    if (!isFinancing) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Generate technical specifications from product category if none available
 */
function generateDefaultSpecs(category: string, modelNumber: string): Record<string, string> {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('oled') || categoryLower.includes('tv') || categoryLower.includes('qned')) {
    return {
      'Display Type': categoryLower.includes('oled') ? 'OLED' : 'LED/LCD',
      'Resolution': '4K UHD (3840 x 2160)',
      'HDR': 'HDR10, HLG, Dolby Vision',
      'Smart TV': 'webOS',
      'Processor': 'AI Processor',
      'Refresh Rate': '120Hz',
      'HDMI': '4x HDMI 2.1',
      'Audio': 'Dolby Atmos',
      'Model': modelNumber,
    };
  }

  if (categoryLower.includes('soundbar') || categoryLower.includes('audio')) {
    return {
      'Audio Channels': '5.1 / 7.1',
      'Total Power': '400W+',
      'Subwoofer': 'Wireless',
      'Bluetooth': '5.0',
      'HDMI': 'HDMI eARC',
      'Dolby Atmos': 'Yes',
      'DTS:X': 'Yes',
      'Model': modelNumber,
    };
  }

  return {
    'Brand': 'LG Electronics',
    'Model': modelNumber,
    'Warranty': '2 Years',
  };
}

/**
 * Build section-specific prompts for independent generation
 * Each section has a unique, specialized prompt optimized for its purpose
 */
function buildSectionPrompt(
  product: ProductData,
  platformConfig: { color: string; name: string; locale: SupportedLocale; country: string },
  section?: string
): string {
  const rawSpecs = product.rawData?.specifications || {};
  const specs = filterTechnicalSpecs(rawSpecs);
  const features = product.rawData?.features || [];
  const highlights = product.rawData?.highlights || [];
  const usps = product.rawData?.usps || [];
  const basicInfo = product.rawData?.basicInfo || {};
  const faqData = product.rawData?.faq || [];
  const locale = platformConfig.locale;
  const titles = SECTION_TITLES[locale];

  // Apply eBay best practices for title length
  const truncatedTitle = product.title.substring(0, EBAY_BEST_PRACTICES.titleMaxLength);

  // Collect and FILTER images to only include actual product images
  const galleryImages = filterProductImages(product.galleryImages || []);
  const lifestyleImages = filterProductImages(product.lifestyleImages || []);
  const mainImage = product.mainImage && filterProductImages([product.mainImage])[0];

  const allImages = [
    mainImage,
    ...galleryImages,
    ...lifestyleImages,
  ].filter((img): img is ProductImage => Boolean(img && img.src));

  // Format images for prompt
  const mainImageUrl = mainImage?.src || (allImages[0]?.src || '');
  const mainImageAlt = mainImage?.alt || product.title;

  // Build image list for gallery section
  const imageListForPrompt = allImages.map((img, idx) =>
    `  - Image ${idx + 1}: URL="${img.src}" ALT="${img.alt || product.title}" (${img.width || 800}x${img.height || 600})`
  ).join('\n');

  // Build headline and product context
  const productHeadline = basicInfo.headline || product.description?.slice(0, 150) || '';
  const productContext = `
PRODUCT CONTEXT:
- Brand: LG Electronics
- Product Name: ${basicInfo.productName || product.title}
- Model Number: ${product.modelNumber}
- Category: ${product.categoryName}
- Headline: ${productHeadline}
- Screen Size/Capacity: ${basicInfo.screenSize || 'N/A'}
- Series: ${basicInfo.series || 'N/A'}
- Price: ${product.price ? `${product.currency || '€'}${product.price}` : 'Contact for price'}
`;

  // Base instructions shared across all sections
  const baseInstructions = `
You are an expert e-commerce content designer for LG Electronics. Generate clean, professional HTML content for the ${platformConfig.name} marketplace in ${platformConfig.country}.

${LANGUAGE_INSTRUCTIONS[locale]}

EBAY MARKETPLACE BEST PRACTICES (CRITICAL):
1. MOBILE-FIRST: 80%+ of buyers use mobile - ensure responsive design
2. MINIMAL HTML: Simple, clean formatting - no complex layouts
3. SINGLE TYPEFACE: Use 'LG EI Text', 'Helvetica Neue', Arial, sans-serif
4. 14px BLACK FONT: Standard text should be 14px, color #1A1A1A
5. NO EXTERNAL LINKS: Do not include any links to external websites
6. NO EMOJIS: Use simple geometric shapes or bullets only

STRICT BRAND GUIDELINES:
- LG Primary Red: #A50034
- Dark text: #1A1A1A
- Gray text: #6B6B6B
- Light background: #F5F5F5
- White: #FFFFFF
- Platform accent: ${platformConfig.color}
- Use inline CSS styles only
- Container width: max 800px

OUTPUT REQUIREMENTS:
- Return ONLY valid HTML with inline styles
- NO markdown, NO code blocks, NO explanations
- Make it visually appealing and professional
`;

  // ═══════════════════════════════════════════════════════════════════
  // HERO SECTION PROMPT - Image-first layout with product introduction
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'hero') {
    return `${baseInstructions}

SECTION: HERO (Product Introduction)
PURPOSE: Create immediate visual impact with product image, establish brand credibility

${productContext}

PRODUCT DESCRIPTION:
${product.description || 'Premium LG product with innovative technology and elegant design.'}

MAIN PRODUCT IMAGE (REQUIRED - USE THIS EXACT URL):
- URL: ${mainImageUrl}
- Alt Text: ${mainImageAlt}

LAYOUT REQUIREMENTS (IMAGE-FIRST):
1. LARGE PRODUCT IMAGE at TOP - MANDATORY
   - YOU MUST include this exact image tag:
     <img src="${mainImageUrl}" alt="${mainImageAlt}" style="width:100%; max-width:600px; height:auto; display:block; margin:0 auto 24px auto; border-radius:8px;" />
   - This is the ACTUAL product image URL - use it exactly as provided
   - Image should be prominent, centered, high-quality appearance

2. TITLE below image
   - Text: "${truncatedTitle}"
   - Font: 24px, bold, color #1A1A1A
   - Center aligned

3. MODEL NUMBER badge
   - Text: "${product.modelNumber}"
   - Small badge: background #F5F5F5, padding 4px 12px, font 12px

4. CATEGORY badge
   - Text: "${product.categoryName}"
   - Use LG Red (#A50034) background, white text

5. SHORT DESCRIPTION
   - Write 1-2 compelling sentences based on the product description
   - Font 14px, color #6B6B6B
   - Center aligned below badges

6. TRUST BADGES (create a horizontal row)
   - "2 Year Warranty" - small shield shape (CSS border)
   - "Free Shipping" - small box shape (CSS border)

DESIGN: Clean, centered, white background (#FFFFFF) with subtle border (1px solid #F5F5F5). Container max-width 800px, padding 20px.

CRITICAL: The main image URL provided is the ACTUAL product image - you MUST use it in the HTML output.
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // GALLERY SECTION PROMPT - Product images showcase with download buttons
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'gallery') {
    // Only generate gallery if we have multiple images
    if (allImages.length < 2) {
      return `Return an empty string. Not enough images for a gallery section.`;
    }

    const galleryImagesData = allImages.slice(0, 6);

    return `${baseInstructions}

SECTION: GALLERY (Product Images Showcase with Download Buttons)
PURPOSE: Display multiple product angles and lifestyle images with download capability

${productContext}

AVAILABLE IMAGES (USE THESE EXACT URLs):
${imageListForPrompt}

Total Images Available: ${allImages.length}

CRITICAL REQUIREMENTS:
You MUST create <img> tags using the EXACT URLs provided above. These are real product images.
Each image MUST have a small download button at the bottom-left corner.

LAYOUT REQUIREMENTS:
1. SECTION TITLE: "${titles.gallery}"
   - Font: 20px, bold, color #1A1A1A
   - Red accent bar on left (4px width, LG Red #A50034)

2. IMAGE GRID - USE THESE EXACT IMAGES WITH DOWNLOAD BUTTONS:
   Each image card structure:
   <div style="position:relative; flex:1 1 calc(33% - 16px); min-width:200px;">
     <img src="[EXACT URL]" alt="[ALT TEXT]" style="width:100%; height:200px; object-fit:cover; border-radius:8px;" />
     <a href="[EXACT URL]" download style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.7); color:#fff; padding:4px 8px; border-radius:4px; font-size:10px; text-decoration:none; display:flex; align-items:center; gap:4px;">
       <span style="font-size:12px;">↓</span> Download
     </a>
   </div>

   Generate for these images:
${galleryImagesData.map((img, idx) => `   Image ${idx + 1}: URL="${img.src}" ALT="${img.alt || product.title}"`).join('\n')}

3. GRID LAYOUT
   - Use CSS flexbox: display:flex; flex-wrap:wrap; gap:16px;
   - Desktop: 2-3 columns
   - Each image wrapper: position:relative; flex:1 1 calc(33% - 16px); min-width:200px;

4. IMAGE STYLING
   - border-radius: 8px
   - background: #F5F5F5 (placeholder while loading)
   - object-fit: cover
   - Consistent height: 200px

5. DOWNLOAD BUTTON (REQUIRED for each image)
   - Position: absolute, bottom-left corner (bottom:8px; left:8px)
   - Style: background rgba(0,0,0,0.7), white text, padding 4px 8px
   - Font: 10px, no underline
   - Include down arrow (↓) icon
   - Link href should be the image URL with download attribute

6. CONTAINER
   - Background: #F5F5F5
   - Padding: 32px
   - Border-radius: 8px
   - Max-width: 800px

DESIGN: Clean gallery grid with download buttons on each image for easy saving.

CRITICAL:
- Use the EXACT image URLs provided - they are real product images
- Every image MUST have a download button at bottom-left
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURES SECTION PROMPT - Key product features list
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'features') {
    return `${baseInstructions}

SECTION: FEATURES (Key Product Features)
PURPOSE: Highlight main selling points in scannable format

${productContext}

PRODUCT DESCRIPTION FOR CONTEXT:
${product.description || ''}

FEATURES TO DISPLAY:
${features.slice(0, 8).map((f, i) => `${i + 1}. ${f}`).join('\n') || `Generate 5-6 relevant features based on the product category "${product.categoryName}" and product type.`}

HIGHLIGHTS:
${highlights.slice(0, 4).map(h => `• ${h}`).join('\n') || ''}

USPS:
${usps.slice(0, 4).map(u => `• ${u.headline}: ${u.description}`).join('\n') || ''}

CONTENT GENERATION RULES:
1. If features are provided, use them directly
2. If no features provided, ANALYZE the product type and create relevant features
3. Write compelling marketing copy based on the product category
4. Each feature should have: Bold headline + descriptive text

LAYOUT REQUIREMENTS:
1. SECTION TITLE
   - Text: "${titles.features}"
   - Font: 22px, bold, color #1A1A1A
   - Red accent bar on left (4px width, height 24px, #A50034)

2. FEATURE LIST
   - Vertical list format (mobile-friendly)
   - Each item in a white card with subtle border
   - Icon: Small red circle (8px, #A50034) as bullet
   - Headline: Bold, 14px, #1A1A1A
   - Description: Regular, 14px, #6B6B6B
   - Card padding: 16px
   - Gap between cards: 14px

3. STYLING
   - Section background: #F5F5F5
   - Cards: white background, 1px border #E0E0E0, border-radius 6px
   - Alternating subtle background optional

4. CONTAINER
   - Padding: 40px
   - Border-radius: 8px
   - Max 6-8 features displayed

DESIGN: Clean vertical cards, easy to scan, professional marketing appearance.
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // SPECIFICATIONS SECTION PROMPT - Technical specs table (NO FINANCING DATA)
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'specifications') {
    // Use filtered specs or generate defaults for the category
    let specsToUse = specs;
    if (Object.keys(specs).length === 0) {
      specsToUse = generateDefaultSpecs(product.categoryName, product.modelNumber);
    }
    const specsEntries = Object.entries(specsToUse).slice(0, 15);

    return `${baseInstructions}

SECTION: SPECIFICATIONS (Technical Specifications Sheet)
PURPOSE: Present TECHNICAL specifications in organized table format - NO PRICING OR FINANCING INFO

${productContext}

IMPORTANT: This is a TECHNICAL SPECIFICATIONS sheet. Do NOT include:
- Monthly payments, financing rates, or subscription pricing
- Currency amounts or prices
- Payment plans or installment information

TECHNICAL SPECIFICATIONS TO DISPLAY:
${specsEntries.map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Total Specifications: ${specsEntries.length}

CONTENT GENERATION RULES:
1. Use the EXACT specification names and values provided above
2. These are TECHNICAL specs only - display type, resolution, audio, connectivity, etc.
3. NEVER include pricing, financing, or payment information in specs table
4. If specs seem incomplete, you may add relevant technical details for "${product.categoryName}"

TYPICAL TECHNICAL SPECS TO CONSIDER (if not provided):
- For TVs: Display Type, Resolution, HDR Support, Refresh Rate, Smart TV Platform, HDMI Ports, Audio
- For Soundbars: Channels, Total Power, Subwoofer, Bluetooth, HDMI, Dolby Atmos, DTS:X
- For All: Model Number, Brand, Dimensions, Weight, Energy Class

LAYOUT REQUIREMENTS:
1. SECTION TITLE
   - Text: "${titles.specifications}"
   - Font: 22px, bold, color #1A1A1A, uppercase, letter-spacing 0.5px
   - Icon: Small grid/chip shape using CSS (borders, not emoji)

2. SPECS TABLE (TECHNICAL DATA ONLY):
   - Two-column layout: Property | Value
   - Full width table (width: 100%)
   - Alternating row colors: odd=#F5F5F5, even=#FFFFFF
   - Property column: width 45%, bold, left-aligned, padding 14px 16px
   - Value column: width 55%, regular, right-aligned, padding 14px 16px

3. TABLE STYLING
   - border-collapse: collapse
   - Outer border: 1px solid #E5E5E5
   - Row border-bottom: 1px solid #E5E5E5
   - Font: 14px, color #1A1A1A
   - Last row: no border-bottom

4. CONTAINER
   - Background: white #FFFFFF
   - Border: 1px solid #F5F5F5
   - Padding: 40px
   - Border-radius: 8px
   - Max-width: 800px

DESIGN: Professional technical data table, zebra striping for readability, clean borders.
CRITICAL: This is a TECH SPEC sheet - NO pricing or financing information allowed.
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // BENEFITS SECTION PROMPT - Customer value propositions
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'benefits') {
    return `${baseInstructions}

SECTION: BENEFITS (Why Choose This Product)
PURPOSE: Communicate key value propositions and customer benefits

${productContext}

USPs PROVIDED:
${usps.slice(0, 4).map(usp => `• ${usp.headline}: ${usp.description}`).join('\n') || ''}

PRODUCT FEATURES FOR CONTEXT:
${features.slice(0, 4).join(', ') || product.categoryName}

CONTENT GENERATION RULES:
1. If USPs are provided, use them to create benefit cards
2. If no USPs, generate 4 relevant benefits based on the product category
3. Make benefits customer-focused (what THEY get, not product features)
4. Use compelling marketing language appropriate for the locale

DEFAULT BENEFITS (use ONLY if no USPs provided):
• Energy Efficient: Save on electricity bills with advanced technology
• Whisper Quiet: Enjoy peace and comfort at home
• Smart Home Ready: Compatible with Google Home & Alexa
• Long-lasting Quality: Premium LG quality built to last years

LAYOUT REQUIREMENTS:
1. SECTION TITLE
   - Text: "${titles.benefits}"
   - Font: 22px, bold, color WHITE
   - Centered, uppercase, letter-spacing 1px

2. BENEFITS GRID
   - 2x2 grid layout using flexbox
   - flex-wrap: wrap
   - Each card: flex: 1 1 340px
   - Gap: 16px

3. BENEFIT CARDS
   - Background: rgba(255,255,255,0.12)
   - Border-radius: 4px
   - Padding: 24px
   - Icon: Simple geometric shape using CSS (circle, square outline - 18-20px)
   - Title: 15px, bold, white #FFFFFF
   - Description: 13px, white with opacity 0.9
   - Line-height: 1.5

4. CONTAINER
   - Background: LG Red (#A50034)
   - Padding: 40px
   - Border-radius: 8px
   - Max-width: 800px

DESIGN: Bold red section that stands out, trust-building messaging, premium feel. 4 benefit cards in 2x2 grid.
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // WARRANTY SECTION PROMPT - Trust and guarantee information
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'warranty') {
    return `${baseInstructions}

SECTION: WARRANTY (Trust & Service Information)
PURPOSE: Build customer confidence with warranty and service details

${productContext}

WARRANTY DETAILS FOR LG PRODUCTS:
- Duration: 2 Year Manufacturer Warranty (standard for LG Electronics)
- Coverage: Full parts and labor for manufacturing defects
- Service: Nationwide authorized service centers
- Parts: Genuine LG replacement parts only
- Support: Dedicated customer service hotline and online support
- Registration: Product registration recommended for extended benefits

CONTENT GENERATION RULES:
1. Write warranty content specific to LG brand standards
2. Use reassuring, professional language appropriate for the locale
3. Emphasize LG's commitment to quality and customer satisfaction
4. Make the warranty feel valuable and trustworthy

LAYOUT REQUIREMENTS:
1. SECTION TITLE
   - Text: "${titles.warranty}"
   - Font: 20px, bold, color #1A1A1A
   - Red accent bar on left (4px, #A50034)

2. MAIN CONTENT
   - Large shield icon with checkmark using CSS borders (green: #43a047)
   - "2 Year Manufacturer Warranty" as main headline
   - Description paragraph explaining coverage: 14px, color #6B6B6B
   - Mention LG brand quality assurance

3. TRUST POINTS (horizontal row with flexbox)
   - "Free Repairs" with green checkmark (CSS shape)
   - "Genuine LG Parts" with green checkmark
   - "Nationwide Service" with green checkmark
   - "Expert Support" with green checkmark
   - Each: inline-flex, green checkmark shape + text, gap 8px

4. STYLING
   - Green accent color: #43a047
   - Border: 2px solid #c8e6c9 (light green)
   - Background: white #FFFFFF
   - Padding: 36px
   - Border-radius: 8px
   - Box-shadow: 0 2px 8px rgba(0,0,0,0.05)

5. LAYOUT
   - Shield icon: 60-80px, using CSS borders (no images needed)
   - Content: flex layout, icon on left + text block on right
   - Trust points: bottom row, flex-wrap: wrap, gap: 16px
   - Container: max-width 800px

DESIGN: Trust-building green accent, professional warranty presentation, reassuring tone that builds confidence in purchase decision.
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FAQ SECTION - Frequently Asked Questions
  // ═══════════════════════════════════════════════════════════════════
  if (section === 'faq') {
    // Use FAQ data from product if available (from rawData)
    const faqData = product.rawData?.faq || [];
    const hasFaqData = faqData.length > 0;

    const faqInstructions = hasFaqData
      ? `FAQ DATA FROM PRODUCT (USE THESE):
${faqData.map((faq: { question: string; answer: string }, idx: number) => `Q${idx + 1}: ${faq.question}
A${idx + 1}: ${faq.answer}`).join('\n\n')}`
      : `No FAQ data available. Generate 5-6 common questions and answers for a ${product.categoryName} product like "${truncatedTitle}".
Typical questions should cover:
- Setup and installation
- Connectivity options (HDMI, Bluetooth, WiFi)
- Compatibility with other devices
- Maintenance and care
- Troubleshooting common issues
- Warranty and support`;

    return `${baseInstructions}

${productContext}

${faqInstructions}

LOCALE: ${locale}
- de: Write in German
- en: Write in English
- es: Write in Spanish
- th: Write in Thai

Generate an FAQ section with clean, professional HTML.

LAYOUT REQUIREMENTS:
1. SECTION TITLE
   - Text: "${titles.faq}"
   - Font: 20px, bold, color #1A1A1A
   - Red accent bar on left (4px, #A50034)
   - Margin-bottom: 24px

2. FAQ ACCORDION STRUCTURE
   Each Q&A should be a collapsible item:
   - Question: 16px, font-weight 600, color #1A1A1A
   - Answer: 14px, color #6B6B6B, line-height 1.6
   - Use <details> and <summary> HTML elements for native accordion
   - Padding: 16px per item
   - Border-bottom: 1px solid #E5E5E5 between items
   - Hover effect on summary: background #F5F5F5

3. STYLING
   - Container: white background, border-radius 8px
   - Box-shadow: 0 2px 8px rgba(0,0,0,0.05)
   - Padding: 24px
   - Max-width: 800px

4. DETAILS/SUMMARY STYLING
   <style>
   details { border-bottom: 1px solid #E5E5E5; }
   details:last-child { border-bottom: none; }
   summary {
     cursor: pointer;
     padding: 16px 0;
     font-weight: 600;
     font-size: 16px;
     list-style: none;
     display: flex;
     justify-content: space-between;
     align-items: center;
   }
   summary::-webkit-details-marker { display: none; }
   summary::after { content: '+'; font-size: 20px; color: #A50034; }
   details[open] summary::after { content: '−'; }
   details[open] summary { color: #A50034; }
   .faq-answer { padding: 0 0 16px 0; color: #6B6B6B; line-height: 1.6; }
   </style>

5. CONTENT QUALITY
   - Answers should be helpful and informative
   - Use clear, concise language appropriate for ${locale}
   - Include specific product details when relevant
   - Make answers 2-4 sentences each

DESIGN: Clean accordion layout, easy to scan, helpful answers that address real customer concerns.
`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FULL TEMPLATE PROMPT - All sections combined
  // ═══════════════════════════════════════════════════════════════════

  // Build gallery images data for full template
  const templateGalleryImages = allImages.slice(0, 6);

  return `${baseInstructions}

${productContext}

MAIN PRODUCT IMAGE (USE THIS EXACT URL):
- URL: ${mainImageUrl}
- Alt: ${mainImageAlt}
- IMPORTANT: You MUST use this URL in an <img> tag in the hero section

GALLERY IMAGES (USE THESE EXACT URLs):
${templateGalleryImages.map((img, idx) => `- Image ${idx + 1}: URL="${img.src}" ALT="${img.alt || product.title}"`).join('\n')}

PRODUCT DESCRIPTION:
${product.description || 'Premium LG product with innovative technology and elegant design.'}

SPECIFICATIONS:
${Object.entries(specs).slice(0, 10).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

FEATURES:
${features.slice(0, 6).map(f => `- ${f}`).join('\n') || 'Generate relevant features for this product category.'}

USPS:
${usps.slice(0, 4).map(u => `- ${u.headline}: ${u.description}`).join('\n') || ''}

Generate a COMPLETE PRODUCT PAGE with these sections (IMAGE-FIRST layout):

1. HERO SECTION (IMAGE FIRST):
   - MANDATORY: Include this exact image tag at the TOP:
     <img src="${mainImageUrl}" alt="${mainImageAlt}" style="width:100%; max-width:600px; height:auto; display:block; margin:0 auto 24px auto; border-radius:8px;" />
   - Product title: "${truncatedTitle}" (24px, bold, centered)
   - Model badge: "${product.modelNumber}" (12px, #F5F5F5 background)
   - Category badge: "${product.categoryName}" (#A50034 background, white text)
   - Brief compelling description (14px, #6B6B6B)
   - Trust badges row

2. GALLERY SECTION (if multiple images available):
   - Section title: "${titles.gallery}"
   - Grid of product images using the EXACT URLs provided above
   - 2-3 column flexbox layout
   - Each image: border-radius 8px, height 200px, object-fit cover
   - EACH IMAGE MUST have a download button at bottom-left:
     <a href="[IMAGE_URL]" download style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.7); color:#fff; padding:4px 8px; border-radius:4px; font-size:10px;">↓ Download</a>

3. FEATURES SECTION:
   - Section title: "${titles.features}"
   - Key features in vertical card format (mobile-friendly)
   - Red bullet points (#A50034)
   - White cards with subtle borders

4. SPECIFICATIONS SECTION:
   - Section title: "${titles.specifications}"
   - Technical specs table (two columns)
   - Use ONLY the specifications provided above
   - Zebra striping for rows

5. BENEFITS SECTION:
   - Section title: "${titles.benefits}"
   - LG Red (#A50034) background
   - 2x2 grid of benefit cards
   - White text, translucent card backgrounds

6. WARRANTY SECTION:
   - Section title: "${titles.warranty}"
   - Green accent (#43a047)
   - Shield icon with checkmark (CSS-only)
   - Trust points row

7. FAQ SECTION:
   - Section title: "${titles.faq}"
   - Collapsible accordion using <details>/<summary> HTML
   - 5-6 common questions about the product
   - Clean, helpful answers
   - Plus/minus toggle indicator

CRITICAL: Use the EXACT image URLs provided - they are real product images.
Make each section visually distinct but cohesive. Container max-width: 800px. Padding: 32px-40px per section.
`;
}
