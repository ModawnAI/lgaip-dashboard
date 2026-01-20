'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Storefront,
  Buildings,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  Tag,
  Package,
} from '@phosphor-icons/react';
import { useDashboardStore } from '@/store/dashboard-store';
import { platformConfigs } from '@/data/sample-products';
import { Channel, Platform } from '@/types/product';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/icons/platform-icons';
import { useTranslation } from '@/hooks/useTranslation';

export function ChannelSelector() {
  const {
    selectedProduct,
    selectedChannel,
    selectedPlatforms,
    selectChannel,
    togglePlatform,
    goToPipeline,
    getCountryConfig,
  } = useDashboardStore();
  const { t } = useTranslation();

  const countryConfig = getCountryConfig();

  const channels: { id: Channel; name: string; description: string; icon: typeof Storefront; features: string[] }[] = [
    {
      id: '3p',
      name: t.channelSelector.thirdPartyChannel,
      description: t.channelSelector.thirdPartyDescription,
      icon: ShoppingCart,
      features: [
        'Platform-specific image formatting',
        'SEO-optimized titles & descriptions',
        'Marketplace compliance checks',
        'Automated A+ content generation',
      ],
    },
    {
      id: 'd2c',
      name: t.channelSelector.d2cChannel,
      description: t.channelSelector.d2cDescription,
      icon: Buildings,
      features: [
        'Brand-aligned content templates',
        'Rich media asset optimization',
        'Cross-sell recommendations',
        'Consistent brand messaging',
      ],
    },
  ];

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {/* Product Preview */}
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden relative">
            {selectedProduct?.mainImage ? (
              <Image
                src={selectedProduct.mainImage.src}
                alt={selectedProduct.mainImage.alt || selectedProduct.title}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <Package className="w-10 h-10 text-muted-foreground/50" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{selectedProduct?.modelNumber}</p>
            <h1 className="text-xl font-headline font-semibold text-foreground">
              {selectedProduct?.title}
            </h1>
            <Badge variant="secondary" className="mt-1">
              {selectedProduct?.categoryName}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">
          {t.channelSelector.subtitle}
        </p>
      </div>

      {/* Channel Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const isSelected = selectedChannel === channel.id;

          return (
            <motion.button
              key={channel.id}
              variants={item}
              initial="hidden"
              animate="show"
              onClick={() => selectChannel(channel.id)}
              className={cn(
                'group relative p-6 rounded-xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 bg-card'
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-primary" weight="fill" />
                </div>
              )}

              {/* Icon and title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  'p-3 rounded-lg transition-colors',
                  isSelected ? 'bg-primary/10' : 'bg-secondary'
                )}>
                  <Icon className={cn(
                    'w-6 h-6',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )} weight="duotone" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {channel.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {channel.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className={cn(
                      'w-4 h-4',
                      isSelected ? 'text-primary' : 'text-muted-foreground/50'
                    )} weight="fill" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* Platform Selection (only for 3P) */}
      {selectedChannel === '3p' && countryConfig && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/30 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t.channelSelector.selectPlatforms}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t.pipeline.targetPlatforms}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {countryConfig.platforms.map((platform) => {
              const config = platformConfigs[platform as keyof typeof platformConfigs];
              const isSelected = selectedPlatforms.includes(platform);

              return (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-card'
                  )}
                >
                  <PlatformIcon platform={platform} size={40} />
                  <span className="text-sm font-medium capitalize">
                    {config?.name || platform}
                  </span>
                  <Checkbox
                    checked={isSelected}
                    className="mt-1"
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedPlatforms.length}/{countryConfig.platforms.length} {t.channelSelector.platformsSelected}
            </span>
            <button
              onClick={() => {
                if (selectedPlatforms.length === countryConfig.platforms.length) {
                  selectedPlatforms.forEach(p => togglePlatform(p));
                } else {
                  countryConfig.platforms.forEach(p => {
                    if (!selectedPlatforms.includes(p)) {
                      togglePlatform(p);
                    }
                  });
                }
              }}
              className="text-primary hover:underline"
            >
              {selectedPlatforms.length === countryConfig.platforms.length
                ? t.common.none
                : t.common.all}
            </button>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      {selectedChannel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto pt-6 border-t border-border"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto gap-2"
            onClick={goToPipeline}
            disabled={selectedChannel === '3p' && selectedPlatforms.length === 0}
          >
            {t.channelSelector.continue}
            <ArrowRight className="w-5 h-5" />
          </Button>
          {selectedChannel === '3p' && selectedPlatforms.length === 0 && (
            <p className="text-sm text-destructive mt-2">
              {t.channelSelector.selectPlatforms}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
