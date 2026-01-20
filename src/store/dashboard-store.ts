/**
 * Dashboard State Management with Zustand
 * Supports loading real crawled products from API
 */

import { create } from 'zustand';
import { CountryCode, Platform, Channel, ContentPipeline, LGProductData } from '@/types/product';
import { DashboardProduct, ProductCategoryInfo, CrawledProduct, CrawledImage, ProductCategoryId } from '@/types/crawled-product';
import { countries, samplePipelines } from '@/data/sample-products';
import { thailandProducts, thailandPipelines } from '@/data/sample-products-thailand';
import { mexicoProducts, mexicoPipelines } from '@/data/sample-products-mexico';

/**
 * Convert LGProductData to DashboardProduct for sample data display
 */
function lgProductToDashboardProduct(product: LGProductData): DashboardProduct {
  // Convert LGProductData images to CrawledImage format
  const mainImage: CrawledImage | null = product.images.main ? {
    src: product.images.main.url,
    srcset: null,
    alt: product.images.main.altText || product.product.title,
    width: product.images.main.width || 1200,
    height: product.images.main.height || 800,
  } : null;

  const galleryImages: CrawledImage[] = product.images.gallery.map(img => ({
    src: img.url,
    srcset: null,
    alt: img.altText || product.product.title,
    width: img.width || 1200,
    height: img.height || 800,
  }));

  // Map category to ProductCategoryId
  const categoryMapping: Record<string, ProductCategoryId> = {
    'tv': 'oled',
    'oled': 'oled',
    'oled-evo': 'oled-evo',
    'ทีวี': 'oled-evo',
    'televisores': 'oled-evo',
  };

  const categoryId = categoryMapping[product.product.category.primary.toLowerCase()] || 'oled-evo';
  const categoryName = product.product.category.secondary || product.product.category.primary;

  // Create a mock CrawledProduct for rawData compatibility
  const rawData: CrawledProduct = {
    crawledAt: product.crawledAt,
    url: product.sourceUrl,
    modelNumber: product.sku,
    category: product.product.category.primary,
    basicInfo: {
      productName: product.product.title,
      headline: product.product.shortDescription || '',
      brand: product.product.brand,
      modelNumber: product.sku,
    },
    pricing: {
      currentPrice: product.pricing?.currentPrice?.toString() || '',
      currency: product.pricing?.currency || '',
    },
    media: {
      images: mainImage ? [mainImage, ...galleryImages] : galleryImages,
    },
    specifications: product.specifications.raw.reduce((acc, spec) => {
      acc[spec.name] = `${spec.value}${spec.unit ? ' ' + spec.unit : ''}`;
      return acc;
    }, {} as Record<string, string>),
    features: product.marketing.features.map(f => f.title),
    breadcrumb: product.product.category.breadcrumb.map((name, index) => ({
      position: index + 1,
      name,
      url: '#',
    })),
    faq: [],
    metadata: {
      mpn: product.sku,
      title: product.product.title,
      description: product.product.longDescription || product.product.shortDescription || '',
      canonical: product.sourceUrl,
    },
  };

  return {
    id: product.id,
    modelNumber: product.sku,
    category: categoryId,
    categoryName,
    title: product.product.title,
    description: product.product.longDescription || product.product.shortDescription || '',
    mainImage,
    galleryImages,
    price: product.pricing?.currentPrice?.toLocaleString() || '',
    currency: product.pricing?.currency || '',
    rating: 4.5, // Default rating for sample data
    reviewCount: 0,
    energyClass: product.specifications.normalized.power?.energyClass,
    sourceUrl: product.sourceUrl,
    crawledAt: product.crawledAt,
    rawData,
  };
}

// Dashboard view types
export type DashboardView = 'countries' | 'products' | 'channels' | 'pipeline' | 'content' | 'analytics' | 'compliance';

// API response types
interface ProductsAPIResponse {
  success: boolean;
  data: {
    products: DashboardProduct[];
    categories: ProductCategoryInfo[];
    total: number;
    filtered: number;
  };
  error?: string;
}

interface DashboardState {
  // Navigation state
  currentView: DashboardView;

  // Selection state
  selectedCountry: CountryCode | null;
  selectedProduct: DashboardProduct | null;
  selectedChannel: Channel | null;
  selectedPlatforms: Platform[];

  // Data
  products: DashboardProduct[];
  categories: ProductCategoryInfo[];
  pipelines: ContentPipeline[];

  // Loading state
  isLoading: boolean;
  error: string | null;

  // UI state
  sidebarOpen: boolean;
  searchQuery: string;
  categoryFilter: string | null;
  detailModalOpen: boolean;

  // Actions
  setCurrentView: (view: DashboardView) => void;
  selectCountry: (country: CountryCode) => void;
  selectProduct: (product: DashboardProduct | null) => void;
  selectChannel: (channel: Channel) => void;
  togglePlatform: (platform: Platform) => void;
  setSelectedPlatforms: (platforms: Platform[]) => void;

  // Navigation actions
  goToCountrySelection: () => void;
  goToProducts: () => void;
  goToChannels: () => void;
  goToContent: () => void;
  goToPipeline: () => void;
  goBack: () => void;

  // UI actions
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  openDetailModal: (product: DashboardProduct) => void;
  closeDetailModal: () => void;

