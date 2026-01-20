'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MagnifyingGlass,
  Funnel,
  Television,
  SpeakerHigh,
  Package,
  ArrowRight,
  CheckCircle,
  Clock,
  Warning,
  Eye,
  Star,
} from '@phosphor-icons/react';
import { useDashboardStore } from '@/store/dashboard-store';
import { DashboardProduct } from '@/types/crawled-product';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductDetailModal } from './product-detail-modal';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// Category icon mapping
const categoryIcons: Record<string, typeof Television> = {
  oled: Television,
  'oled-evo': Television,
  qned: Television,
  'qned-evo': Television,
  nanocell: Television,
  '4k-uhd': Television,
  uhd: Television,
  'smart-tvs': Television,
  soundbar: SpeakerHigh,
  'tv-bundles': Package,
  'tv-zubehoer': Package,
};

export function ProductGrid() {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    selectProduct,
    getCountryConfig,
    pipelines,
    categories,
    isLoading,
    error,
    loadProducts,
    openDetailModal,
    closeDetailModal,
    detailModalOpen,
    selectedProduct,
    products: allProducts,
  } = useDashboardStore();

  const [previewProduct, setPreviewProduct] = useState<DashboardProduct | null>(null);
  const countryConfig = getCountryConfig();
  const { t } = useTranslation();

  // Compute filtered products reactively (within component for proper re-renders)
  const products = useMemo(() => {
    let filtered = allProducts;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.modelNumber.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    return filtered;
  }, [allProducts, searchQuery, categoryFilter]);

  // Load products on mount and when search/filter changes
  useEffect(() => {
    loadProducts();
  }, []);

  const getProductStatus = (productId: string) => {
    const pipeline = pipelines.find(p => p.productId === productId);
    if (!pipeline) return 'new';
    return pipeline.status;
  };

  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Package },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    in_progress: { label: 'Processing', color: 'bg-orange-100 text-orange-700', icon: Clock },
    completed: { label: 'Published', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: Warning },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const handlePreview = (product: DashboardProduct) => {
    setPreviewProduct(product);
    openDetailModal(product);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{countryConfig?.flag}</span>
          <div>
            <h1 className="text-2xl font-headline font-semibold text-foreground">
              {countryConfig?.name} - {t.productGrid.title}
            </h1>
            <p className="text-muted-foreground">
              {t.productGrid.selectProduct}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t.productGrid.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'gap-2',
              categoryFilter && 'bg-primary/10 border-primary'
            )}
            onClick={() => setCategoryFilter(null)}
          >
            <Funnel className="w-4 h-4" />
            {t.common.filter}
          </Button>
        </div>
      </div>

      {/* Category Pills from real data */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={categoryFilter === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setCategoryFilter(null)}
        >
          {t.common.all} ({products.length})
        </Badge>
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] || Package;
          return (
            <Badge
              key={category.id}
              variant={categoryFilter === category.id ? 'default' : 'outline'}
              className="cursor-pointer gap-1"
              onClick={() => setCategoryFilter(
                categoryFilter === category.id ? null : category.id
              )}
            >
              <Icon className="w-3 h-3" />
              {category.name}
              <span className="ml-1 text-xs opacity-70">{category.count}</span>
            </Badge>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t.productGrid.loadingProducts}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Warning className="w-12 h-12 text-destructive" />
            <p className="text-lg font-medium text-destructive">{t.common.error}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => loadProducts()}>{t.common.retry}</Button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !error && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-auto"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              status={getProductStatus(product.id)}
              statusConfig={statusConfig}
              onClick={() => selectProduct(product)}
              onPreview={() => handlePreview(product)}
              t={t}
            />
          ))}

          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">{t.productGrid.noProducts}</p>
              <p className="text-sm">{t.common.noResults}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Results Summary */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <span>{products.length} products found</span>
        <span>
          {categories.length} categories loaded
        </span>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={previewProduct}
        open={detailModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDetailModal();
            setPreviewProduct(null);
          }
        }}
      />
    </div>
  );
}

interface ProductCardProps {
  product: DashboardProduct;
  status: string;
  statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }>;
  onClick: () => void;
  onPreview: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}

function ProductCard({ product, status, statusConfig, onClick, onPreview, t }: ProductCardProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  const StatusIcon = config.icon;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="group relative p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={cn('px-2 py-1 text-xs rounded-full flex items-center gap-1', config.color)}>
          <StatusIcon className="w-3 h-3" weight="fill" />
          {config.label}
        </span>
      </div>

      {/* Preview Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
        title="Preview details"
      >
        <Eye className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Product Image */}
      <div className="w-full aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
        {product.mainImage ? (
          <Image
            src={product.mainImage.src}
            alt={product.mainImage.alt || product.title}
            fill
            className="object-contain p-2"
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground/30">
            <Package className="w-16 h-16" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1">{product.modelNumber}</p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
          {product.title}
        </h3>

        {/* Category & Energy */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {product.categoryName}
          </Badge>
          {product.energyClass && (
            <Badge className="text-xs bg-green-600 hover:bg-green-600">
              {product.energyClass}
            </Badge>
          )}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" weight="fill" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">
            {product.price}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onClick}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
      >
        <span>{t.contentEditor.generate}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
