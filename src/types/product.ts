/**
 * LGAIP Product Data Types
 * Comprehensive data structure for crawled LG product information
 */

export type CountryCode = 'de' | 'uk' | 'fr' | 'es' | 'it' | 'th' | 'vn' | 'mx' | 'br' | 'kr' | 'jp';

export type ProductCategory =
  | 'tv'
  | 'audio'
  | 'refrigerator'
  | 'washing-machine'
  | 'air-conditioner'
  | 'vacuum'
  | 'monitor'
  | 'laptop'
  | 'projector'
  | 'dishwasher';

export type ImageType = 'main' | 'gallery' | 'banner' | 'lifestyle' | 'feature' | '360' | 'video-thumbnail';

export type CrawlStatus = 'success' | 'partial' | 'failed' | 'pending';

export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected';

export type Platform = 'shopee' | 'lazada' | 'ebay' | 'amazon' | 'tiktok' | 'mediamarkt' | 'saturn' | 'otto' | 'galaxus' | 'kaufland' | 'mercadolibre';

export type Channel = 'd2c' | '3p';

// Image data structure
export interface ProductImage {
  id: string;
  url: string;
  localPath?: string;
  cdnUrl?: string;
  type: ImageType;
  width?: number;
  height?: number;
  altText?: string;
  containsText?: boolean;
  extractedText?: string;
  sortOrder: number;
}

// Product specification
export interface ProductSpec {
  group: string;
  name: string;
  value: string;
  unit?: string;
  normalizedValue?: number;
  normalizedUnit?: string;
}

// Normalized dimensions
export interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: 'mm' | 'cm' | 'inch';
}

// Normalized weight
export interface Weight {
  value: number;
  unit: 'kg' | 'lb';
}

// Power specifications
export interface PowerSpec {
  consumption?: number;
  voltage?: string;
  energyClass?: string;
}

// Product pricing
export interface ProductPricing {
  currency: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  priceValidUntil?: string;
}

// Unique Selling Point
export interface USP {
  headline: string;
  description: string;
  icon?: string;
  image?: string;
}

// Product feature
export interface ProductFeature {
  title: string;
  description: string;
  image?: string;
}

// Certification
export interface Certification {
  name: string;
  image?: string;
  validUntil?: string;
}

// Category structure
export interface ProductCategoryInfo {
  primary: string;
  secondary?: string;
  tertiary?: string;
  breadcrumb: string[];
}

// SEO data
export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  structuredData?: Record<string, unknown>;
}

// Availability info
export interface AvailabilityInfo {
  inStock: boolean;
  stockLevel: 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';
  deliveryEstimate?: string;
}

// Related products
export interface RelatedProducts {
  accessories: string[];
  similarProducts: string[];
  bundles: string[];
}

// Crawl metadata
export interface CrawlMetadata {
  crawlStatus: CrawlStatus;
  crawlDuration?: number;
  pageLoadTime?: number;
  errors?: string[];
  lastModified?: string;
  version: number;
}

// Marketing content
export interface MarketingContent {
  usps: USP[];
  features: ProductFeature[];
  awards: string[];
  certifications: Certification[];
}

// Normalized specifications
export interface NormalizedSpecs {
  dimensions?: Dimensions;
  weight?: Weight;
  power?: PowerSpec;
  screenSize?: number;
  resolution?: string;
  [key: string]: unknown;
}

// Main product data structure
export interface LGProductData {
  // Identifiers
  id: string;
  sku: string;
  country: CountryCode;
  sourceUrl: string;
  crawledAt: string;

  // Basic product info
  product: {
    title: string;
    shortDescription?: string;
    longDescription?: string;
    category: ProductCategoryInfo;
    brand: string;
  };

  // Pricing
  pricing?: ProductPricing;

  // Images
  images: {
    main?: ProductImage;
    gallery: ProductImage[];
    banners: ProductImage[];
  };

  // Specifications
  specifications: {
    raw: ProductSpec[];
    normalized: NormalizedSpecs;
  };

  // Marketing
  marketing: MarketingContent;

  // SEO
  seo?: SEOData;

  // Availability
  availability?: AvailabilityInfo;

  // Related
  related?: RelatedProducts;

  // Metadata
  metadata: CrawlMetadata;
}

// Generated content for 3P platforms
export interface GeneratedContent {
  id: string;
  productId: string;
  platform: Platform;
  contentType: 'banner' | 'thumbnail' | 'description' | 'seo' | 'full_package';
  status: ContentStatus;
  content: {
    title?: string;
    description?: string;
    bulletPoints?: string[];
    images?: ProductImage[];
    seoData?: SEOData;
  };
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
}

// Pipeline step status
export interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  output?: unknown;
  error?: string;
}

// Content generation pipeline
export interface ContentPipeline {
  id: string;
  productId: string;
  targetPlatforms: Platform[];
  channel: Channel;
  steps: PipelineStep[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

// Country configuration
export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  language: string;
  currency: string;
  lgSiteUrl: string;
  platforms: Platform[];
  enabled: boolean;
}

// Dashboard state
export interface DashboardState {
  selectedCountry: CountryCode | null;
  selectedProduct: string | null;
  selectedChannel: Channel | null;
  selectedPlatforms: Platform[];
}
