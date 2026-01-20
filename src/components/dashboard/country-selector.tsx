'use client';

import { motion } from 'framer-motion';
import { Globe, CheckCircle, Circle, ArrowRight } from '@phosphor-icons/react';
import { countries } from '@/data/sample-products';
import { useDashboardStore } from '@/store/dashboard-store';
import { cn } from '@/lib/utils';

export function CountrySelector() {
  const selectCountry = useDashboardStore((state) => state.selectCountry);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-6 h-6 text-primary" weight="duotone" />
          </div>
          <h1 className="text-2xl font-headline font-semibold text-foreground">
            Select Country
          </h1>
        </div>
        <p className="text-muted-foreground">
          Choose a country to manage product content for local 3P marketplaces
        </p>
      </div>

      {/* Country Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {countries.map((country) => (
          <motion.button
            key={country.code}
            variants={item}
            onClick={() => country.enabled && selectCountry(country.code)}
            disabled={!country.enabled}
            className={cn(
              'group relative p-6 rounded-xl border-2 text-left transition-all duration-200',
              country.enabled
                ? 'border-border hover:border-primary hover:shadow-lg bg-card cursor-pointer'
                : 'border-border/50 bg-muted/30 cursor-not-allowed opacity-60'
            )}
          >
            {/* Status indicator */}
            <div className="absolute top-4 right-4">
              {country.enabled ? (
                <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" weight="regular" />
              )}
            </div>

            {/* Flag and name */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{country.flag}</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {country.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {country.language}
                </p>
              </div>
            </div>

            {/* Platforms */}
            <div className="flex flex-wrap gap-2 mb-4">
              {country.platforms.slice(0, 4).map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md capitalize"
                >
                  {platform}
                </span>
              ))}
              {country.platforms.length > 4 && (
                <span className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
                  +{country.platforms.length - 4} more
                </span>
              )}
            </div>

            {/* CTA */}
            {country.enabled && (
              <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Manage Products</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            )}

            {!country.enabled && (
              <div className="text-sm text-muted-foreground">
                Coming Soon
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="mt-auto pt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-2xl font-semibold text-foreground">
            {countries.filter(c => c.enabled).length}
          </p>
          <p className="text-sm text-muted-foreground">Active Countries</p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-2xl font-semibold text-foreground">
            {new Set(countries.flatMap(c => c.platforms)).size}
          </p>
          <p className="text-sm text-muted-foreground">Platforms</p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-2xl font-semibold text-foreground">218</p>
          <p className="text-sm text-muted-foreground">Total Products</p>
        </div>
      </div>
    </div>
  );
}
