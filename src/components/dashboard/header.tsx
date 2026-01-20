'use client';

import { motion } from 'framer-motion';
import {
  CaretRight,
  House,
  Globe,
  Package,
  Storefront,
  GitBranch,
  Bell,
  User,
  MagnifyingGlass,
  Sparkle,
} from '@phosphor-icons/react';
import { useDashboardStore } from '@/store/dashboard-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

export function Header() {
  const {
    currentView,
    selectedCountry,
    selectedProduct,
    selectedChannel,
    goToCountrySelection,
    goToProducts,
    goToChannels,
    goToContent,
    goToPipeline,
    getCountryConfig,
  } = useDashboardStore();

  const { t } = useTranslation();
  const countryConfig = getCountryConfig();

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      id: 'countries',
      label: t.sidebar.countries,
      icon: Globe,
      onClick: goToCountrySelection,
      active: currentView === 'countries',
    },
    ...(selectedCountry
      ? [
          {
            id: 'products',
            label: countryConfig?.name || selectedCountry.toUpperCase(),
            icon: Package,
            onClick: goToProducts,
            active: currentView === 'products',
            flag: countryConfig?.flag,
          },
        ]
      : []),
    ...(selectedProduct
      ? [
          {
            id: 'channels',
            label: selectedProduct.modelNumber,
            icon: Storefront,
            onClick: goToChannels,
            active: currentView === 'channels',
          },
        ]
      : []),
    ...(selectedChannel
      ? [
          {
            id: 'content',
            label: t.header.aiContent,
            icon: Sparkle,
            onClick: goToContent,
            active: currentView === 'content',
          },
          {
            id: 'pipeline',
            label: t.sidebar.pipeline,
            icon: GitBranch,
            onClick: goToPipeline,
            active: currentView === 'pipeline',
          },
        ]
      : []),
  ];

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1">
        <button
          onClick={goToCountrySelection}
          className="p-1.5 rounded-md hover:bg-secondary transition-colors"
        >
          <House className="w-4 h-4 text-muted-foreground" weight="duotone" />
        </button>

        {breadcrumbItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center">
              <CaretRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
              <button
                onClick={item.onClick}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors',
                  item.active
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                {'flag' in item && item.flag ? (
                  <span className="text-sm">{item.flag}</span>
                ) : (
                  <Icon className="w-4 h-4" weight={item.active ? 'fill' : 'regular'} />
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Search (placeholder) */}
        <div className="hidden lg:flex relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.header.search}
            className="w-64 pl-9 h-9"
            disabled
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
          >
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" weight="fill" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">Demo User</span>
                <span className="text-xs text-muted-foreground">demo@lg.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem disabled>Team Management</DropdownMenuItem>
            <DropdownMenuItem disabled>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
