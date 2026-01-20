'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkle,
  ArrowRight,
  CheckCircle,
  Spinner,
  Copy,
  Eye,
  Robot,
  Warning,
  FloppyDisk,
  ArrowClockwise,
  DownloadSimple,
  Code,
  Image as ImageIcon,
  DeviceMobile,
  Desktop,
  X,
  Play,
  CheckSquare,
  Lightning,
  Clock,
  Stack,
  Rows,
  ListBullets,
  Table,
  ShieldCheck,
  Star,
  CaretDown,
  CaretUp,
  Pause,
} from '@phosphor-icons/react';
import { useDashboardStore } from '@/store/dashboard-store';
import { platformConfigs } from '@/data/sample-products';
import { Platform } from '@/types/product';
import { cn } from '@/lib/utils';
import { PlatformIcon } from '@/components/icons/platform-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';
type SectionStatus = 'idle' | 'generating' | 'complete' | 'error';
type PreviewMode = 'desktop' | 'mobile';

interface GeneratedContent {
  heroSection: string;
  featuresSection: string;
  specificationsSection: string;
  benefitsSection: string;
  warrantySection: string;
  gallerySection: string;
  fullTemplate: string;
}

type SectionKey = 'hero' | 'gallery' | 'features' | 'specifications' | 'benefits' | 'warranty';

const SECTIONS: { key: SectionKey; icon: typeof Stack; label: string; labelDe: string; labelTh: string; labelEs: string }[] = [
  { key: 'hero', icon: ImageIcon, label: 'Hero Section', labelDe: 'Hero-Bereich', labelTh: 'ส่วนหลัก', labelEs: 'Sección Hero' },
  { key: 'gallery', icon: Rows, label: 'Image Gallery', labelDe: 'Bildergalerie', labelTh: 'แกลเลอรี่รูปภาพ', labelEs: 'Galería' },
  { key: 'features', icon: ListBullets, label: 'Key Features', labelDe: 'Hauptmerkmale', labelTh: 'คุณสมบัติเด่น', labelEs: 'Características' },
  { key: 'specifications', icon: Table, label: 'Specifications', labelDe: 'Technische Daten', labelTh: 'ข้อมูลจำเพาะ', labelEs: 'Especificaciones' },
  { key: 'benefits', icon: Star, label: 'Benefits', labelDe: 'Ihre Vorteile', labelTh: 'ข้อดี', labelEs: 'Beneficios' },
  { key: 'warranty', icon: ShieldCheck, label: 'Warranty', labelDe: 'Garantie', labelTh: 'การรับประกัน', labelEs: 'Garantía' },
];

interface SectionState {
  status: SectionStatus;
  html: string;
  enabled: boolean;
}

type PlatformSectionState = Record<SectionKey, SectionState>;

const defaultSectionState: PlatformSectionState = {
  hero: { status: 'idle', html: '', enabled: true },
  gallery: { status: 'idle', html: '', enabled: true },
  features: { status: 'idle', html: '', enabled: true },
  specifications: { status: 'idle', html: '', enabled: true },
  benefits: { status: 'idle', html: '', enabled: true },
  warranty: { status: 'idle', html: '', enabled: true },
};

