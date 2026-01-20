/**
 * CrawledProduct Types
 * Types matching the actual crawled LG product JSON structure
 */

export interface CrawledImage {
  src: string;
  srcset: string | null;
  alt: string;
  width: number;
  height: number;
}

export interface CrawledVideo {
  src: string;
  poster?: string;
  title?: string;
}

export interface CrawledBasicInfo {
  productName: string;
  headline: string;
  screenSize?: string;
  series?: string;
  year?: number;
  brand: string;
  modelNumber: string;
}

export interface CrawledPricing {
  currentPrice: string;
  currency: string;
  seller?: string;
  originalPrice?: string;
}

export interface CrawledRatings {
  averageRating: string;
  reviewCount: number;
  bestRating: number;
}

export interface CrawledEnergyEfficiency {
  category: string;
  scaleMax: string;
  scaleMin: string;
  eprelCertificationId?: string;
}

export interface CrawledReview {
  headline: string;
  body: string;
  rating: number;
  author: string;
  dateCreated: string;
  datePublished: string;
  images?: string[];
}

export interface CrawledBreadcrumb {
  position: number;
  name: string;
  url: string;
}

export interface CrawledFAQ {
  question: string;
  answer: string;
}

export interface CrawledMetadata {
  mpn: string;
  title: string;
  description: string;
  ogImage?: string;
  ogTitle?: string;
  canonical: string;
}

export interface CrawledStructuredData {
  jsonLd: Record<string, unknown>[];
}

export interface CrawledProduct {
  // Crawl info
  crawledAt: string;
  url: string;
  modelNumber: string;
  category: string;

  // Basic product info
  basicInfo: CrawledBasicInfo;

  // Pricing
  pricing: CrawledPricing;

  // Ratings
  ratings?: CrawledRatings;

  // Energy efficiency
  energyEfficiency?: CrawledEnergyEfficiency;

  // Media
  media: {
    images: CrawledImage[];
    videos?: CrawledVideo[];
  };

  // Specifications (dynamic key-value pairs)
  specifications: Record<string, string>;

  // Features
  features: string[];

  // Reviews
  reviews?: {
    summary: Record<string, unknown>;
    featured: CrawledReview[];
  };

  // Navigation
  breadcrumb: CrawledBreadcrumb[];

  // FAQ
  faq: CrawledFAQ[];

  // Metadata
  metadata: CrawledMetadata;

  // Structured data
  structuredData?: CrawledStructuredData;
}

// Product category mapping for the dashboard
export type ProductCategoryId =
  | 'oled'
  | 'oled-evo'
  | 'qned'
  | 'qned-evo'
  | 'nanocell'
  | '4k-uhd'
  | 'uhd'
  | 'soundbar'
  | 'tv-bundles'
  | 'tv-zubehoer'
  | 'smart-tvs';

export interface ProductCategoryInfo {
  id: ProductCategoryId;
  name: string;
  dataDir: string;
  count: number;
}

// Normalized product for dashboard display
export interface DashboardProduct {
  id: string;
  modelNumber: string;
  category: ProductCategoryId;
  categoryName: string;

  // Display info
  title: string;
  description: string;

  // Images - filtered and prioritized
  mainImage: CrawledImage | null;
  galleryImages: CrawledImage[];

  // Pricing
  price: string;
  currency: string;

  // Ratings
  rating: number;
  reviewCount: number;

  // Energy
  energyClass?: string;

  // Source
  sourceUrl: string;
  crawledAt: string;

  // Full data reference
  rawData: CrawledProduct;
}

/**
 * Filter product images to get only relevant product images
 * Excludes banners, logos, and promotional images
 */
export function filterProductImages(images: CrawledImage[]): CrawledImage[] {
  return images.filter(img => {
    const src = img.src.toLowerCase();
    const alt = img.alt.toLowerCase();

    // Exclude promotional/banner images
    if (src.includes('/promotion/') || src.includes('/banners/')) return false;
    if (src.includes('gnb') || src.includes('-gnb-')) return false;
    if (src.includes('logo')) return false;
    if (src.includes('energy-label')) return false;

    // Exclude very small images
    if (img.width > 0 && img.width < 200) return false;

    // Include gallery and product images
    if (src.includes('/gallery/')) return true;
    if (src.includes('/thumbnail/')) return true;
    if (src.includes('/basic/')) return true;
    if (alt.includes('frontansicht') || alt.includes('front')) return true;
    if (alt.includes('rückansicht') || alt.includes('back')) return true;
    if (alt.includes('seitenansicht') || alt.includes('side')) return true;

    // Default: include if it looks like a product image
    return img.width >= 350 || img.height >= 350;
  });
}

/**
 * Get the main product image from filtered images
 */
export function getMainImage(images: CrawledImage[]): CrawledImage | null {
  const filtered = filterProductImages(images);

  // Prefer thumbnail or basic images
  const thumbnail = filtered.find(img =>
    img.src.includes('/thumbnail/') ||
    img.src.includes('/basic/') ||
    img.alt.toLowerCase().includes('frontansicht')
  );
  if (thumbnail) return thumbnail;

  // Return first gallery image
  const gallery = filtered.find(img => img.src.includes('/gallery/'));
  if (gallery) return gallery;

  // Return first image with reasonable size
  return filtered[0] || null;
}

/**
 * Validate if an object is a valid CrawledProduct
 * This helps skip non-product JSON files like manifest.json, all-urls.json, etc.
 */
export function isValidCrawledProduct(obj: unknown): obj is CrawledProduct {
  if (!obj || typeof obj !== 'object') return false;

  const product = obj as Record<string, unknown>;

  // Check for required fields that indicate a valid product
  return (
    typeof product.modelNumber === 'string' &&
    typeof product.url === 'string' &&
    product.media !== undefined &&
    typeof product.media === 'object' &&
    product.media !== null &&
    Array.isArray((product.media as Record<string, unknown>).images) &&
    product.basicInfo !== undefined &&
    typeof product.basicInfo === 'object' &&
    product.pricing !== undefined &&
    typeof product.pricing === 'object'
  );
}

/**
 * Convert CrawledProduct to DashboardProduct
 */
export function toDashboardProduct(
  product: CrawledProduct,
  categoryId: ProductCategoryId,
  categoryName: string
): DashboardProduct {
  const images = product.media?.images || [];
  const filteredImages = filterProductImages(images);
  const mainImage = getMainImage(images);

  return {
    id: product.modelNumber.toLowerCase(),
    modelNumber: product.modelNumber,
    category: categoryId,
    categoryName: categoryName,
    title: product.basicInfo.productName || product.metadata.title,
    description: product.metadata.description || '',
    mainImage,
    galleryImages: filteredImages.slice(0, 10),
    price: product.pricing.currentPrice || 'Preis auf Anfrage',
    currency: product.pricing.currency || 'EUR',
    rating: product.ratings ? parseFloat(product.ratings.averageRating) : 0,
    reviewCount: product.ratings?.reviewCount || 0,
    energyClass: product.energyEfficiency?.category,
    sourceUrl: product.url,
    crawledAt: product.crawledAt,
    rawData: product,
  };
}
