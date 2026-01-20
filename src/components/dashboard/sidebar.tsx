'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  House,
  Globe,
  Package,
  Storefront,
  GitBranch,
  ChartBar,
  Gear,
  CaretLeft,
  CaretRight,
  ArrowSquareOut,
  Sparkle,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useDashboardStore, DashboardView } from '@/store/dashboard-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface NavItem {
  id: DashboardView | 'overview' | 'analytics' | 'compliance' | 'settings';
  label: string;
  icon: typeof House;
  disabled?: boolean;
}

function getNavItems(t: ReturnType<typeof useTranslation>['t']): NavItem[] {
  return [
    { id: 'countries', label: t.sidebar.countries, icon: Globe },
    { id: 'products', label: t.sidebar.products, icon: Package },
    { id: 'channels', label: t.sidebar.channels, icon: Storefront },
    { id: 'content', label: t.sidebar.aiContent, icon: Sparkle },
    { id: 'pipeline', label: t.sidebar.pipeline, icon: GitBranch },
  ];
}

function getSecondaryNavItems(t: ReturnType<typeof useTranslation>['t']): NavItem[] {
  return [
    { id: 'analytics', label: t.sidebar.analytics, icon: ChartBar, disabled: false },
    { id: 'compliance', label: t.sidebar.compliance, icon: ShieldCheck, disabled: false },
    { id: 'settings', label: t.sidebar.settings, icon: Gear, disabled: true },
  ];
}

export function Sidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    currentView,
    setCurrentView,
    selectedCountry,
    selectedProduct,
    selectedChannel,
  } = useDashboardStore();

  const { t } = useTranslation();
  const navItems = getNavItems(t);
  const secondaryNavItems = getSecondaryNavItems(t);

  const getNavItemState = (item: NavItem): 'active' | 'available' | 'locked' => {
    if (currentView === item.id) return 'active';

    switch (item.id) {
      case 'countries':
        return 'available';
      case 'products':
        return selectedCountry ? 'available' : 'locked';
      case 'channels':
        return selectedProduct ? 'available' : 'locked';
      case 'content':
        return selectedChannel ? 'available' : 'locked';
      case 'pipeline':
        return selectedChannel ? 'available' : 'locked';
      default:
        return 'locked';
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (item.disabled) return;

    const state = getNavItemState(item);
    if (state !== 'locked') {
      setCurrentView(item.id as DashboardView);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 72 }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Image
            src="/lg-logo.png"
            alt="LG Logo"
            width={40}
            height={40}
            className="flex-shrink-0"
          />
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-headline font-semibold text-foreground text-sm">
                LGAIP
              </span>
              <span className="text-xs text-muted-foreground">
                Asset Intelligence
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const state = getNavItemState(item);
            const isActive = state === 'active';
            const isLocked = state === 'locked';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                disabled={isLocked}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive && 'bg-primary/10 text-primary',
                  !isActive && !isLocked && 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
                  isLocked && 'text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive && 'text-primary'
                  )}
                  weight={isActive ? 'fill' : 'regular'}
                />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-sidebar-border" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => !item.disabled && setCurrentView(item.id as DashboardView)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  item.disabled && 'text-muted-foreground/40 cursor-not-allowed',
                  !item.disabled && isActive && 'bg-primary/10 text-primary',
                  !item.disabled && !isActive && 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                )}
              >
                <Icon
                  className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')}
                  weight={isActive ? 'fill' : 'regular'}
                />
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.disabled && (
                      <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">
                        {t.sidebar.comingSoon}
                      </span>
                    )}
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Workflow Progress */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-sidebar-accent rounded-lg"
          >
            <p className="text-xs font-medium text-foreground mb-2">{t.sidebar.workflowProgress}</p>
            <div className="space-y-1.5">
              {[
                { label: t.sidebar.country, done: !!selectedCountry },
                { label: t.sidebar.product, done: !!selectedProduct },
                { label: t.sidebar.channel, done: !!selectedChannel },
                { label: t.sidebar.aiContent, done: currentView === 'content' || currentView === 'pipeline' },
                { label: t.sidebar.pipeline, done: currentView === 'pipeline' },
              ].map((step, idx) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium',
                    step.done
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <span className={cn(
                    'text-xs',
                    step.done ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* External Links */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <a
            href="https://www.lg.com/de"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowSquareOut className="w-4 h-4" />
            {t.sidebar.lgWebsite}
          </a>
        </div>
      )}

      {/* Toggle Button */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center"
        >
          {sidebarOpen ? (
            <CaretLeft className="w-4 h-4" />
          ) : (
            <CaretRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