  // Data actions
  loadProducts: () => Promise<void>;

  // Data helpers
  getCountryConfig: () => typeof countries[0] | undefined;
  getFilteredProducts: () => DashboardProduct[];
  getProductPipeline: (productId: string) => ContentPipeline | undefined;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  currentView: 'countries',
  selectedCountry: null,
  selectedProduct: null,
  selectedChannel: null,
  selectedPlatforms: [],
  products: [],
  categories: [],
  pipelines: samplePipelines,
  isLoading: false,
  error: null,
  sidebarOpen: true,
  searchQuery: '',
  categoryFilter: null,
  detailModalOpen: false,

  // View actions
  setCurrentView: (view) => set({ currentView: view }),

  // Selection actions
  selectCountry: (country) => {
    set({
      selectedCountry: country,
      currentView: 'products',
      selectedProduct: null,
      selectedChannel: null,
      selectedPlatforms: [],
    });
    // Load products when country is selected
    get().loadProducts();
  },

  selectProduct: (product) => set({
    selectedProduct: product,
    currentView: product ? 'channels' : 'products',
  }),

  selectChannel: (channel) => {
    const state = get();
    const countryConfig = countries.find(c => c.code === state.selectedCountry);

    set({
      selectedChannel: channel,
      currentView: 'content', // Go to content editor first
      // Auto-select all platforms for the country when selecting a channel
      selectedPlatforms: channel === '3p' && countryConfig ? countryConfig.platforms : [],
    });
  },

  togglePlatform: (platform) => set((state) => {
    const platforms = state.selectedPlatforms.includes(platform)
      ? state.selectedPlatforms.filter(p => p !== platform)
      : [...state.selectedPlatforms, platform];
    return { selectedPlatforms: platforms };
  }),

  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),

  // Navigation actions
  goToCountrySelection: () => set({
    currentView: 'countries',
    selectedCountry: null,
    selectedProduct: null,
    selectedChannel: null,
    selectedPlatforms: [],
  }),

  goToProducts: () => set({
    currentView: 'products',
    selectedProduct: null,
    selectedChannel: null,
    selectedPlatforms: [],
  }),

  goToChannels: () => set({
    currentView: 'channels',
    selectedChannel: null,
    selectedPlatforms: [],
  }),

  goToContent: () => set({ currentView: 'content' }),

  goToPipeline: () => set({ currentView: 'pipeline' }),

  goBack: () => {
    const state = get();
    switch (state.currentView) {
      case 'products':
        set({ currentView: 'countries', selectedCountry: null });
        break;
      case 'channels':
        set({ currentView: 'products', selectedProduct: null });
        break;
      case 'content':
        set({ currentView: 'channels', selectedChannel: null, selectedPlatforms: [] });
        break;
      case 'pipeline':
        set({ currentView: 'content' });
        break;
      default:
        break;
    }
  },

  // UI actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  openDetailModal: (product) => set({
    selectedProduct: product,
    detailModalOpen: true,
  }),

  closeDetailModal: () => set({
    detailModalOpen: false,
  }),

  // Data actions
  loadProducts: async () => {
    const state = get();
    const country = state.selectedCountry;

    // Load sample data for Thailand and Mexico
    if (country === 'th' || country === 'mx') {
      set({ isLoading: true, error: null });

      try {
        const sampleData = country === 'th' ? thailandProducts : mexicoProducts;
        const countryPipelines = country === 'th' ? thailandPipelines : mexicoPipelines;
        const products = sampleData.map(lgProductToDashboardProduct);

        // Create category info from sample products
        const categoryMap = new Map<string, ProductCategoryInfo>();
        products.forEach(p => {
          if (!categoryMap.has(p.category)) {
            categoryMap.set(p.category, {
              id: p.category,
              name: p.categoryName,
              dataDir: p.category,
              count: 0,
            });
          }
          const cat = categoryMap.get(p.category)!;
          cat.count++;
        });

        set({
          products,
          categories: Array.from(categoryMap.values()),
          pipelines: countryPipelines,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading sample products:', error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load sample products',
        });
      }
      return;
    }

    // Load from API for Germany (the only country with real crawled data)
    if (country !== 'de') {
      set({ products: [], categories: [], error: 'No data available for this country' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (state.categoryFilter) {
        params.append('category', state.categoryFilter);
      }
      if (state.searchQuery) {
        params.append('search', state.searchQuery);
      }

      const url = `/api/products${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.statusText}`);
      }

      const data: ProductsAPIResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load products');
      }

      set({
        products: data.data.products,
        categories: data.data.categories,
        pipelines: samplePipelines, // German pipelines
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading products:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load products',
      });
    }
  },

  // Data helpers
  getCountryConfig: () => {
    const state = get();
    return countries.find(c => c.code === state.selectedCountry);
  },

  getFilteredProducts: () => {
    const state = get();
    let filtered = state.products;

    // Apply search filter (client-side for responsiveness)
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.modelNumber.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter (client-side for responsiveness)
    if (state.categoryFilter && state.categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === state.categoryFilter);
    }

    return filtered;
  },

  getProductPipeline: (productId) => {
    const state = get();
    return state.pipelines.find(p => p.productId === productId);
  },
}));