export function ContentEditor() {
  const {
    selectedProduct,
    selectedPlatforms,
    goToPipeline,
  } = useDashboardStore();
  const { t, language } = useTranslation();

  // Per-platform, per-section state
  const [platformSections, setPlatformSections] = useState<Partial<Record<Platform, PlatformSectionState>>>({});
  const [generationStatus, setGenerationStatus] = useState<Partial<Record<Platform, GenerationStatus>>>({});
  const [currentGeneratingSection, setCurrentGeneratingSection] = useState<{ platform: Platform; section: SectionKey } | null>(null);
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);

  const [previewModal, setPreviewModal] = useState<{ open: boolean; platform: Platform | null; section?: SectionKey | null }>({
    open: false,
    platform: null,
    section: null,
  });
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<Platform | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize platform section state
  const initializePlatformState = useCallback((platform: Platform) => {
    if (!platformSections[platform]) {
      setPlatformSections(prev => ({
        ...prev,
        [platform]: { ...defaultSectionState },
      }));
    }
  }, [platformSections]);

  // Convert product to API format with full image data
  const getProductData = useCallback(() => {
    if (!selectedProduct) return null;
    return {
      title: selectedProduct.title,
      modelNumber: selectedProduct.modelNumber,
      categoryName: selectedProduct.categoryName,
      description: selectedProduct.description,
      mainImage: selectedProduct.mainImage || undefined,
      galleryImages: selectedProduct.galleryImages || [],
      price: selectedProduct.price,
      currency: selectedProduct.currency,
      rawData: selectedProduct.rawData,
    };
  }, [selectedProduct]);

  // Generate content for a single section using Gemini API
  const generateSingleSection = async (platform: Platform, section: SectionKey): Promise<string> => {
    const productData = getProductData();
    if (!productData) throw new Error('No product selected');

    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: productData,
        platform,
        section,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate ${section}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || `Failed to generate ${section}`);
    }

    return data.data.html;
  };

  // Generate a single section for a platform
  const regenerateSection = async (platform: Platform, section: SectionKey) => {
    initializePlatformState(platform);
    setCurrentGeneratingSection({ platform, section });

    setPlatformSections(prev => ({
      ...prev,
      [platform]: {
        ...(prev[platform] || defaultSectionState),
        [section]: { ...prev[platform]?.[section], status: 'generating' as SectionStatus },
      },
    }));

    try {
      const html = await generateSingleSection(platform, section);

      setPlatformSections(prev => ({
        ...prev,
        [platform]: {
          ...(prev[platform] || defaultSectionState),
          [section]: { status: 'complete' as SectionStatus, html, enabled: true },
        },
      }));

      // Check if all sections are complete
      const sections = platformSections[platform] || defaultSectionState;
      const allComplete = SECTIONS.every(s =>
        s.key === section ? true : sections[s.key]?.status === 'complete'
      );

      if (allComplete) {
        setGenerationStatus(prev => ({ ...prev, [platform]: 'complete' }));
      }
    } catch (error) {
      console.error(`Error generating ${section}:`, error);
      setPlatformSections(prev => ({
        ...prev,
        [platform]: {
          ...(prev[platform] || defaultSectionState),
          [section]: { ...prev[platform]?.[section], status: 'error' as SectionStatus, html: '' },
        },
      }));
    } finally {
      setCurrentGeneratingSection(null);
    }
  };

  // Generate all enabled sections for a platform
  const generateContentForPlatform = async (platform: Platform) => {
    const productData = getProductData();
    if (!productData) return;

    initializePlatformState(platform);
    setGenerationStatus(prev => ({ ...prev, [platform]: 'generating' }));

    try {
      const sections = platformSections[platform] || defaultSectionState;

      for (const sectionConfig of SECTIONS) {
        const section = sectionConfig.key;
        if (!sections[section]?.enabled) continue;

        setCurrentGeneratingSection({ platform, section });

        setPlatformSections(prev => ({
          ...prev,
          [platform]: {
            ...(prev[platform] || defaultSectionState),
            [section]: { ...prev[platform]?.[section], status: 'generating' as SectionStatus },
          },
        }));

        try {
          const html = await generateSingleSection(platform, section);

          setPlatformSections(prev => ({
            ...prev,
            [platform]: {
              ...(prev[platform] || defaultSectionState),
              [section]: { status: 'complete' as SectionStatus, html, enabled: true },
            },
          }));
        } catch (error) {
          console.error(`Error generating ${section}:`, error);
          setPlatformSections(prev => ({
            ...prev,
            [platform]: {
              ...(prev[platform] || defaultSectionState),
              [section]: { ...prev[platform]?.[section], status: 'error' as SectionStatus },
            },
          }));
        }
      }

      setGenerationStatus(prev => ({ ...prev, [platform]: 'complete' }));
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationStatus(prev => ({ ...prev, [platform]: 'error' }));
    } finally {
      setCurrentGeneratingSection(null);
    }
  };

  // Toggle section enabled state
  const toggleSectionEnabled = (platform: Platform, section: SectionKey) => {
    initializePlatformState(platform);
    setPlatformSections(prev => ({
      ...prev,
      [platform]: {
        ...(prev[platform] || defaultSectionState),
        [section]: {
          ...prev[platform]?.[section] || defaultSectionState[section],
          enabled: !prev[platform]?.[section]?.enabled,
        },
      },
    }));
  };

  // Generate content for all platforms
  const generateAllContent = async () => {
    for (const platform of selectedPlatforms) {
      if (generationStatus[platform] !== 'complete') {
        await generateContentForPlatform(platform);
      }
    }
  };

  // Get full template for a platform
  const getFullTemplate = useCallback((platform: Platform): string => {
    const sections = platformSections[platform];
    if (!sections) return '';

    const productData = getProductData();
    const htmlLang = language === 'th' ? 'th' : language === 'es' ? 'es' : 'de';

    return `
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productData?.title || 'Product'} - ${platform}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'LG EI Text', 'Helvetica Neue', Arial, sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'LG EI Headline', 'Helvetica Neue', Arial, sans-serif; }
  </style>
</head>
<body>
  ${sections.hero?.html || ''}
  ${sections.gallery?.html || ''}
  ${sections.features?.html || ''}
  ${sections.specifications?.html || ''}
  ${sections.benefits?.html || ''}
  ${sections.warranty?.html || ''}
</body>
</html>`;
  }, [platformSections, getProductData, language]);

  // Calculate progress
  const completedCount = selectedPlatforms.filter(p => generationStatus[p] === 'complete').length;
  const generatingCount = selectedPlatforms.filter(p => generationStatus[p] === 'generating').length;
  const progressPercent = (completedCount / selectedPlatforms.length) * 100;

  // Get section completion count for a platform
  const getSectionCompletionCount = (platform: Platform): number => {
    const sections = platformSections[platform];
    if (!sections) return 0;
    return SECTIONS.filter(s => sections[s.key]?.status === 'complete').length;
  };

  // Export to PNG
  const exportToPng = async () => {
    if (!previewRef.current || !previewModal.platform) return;

    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `${selectedProduct?.modelNumber || 'product'}-${previewModal.platform}-content.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy HTML to clipboard
  const copyToClipboard = (platform: Platform) => {
    const template = getFullTemplate(platform);
    if (template) {
      navigator.clipboard.writeText(template);
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    }
  };

  // Open preview modal
  const openPreview = (platform: Platform, section?: SectionKey) => {
    setPreviewModal({ open: true, platform, section });
  };

  const closePreview = () => {
    setPreviewModal({ open: false, platform: null, section: null });
    setShowCode(false);
  };

  // Get section label based on language
  const getSectionLabel = (section: typeof SECTIONS[number]): string => {
    if (language === 'de') return section.labelDe;
    if (language === 'th') return section.labelTh;
    if (language === 'es') return section.labelEs;
    return section.label;
  };

  // Get platform locale
  const getPlatformLocale = (platform: Platform): string => {
    const germanPlatforms = ['amazon', 'mediamarkt', 'saturn', 'otto', 'ebay', 'kaufland', 'galaxus'];
    const thaiPlatforms = ['shopee', 'lazada', 'tiktok'];
    const spanishPlatforms = ['mercadolibre'];
    if (germanPlatforms.includes(platform)) return 'de';
    if (thaiPlatforms.includes(platform)) return 'th';
    if (spanishPlatforms.includes(platform)) return 'es';
    return 'en';
  };

  const currentPlatformSections = previewModal.platform ? platformSections[previewModal.platform] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-[#A50034]/10 rounded-lg">
                <Sparkle className="w-6 h-6 text-[#A50034]" weight="duotone" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground font-headline">
                  {t.contentEditor.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t.contentEditor.generateHtmlFor} {selectedPlatforms.length} {t.contentEditor.platforms.toLowerCase()} • {SECTIONS.length} {language === 'de' ? 'Abschnitte' : language === 'th' ? 'ส่วน' : 'secciones'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={generateAllContent}
              disabled={generatingCount > 0 || completedCount === selectedPlatforms.length}
              className="gap-2"
            >
              <Robot className="w-4 h-4" />
              {t.contentEditor.generateAll}
            </Button>
            <Button
              onClick={goToPipeline}
              className="gap-2 bg-[#A50034] hover:bg-[#8a002c]"
              disabled={completedCount < selectedPlatforms.length}
            >
              {t.contentEditor.goToPipeline}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{completedCount}/{selectedPlatforms.length} {t.pipeline.completed.toLowerCase()}</span>
              </div>
              {currentGeneratingSection && (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4 animate-spin text-[#A50034]" />
                  <span className="text-sm text-muted-foreground">
                    {SECTIONS.find(s => s.key === currentGeneratingSection.section)?.label || currentGeneratingSection.section}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 [&>div]:bg-[#A50034]" />
        </div>
      </div>

      {/* Product Info Banner */}
      {selectedProduct && (
        <div className="mb-6 bg-gradient-to-r from-[#A50034]/5 to-[#A50034]/10 rounded-xl p-4 flex items-center gap-4 border border-[#A50034]/20">
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
            {selectedProduct.mainImage ? (
              <img
                src={selectedProduct.mainImage.src}
                alt={selectedProduct.title}
                className="object-contain w-full h-full"
              />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="text-xs bg-[#A50034] hover:bg-[#A50034]">
                {selectedProduct.modelNumber}
              </Badge>
              <Badge variant="outline" className="text-xs border-[#A50034]/30 text-[#A50034]">
                {selectedProduct.categoryName}
              </Badge>
              {selectedProduct.galleryImages && selectedProduct.galleryImages.length > 0 && (
                <Badge variant="outline" className="text-xs gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {selectedProduct.galleryImages.length + 1} {language === 'de' ? 'Bilder' : language === 'th' ? 'รูปภาพ' : 'imágenes'}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg font-headline">
              {selectedProduct.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{selectedProduct.description}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-muted-foreground mb-1">Source</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#A50034] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">LG</span>
              </div>
              <p className="text-sm font-medium">LG {language === 'de' ? 'Deutschland' : language === 'th' ? 'ประเทศไทย' : 'México'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Platform Cards with Per-Section Controls */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {selectedPlatforms.map((platform) => {
            const config = platformConfigs[platform as keyof typeof platformConfigs];
            const status = generationStatus[platform] || 'idle';
            const isComplete = status === 'complete';
            const isGenerating = status === 'generating';
            const isExpanded = expandedPlatform === platform;
            const sections = platformSections[platform] || defaultSectionState;
            const completedSections = getSectionCompletionCount(platform);

            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'bg-card rounded-xl border-2 overflow-hidden transition-all',
                  isComplete ? 'border-green-500/50' : 'border-border',
                  isGenerating && 'border-[#A50034]/50'
                )}
              >
                {/* Platform Header - Clickable to expand */}
                <Collapsible open={isExpanded} onOpenChange={() => setExpandedPlatform(isExpanded ? null : platform)}>
                  <CollapsibleTrigger asChild>
                    <div
                      className="p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
                      style={{ backgroundColor: `${config?.color}08` }}
                    >
                      <PlatformIcon platform={platform} size={48} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{config?.name || platform}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getPlatformLocale(platform) === 'de' ? 'Deutsch' :
                             getPlatformLocale(platform) === 'th' ? 'ไทย' :
                             getPlatformLocale(platform) === 'es' ? 'Español' : 'English'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Stack className="w-3 h-3" />
                            {completedSections}/{SECTIONS.length} {language === 'de' ? 'Abschnitte' : language === 'th' ? 'ส่วน' : 'secciones'}
                          </div>
                          {isGenerating && currentGeneratingSection?.platform === platform && (
                            <Badge className="text-xs bg-[#A50034]/10 text-[#A50034] gap-1">
                              <Spinner className="w-3 h-3 animate-spin" />
                              {SECTIONS.find(s => s.key === currentGeneratingSection.section)?.label}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        {isComplete && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); openPreview(platform); }}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              {t.contentEditor.preview}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(platform); }}
                              className="gap-1"
                            >
                              {copiedPlatform === platform ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        )}

                        {status === 'idle' && (
                          <Button
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); generateContentForPlatform(platform); }}
                            className="gap-2 bg-[#A50034] hover:bg-[#8a002c]"
                          >
                            <Play className="w-4 h-4" />
                            {t.contentEditor.generate}
                          </Button>
                        )}

                        {isGenerating && (
                          <div className="flex items-center gap-2">
                            <Spinner className="w-5 h-5 animate-spin text-[#A50034]" />
                            <span className="text-sm text-muted-foreground">{t.contentEditor.generating}</span>
                          </div>
                        )}

                        {isComplete && (
                          <CheckCircle className="w-6 h-6 text-green-500" weight="fill" />
                        )}

                        {status === 'error' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); generateContentForPlatform(platform); }}
                            className="gap-2"
                          >
                            <ArrowClockwise className="w-4 h-4" />
                            {t.contentEditor.tryAgain}
                          </Button>
                        )}

                        {isExpanded ? (
                          <CaretUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <CaretDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  {/* Expanded Section Controls */}
                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {/* Section Grid */}
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {SECTIONS.map((sectionConfig) => {
                          const section = sectionConfig.key;
                          const sectionState = sections[section] || defaultSectionState[section];
                          const Icon = sectionConfig.icon;
                          const isCurrentlyGenerating = currentGeneratingSection?.platform === platform && currentGeneratingSection?.section === section;

                          return (
                            <div
                              key={section}
                              className={cn(
                                'relative p-4 rounded-lg border-2 transition-all',
                                sectionState.status === 'complete' ? 'border-green-500/50 bg-green-500/5' :
                                sectionState.status === 'generating' ? 'border-[#A50034]/50 bg-[#A50034]/5' :
                                sectionState.status === 'error' ? 'border-red-500/50 bg-red-500/5' :
                                'border-border bg-background',
                                !sectionState.enabled && 'opacity-50'
                              )}
                            >
                              {/* Section Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className={cn(
                                  'p-2 rounded-lg',
                                  sectionState.status === 'complete' ? 'bg-green-500/10' :
                                  sectionState.status === 'generating' ? 'bg-[#A50034]/10' :
                                  'bg-secondary'
                                )}>
                                  {isCurrentlyGenerating ? (
                                    <Spinner className="w-5 h-5 animate-spin text-[#A50034]" />
                                  ) : (
                                    <Icon className={cn(
                                      'w-5 h-5',
                                      sectionState.status === 'complete' ? 'text-green-500' :
                                      sectionState.status === 'error' ? 'text-red-500' :
                                      'text-muted-foreground'
                                    )} />
                                  )}
                                </div>

                                {sectionState.status === 'complete' && (
                                  <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
                                )}
                                {sectionState.status === 'error' && (
                                  <Warning className="w-4 h-4 text-red-500" />
                                )}
                              </div>

                              {/* Section Name */}
                              <h4 className="font-medium text-sm mb-2">{getSectionLabel(sectionConfig)}</h4>

                              {/* Section Actions */}
                              <div className="flex items-center gap-2">
                                {sectionState.status === 'complete' ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => openPreview(platform, section)}
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      {t.contentEditor.preview}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => regenerateSection(platform, section)}
                                      disabled={isGenerating}
                                    >
                                      <ArrowClockwise className="w-3 h-3" />
                                    </Button>
                                  </>
                                ) : sectionState.status === 'error' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-red-500"
                                    onClick={() => regenerateSection(platform, section)}
                                    disabled={isGenerating}
                                  >
                                    <ArrowClockwise className="w-3 h-3 mr-1" />
                                    Retry
                                  </Button>
                                ) : sectionState.status === 'generating' ? (
                                  <span className="text-xs text-muted-foreground">{t.contentEditor.generating}</span>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => regenerateSection(platform, section)}
                                    disabled={isGenerating}
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    {t.contentEditor.generate}
                                  </Button>
                                )}
                              </div>

                              {/* Enable/Disable Toggle */}
                              <button
                                className={cn(
                                  'absolute top-2 right-2 w-5 h-5 rounded border flex items-center justify-center transition-colors',
                                  sectionState.enabled ? 'bg-[#A50034] border-[#A50034] text-white' : 'border-muted-foreground'
                                )}
                                onClick={() => toggleSectionEnabled(platform, section)}
                              >
                                {sectionState.enabled && <CheckCircle className="w-3 h-3" weight="bold" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mini Preview if complete */}
                      {isComplete && (
                        <div className="px-4 pb-4">
                          <div
                            className="bg-white rounded-lg h-32 overflow-hidden relative cursor-pointer group border"
                            onClick={() => openPreview(platform)}
                          >
                            <div
                              className="transform scale-[0.1] origin-top-left w-[1000px] pointer-events-none"
                              dangerouslySetInnerHTML={{ __html: sections.hero?.html || '' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                              <Badge className="text-sm bg-[#A50034] hover:bg-[#A50034]">
                                <Eye className="w-4 h-4 mr-2" />
                                {t.contentEditor.preview} {language === 'de' ? 'Vollansicht' : language === 'th' ? 'เต็มหน้าจอ' : 'completo'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {previewModal.open && previewModal.platform && currentPlatformSections && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                  <PlatformIcon platform={previewModal.platform} size={40} />
                  <div>
                    <h2 className="font-semibold text-lg">
                      {platformConfigs[previewModal.platform as keyof typeof platformConfigs]?.name || previewModal.platform} - {t.contentEditor.preview}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct?.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Preview Mode Toggle */}
                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2',
                        previewMode === 'desktop' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                      )}
                    >
                      <Desktop className="w-4 h-4" />
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2',
                        previewMode === 'mobile' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                      )}
                    >
                      <DeviceMobile className="w-4 h-4" />
                      Mobile
                    </button>
                  </div>

                  {/* Code Toggle */}
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2',
                      showCode ? 'bg-[#A50034] text-white' : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <Code className="w-4 h-4" />
                    HTML
                  </button>

                  {/* Close Button */}
                  <Button variant="ghost" size="icon" onClick={closePreview}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto bg-[#f5f5f5]">
                {showCode ? (
                  <div className="h-full bg-[#1e1e1e] overflow-auto">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d] sticky top-0">
                      <span className="text-sm text-gray-400">
                        {previewModal.platform}-content.html
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(previewModal.platform!)}
                        className="h-7 text-xs text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {t.contentEditor.copyContent}
                      </Button>
                    </div>
                    <pre className="p-4 text-sm text-gray-300 overflow-auto">
                      <code>{getFullTemplate(previewModal.platform)}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="p-6 flex justify-center">
                    <div
                      ref={previewRef}
                      className={cn(
                        'bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300',
                        previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[900px]'
                      )}
                    >
                      {/* Rendered HTML Content - Section by Section */}
                      {previewModal.section ? (
                        <div dangerouslySetInnerHTML={{ __html: currentPlatformSections[previewModal.section]?.html || '' }} />
                      ) : (
                        <>
                          <div dangerouslySetInnerHTML={{ __html: currentPlatformSections.hero?.html || '' }} />
                          <div dangerouslySetInnerHTML={{ __html: currentPlatformSections.gallery?.html || '' }} />
                          <div dangerouslySetInnerHTML={{ __html: currentPlatformSections.features?.html || '' }} />
                          <div dangerouslySetInnerHTML={{ __html: currentPlatformSections.specifications?.html || '' }} />
                          <div dangerouslySetInnerHTML={{ __html: currentPlatformSections.benefits?.html || '' }} />
                          <div dangerouslySetInnerHTML={{ __html: currentPlatformSections.warranty?.html || '' }} />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 border-t bg-background">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {getSectionCompletionCount(previewModal.platform)}/{SECTIONS.length} {language === 'de' ? 'Abschnitte' : language === 'th' ? 'ส่วน' : 'secciones'}
                  </div>
                  <Badge variant="outline">
                    {getPlatformLocale(previewModal.platform) === 'de' ? 'Deutsch' :
                     getPlatformLocale(previewModal.platform) === 'th' ? 'ไทย' :
                     getPlatformLocale(previewModal.platform) === 'es' ? 'Español' : 'English'}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Lightning className="w-3 h-3" />
                    Gemini 3 Flash
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => generateContentForPlatform(previewModal.platform!)}
                    className="gap-2"
                  >
                    <ArrowClockwise className="w-4 h-4" />
                    {t.contentEditor.regenerate}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(previewModal.platform!)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {t.contentEditor.copyContent}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportToPng}
                    disabled={isExporting}
                    className="gap-2"
                  >
                    {isExporting ? (
                      <Spinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <DownloadSimple className="w-4 h-4" />
                    )}
                    PNG
                  </Button>
                  <Button className="gap-2 bg-[#A50034] hover:bg-[#8a002c]">
                    <FloppyDisk className="w-4 h-4" />
                    {t.contentEditor.save}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
