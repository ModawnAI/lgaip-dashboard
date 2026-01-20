'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboardStore } from '@/store/dashboard-store';
import { DashboardProduct } from '@/types/crawled-product';
import {
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  Tag,
  FileText,
  ImageIcon,
  ListChecks,
  HelpCircle,
  Info,
  Database,
  Copy,
  Check,
  Calendar,
  Globe,
  Tv,
  DollarSign,
  Battery,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductDetailModalProps {
  product: DashboardProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
}: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const selectProduct = useDashboardStore((state) => state.selectProduct);
  const { t } = useTranslation();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCurrentImageIndex(0);
      setActiveTab('overview');
    }
  }, [open]);

  if (!product) return null;

  const allImages = product.mainImage
    ? [product.mainImage, ...product.galleryImages]
    : product.galleryImages;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelectProduct = () => {
    selectProduct(product);
    onOpenChange(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const rawData = product.rawData;
  const specs = rawData?.specifications || {};
  const features = rawData?.features || [];
  const faq = rawData?.faq || [];
  const metadata = rawData?.metadata;

  const groupedSpecs = groupSpecifications(specs);

  const tabs = [
    { id: 'overview', label: t.productDetail.overview, icon: Info },
    { id: 'specs', label: `${t.productDetail.specs} (${Object.keys(specs).length})`, icon: ListChecks },
    { id: 'features', label: `${t.productDetail.features} (${features.length})`, icon: Zap },
    ...(faq.length > 0 ? [{ id: 'faq', label: `${t.productDetail.faq} (${faq.length})`, icon: HelpCircle }] : []),
    { id: 'metadata', label: t.productDetail.metadata, icon: Database },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="bg-background rounded-xl shadow-2xl border w-full h-full max-w-[1600px] max-h-[900px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b bg-muted/30 flex items-start justify-between gap-4 shrink-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="font-medium">
                      {product.categoryName}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {product.modelNumber}
                    </Badge>
                    {product.energyClass && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <Battery className="h-3 w-3 mr-1" />
                        {product.energyClass}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-bold leading-tight line-clamp-1">
                    {product.title}
                  </h2>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {product.price}
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating.toFixed(1)}</span>
                        <span>({product.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Image Gallery */}
                <div className="w-80 shrink-0 border-r bg-muted/20 p-4 flex flex-col">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
                    <AnimatePresence mode="wait">
                      {allImages.length > 0 ? (
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={allImages[currentImageIndex].src}
                            alt={allImages[currentImageIndex].alt || product.title}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-16 w-16" />
                        </div>
                      )}
                    </AnimatePresence>

                    {allImages.length > 1 && (
                      <>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {currentImageIndex + 1} / {allImages.length}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow h-8 w-8"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow h-8 w-8"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                      {allImages.slice(0, 8).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={cn(
                            'relative w-12 h-12 rounded border-2 overflow-hidden shrink-0 transition-all',
                            idx === currentImageIndex
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-muted-foreground/30'
                          )}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt || `Image ${idx + 1}`}
                            fill
                            className="object-contain bg-white"
                            unoptimized
                          />
                        </button>
                      ))}
                      {allImages.length > 8 && (
                        <div className="w-12 h-12 rounded border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs shrink-0">
                          +{allImages.length - 8}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Source Link */}
                  <div className="mt-auto pt-4 border-t">
                    <a
                      href={product.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t.productDetail.viewOnLg}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.productDetail.crawled}: {new Date(product.crawledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right: Tabs & Content */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Tabs */}
                  <div className="flex gap-1 p-2 border-b bg-muted/10 shrink-0">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            activeTab === tab.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <ScrollArea className="flex-1">
                    <div className="p-6">
                      {/* Overview Tab */}
                      {activeTab === 'overview' && (
                        <div className="grid grid-cols-3 gap-6">
                          {/* Column 1: Product Details */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-primary border-b pb-2">{t.productDetail.productDetails}</h3>
                            <div className="space-y-2">
                              <InfoCard label={t.productDetail.brand} value={rawData?.basicInfo?.brand || 'LG'} />
                              <InfoCard label={t.productDetail.modelNumber} value={product.modelNumber} />
                              <InfoCard label={t.productDetail.category} value={product.categoryName} />
                              {rawData?.basicInfo?.series && (
                                <InfoCard label={t.productDetail.series} value={rawData.basicInfo.series} />
                              )}
                              {rawData?.basicInfo?.screenSize && (
                                <InfoCard label={t.productDetail.screenSize} value={rawData.basicInfo.screenSize} />
                              )}
                              {rawData?.basicInfo?.year && (
                                <InfoCard label={t.productDetail.year} value={String(rawData.basicInfo.year)} />
                              )}
                              <InfoCard label={t.productDetail.price} value={product.price} />
                              {product.rating > 0 && (
                                <InfoCard label={t.productDetail.rating} value={`${product.rating.toFixed(1)} / 5 (${product.reviewCount})`} />
                              )}
                              {product.energyClass && (
                                <InfoCard label={t.productDetail.energyClass} value={product.energyClass} />
                              )}
                            </div>
                          </div>

                          {/* Column 2: Description */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-primary border-b pb-2">{t.productDetail.description}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {product.description || t.productDetail.noDescription}
                            </p>
                            {rawData?.basicInfo?.headline && (
                              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium">{rawData.basicInfo.headline}</p>
                              </div>
                            )}
                          </div>

                          {/* Column 3: Key Specs Preview */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-primary border-b pb-2">{t.productDetail.keySpecifications}</h3>
                            <div className="space-y-1">
                              {Object.entries(specs).slice(0, 15).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm py-1 border-b border-muted/30">
                                  <span className="text-muted-foreground truncate max-w-[50%]">{key}</span>
                                  <span className="font-medium truncate max-w-[45%] text-right">{String(value)}</span>
                                </div>
                              ))}
                              {Object.keys(specs).length > 15 && (
                                <button
                                  onClick={() => setActiveTab('specs')}
                                  className="text-sm text-primary hover:underline mt-2"
                                >
                                  {t.productDetail.viewAllSpecs} ({Object.keys(specs).length}) →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Specs Tab */}
                      {activeTab === 'specs' && (
                        <div className="grid grid-cols-3 gap-6">
                          {Object.entries(groupedSpecs).map(([group, items]) => (
                            <div key={group} className="space-y-2">
                              <h3 className="font-semibold text-primary border-b pb-2">
                                {group} ({items.length})
                              </h3>
                              <div className="space-y-1">
                                {items.map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between text-sm py-1.5 px-2 rounded hover:bg-muted/50 group"
                                  >
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className="font-medium flex items-center gap-1">
                                      {String(value)}
                                      <button
                                        onClick={() => copyToClipboard(String(value), key)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        {copiedField === key ? (
                                          <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <Copy className="h-3 w-3 text-muted-foreground" />
                                        )}
                                      </button>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Features Tab */}
                      {activeTab === 'features' && (
                        <div className="grid grid-cols-3 gap-3">
                          {features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
                            >
                              <Tag className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* FAQ Tab */}
                      {activeTab === 'faq' && (
                        <div className="grid grid-cols-2 gap-4">
                          {faq.map((item, idx) => (
                            <div key={idx} className="border rounded-lg p-4 bg-muted/20">
                              <h4 className="font-medium text-sm mb-2 flex items-start gap-2">
                                <HelpCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                {item.question}
                              </h4>
                              <p className="text-sm text-muted-foreground pl-6">
                                {item.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metadata Tab */}
                      {activeTab === 'metadata' && (
                        <div className="grid grid-cols-3 gap-6">
                          {/* SEO Metadata */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-primary border-b pb-2">{t.productDetail.seoMetadata}</h3>
                            {metadata && (
                              <div className="space-y-2">
                                <CopyableField
                                  label={t.productDetail.title}
                                  value={metadata.title}
                                  onCopy={() => copyToClipboard(metadata.title, 'title')}
                                  copied={copiedField === 'title'}
                                />
                                <CopyableField
                                  label={t.productDetail.description}
                                  value={metadata.description}
                                  onCopy={() => copyToClipboard(metadata.description, 'desc')}
                                  copied={copiedField === 'desc'}
                                />
                                <CopyableField
                                  label="MPN"
                                  value={metadata.mpn}
                                  onCopy={() => copyToClipboard(metadata.mpn, 'mpn')}
                                  copied={copiedField === 'mpn'}
                                />
                                <CopyableField
                                  label={t.productDetail.canonical}
                                  value={metadata.canonical}
                                  onCopy={() => copyToClipboard(metadata.canonical, 'canonical')}
                                  copied={copiedField === 'canonical'}
                                />
                              </div>
                            )}
                          </div>

                          {/* Energy & Pricing */}
                          <div className="space-y-6">
                            {rawData?.energyEfficiency && (
                              <div className="space-y-3">
                                <h3 className="font-semibold text-primary border-b pb-2">{t.productDetail.energyEfficiency}</h3>
                                <div className="space-y-2">
                                  <InfoCard label={t.productDetail.category} value={rawData.energyEfficiency.category} />
                                  <InfoCard label={t.productDetail.scale} value={`${rawData.energyEfficiency.scaleMin} - ${rawData.energyEfficiency.scaleMax}`} />
                                  {rawData.energyEfficiency.eprelCertificationId && (
                                    <InfoCard label={t.productDetail.eprelId} value={rawData.energyEfficiency.eprelCertificationId} />
                                  )}
                                </div>
                              </div>
                            )}
                            {rawData?.pricing && (
                              <div className="space-y-3">
                                <h3 className="font-semibold text-primary border-b pb-2">{t.productDetail.pricing}</h3>
                                <div className="space-y-2">
                                  <InfoCard label={t.productDetail.currentPrice} value={rawData.pricing.currentPrice} />
                                  <InfoCard label={t.productDetail.currency} value={rawData.pricing.currency} />
                                  {rawData.pricing.originalPrice && (
                                    <InfoCard label={t.productDetail.originalPrice} value={rawData.pricing.originalPrice} />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Raw JSON */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <h3 className="font-semibold text-primary">{t.productDetail.rawData}</h3>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(rawData, null, 2), 'json')}
                              >
                                {copiedField === 'json' ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1 text-green-600" />
                                    {t.contentEditor.copied}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    {t.productDetail.copyAll}
                                  </>
                                )}
                              </Button>
                            </div>
                            <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-auto max-h-80 font-mono">
                              {JSON.stringify(
                                {
                                  modelNumber: product.modelNumber,
                                  category: product.category,
                                  url: product.sourceUrl,
                                  basicInfo: rawData?.basicInfo,
                                  pricing: rawData?.pricing,
                                  ratings: rawData?.ratings,
                                  energyEfficiency: rawData?.energyEfficiency,
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/20 flex items-center justify-between shrink-0">
                <div className="text-sm text-muted-foreground flex items-center gap-6">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    {allImages.length} {t.productDetail.images}
                  </span>
                  <span className="flex items-center gap-1">
                    <ListChecks className="h-4 w-4" />
                    {Object.keys(specs).length} {t.productDetail.specs}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {features.length} {t.productDetail.features}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {t.productDetail.close}
                  </Button>
                  <Button onClick={handleSelectProduct}>
                    {t.productDetail.selectForGeneration}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 px-2 bg-muted/30 rounded text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CopyableField({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-start gap-2 bg-muted/30 rounded p-2 text-sm">
        <span className="flex-1 break-all">{value}</span>
        <button onClick={onCopy} className="shrink-0 hover:text-primary">
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

function groupSpecifications(
  specs: Record<string, string>
): Record<string, [string, string][]> {
  const groups: Record<string, [string, string][]> = {};
  const entries = Object.entries(specs);

  const categoryPatterns: Record<string, string[]> = {
    Display: ['display', 'bildschirm', 'auflösung', 'panel', 'screen', 'resolution'],
    Audio: ['audio', 'sound', 'lautsprecher', 'speaker', 'dolby', 'watt'],
    Connectivity: ['hdmi', 'usb', 'bluetooth', 'wifi', 'lan', 'anschluss', 'port', 'tuner'],
    Dimensions: ['maße', 'dimension', 'gewicht', 'weight', 'breite', 'höhe', 'tiefe', 'größe'],
    'Power & Energy': ['energie', 'energy', 'strom', 'power', 'verbrauch', 'standby'],
    'Smart Features': ['smart', 'ai', 'webos', 'app', 'streaming', 'voice', 'google', 'alexa'],
  };

  for (const [key, value] of entries) {
    const keyLower = key.toLowerCase();
    let assigned = false;

    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some((p) => keyLower.includes(p))) {
        if (!groups[category]) groups[category] = [];
        groups[category].push([key, value]);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      if (!groups['Other']) groups['Other'] = [];
      groups['Other'].push([key, value]);
    }
  }

  return groups;
}
