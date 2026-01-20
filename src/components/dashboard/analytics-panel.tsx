'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartLineUp,
  Clock,
  CurrencyDollar,
  Users,
  Globe,
  ArrowUp,
  ArrowDown,
  TrendUp,
  Lightning,
  CheckCircle,
  Target,
  Sparkle,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock analytics data representing what the platform would achieve
const mockAnalytics = {
  overview: {
    totalProducts: 1247,
    contentGenerated: 8934,
    platformsActive: 10,
    languagesSupported: 22,
  },
  efficiency: {
    timeReduction: 95,
    costSavings: 70,
    qualityScore: 94,
    automationRate: 89,
  },
  performance: {
    contentPerHour: 127,
    averageGenerationTime: 4.2, // seconds
    successRate: 99.2,
    errorRate: 0.8,
  },
  platformStats: [
    { name: 'Amazon', generated: 2341, pending: 45, color: '#FF9900' },
    { name: 'MediaMarkt', generated: 1876, pending: 23, color: '#DF0000' },
    { name: 'Saturn', generated: 1654, pending: 18, color: '#F79422' },
    { name: 'Otto', generated: 1432, pending: 32, color: '#E63312' },
    { name: 'eBay', generated: 1098, pending: 12, color: '#0064D2' },
    { name: 'Kaufland', generated: 876, pending: 8, color: '#E10915' },
    { name: 'Galaxus', generated: 654, pending: 5, color: '#0066CC' },
    { name: 'Shopee', generated: 543, pending: 28, color: '#EE4D2D' },
    { name: 'Lazada', generated: 432, pending: 15, color: '#0F146D' },
    { name: 'TikTok', generated: 328, pending: 21, color: '#000000' },
  ],
  weeklyTrend: [
    { day: 'Mon', generated: 1234, quality: 94 },
    { day: 'Tue', generated: 1456, quality: 95 },
    { day: 'Wed', generated: 1678, quality: 93 },
    { day: 'Thu', generated: 1543, quality: 96 },
    { day: 'Fri', generated: 1789, quality: 94 },
    { day: 'Sat', generated: 987, quality: 95 },
    { day: 'Sun', generated: 654, quality: 96 },
  ],
  aiAgents: [
    { name: 'Asset Verification', status: 'active', processed: 4521, accuracy: 99.1 },
    { name: 'Spec Extraction', status: 'active', processed: 4498, accuracy: 98.7 },
    { name: 'Content Generation', status: 'active', processed: 8934, accuracy: 97.2 },
    { name: 'SEO Optimization', status: 'active', processed: 8901, accuracy: 96.8 },
    { name: 'Translation', status: 'active', processed: 6723, accuracy: 98.5 },
    { name: 'Quality Assurance', status: 'active', processed: 8856, accuracy: 99.4 },
    { name: 'Compliance Check', status: 'active', processed: 8790, accuracy: 99.8 },
    { name: 'Distribution', status: 'active', processed: 7654, accuracy: 99.9 },
  ],
};

export function AnalyticsPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  const maxGenerated = Math.max(...mockAnalytics.platformStats.map(p => p.generated));

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ChartLineUp className="w-6 h-6 text-primary" weight="duotone" />
            <h1 className="text-xl font-headline font-semibold text-foreground">
              Analytics Dashboard
            </h1>
            <Badge variant="secondary" className="text-xs">
              <Sparkle className="w-3 h-3 mr-1" />
              Demo Data
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Performance metrics and content generation insights
          </p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm capitalize transition-colors',
                selectedPeriod === period ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Time Reduction"
          value={`${mockAnalytics.efficiency.timeReduction}%`}
          change={+12}
          description="vs. manual process"
          color="green"
        />
        <MetricCard
          icon={<CurrencyDollar className="w-5 h-5" />}
          label="Cost Savings"
          value={`${mockAnalytics.efficiency.costSavings}%`}
          change={+8}
          description="operational costs"
          color="blue"
        />
        <MetricCard
          icon={<Target className="w-5 h-5" />}
          label="Quality Score"
          value={`${mockAnalytics.efficiency.qualityScore}%`}
          change={+3}
          description="content accuracy"
          color="purple"
        />
        <MetricCard
          icon={<Lightning className="w-5 h-5" />}
          label="Automation Rate"
          value={`${mockAnalytics.efficiency.automationRate}%`}
          change={+5}
          description="fully automated"
          color="orange"
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Products</span>
          </div>
          <p className="text-2xl font-bold">{mockAnalytics.overview.totalProducts.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Content Generated</span>
          </div>
          <p className="text-2xl font-bold">{mockAnalytics.overview.contentGenerated.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Active Platforms</span>
          </div>
          <p className="text-2xl font-bold">{mockAnalytics.overview.platformsActive}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground">Languages</span>
          </div>
          <p className="text-2xl font-bold">{mockAnalytics.overview.languagesSupported}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <div className="col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Platform Distribution</h3>
          <div className="space-y-3">
            {mockAnalytics.platformStats.map((platform) => (
              <div key={platform.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {platform.generated.toLocaleString()} generated
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {platform.pending} pending
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(platform.generated / maxGenerated) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">AI Agents Status</h3>
          <div className="space-y-3">
            {mockAnalytics.aiAgents.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {agent.processed.toLocaleString()} processed
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {agent.accuracy}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Weekly Content Generation Trend</h3>
        <div className="flex items-end justify-between gap-4 h-40">
          {mockAnalytics.weeklyTrend.map((day, idx) => {
            const maxGenerated = Math.max(...mockAnalytics.weeklyTrend.map(d => d.generated));
            const heightPercent = (day.generated / maxGenerated) * 100;

            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="w-full bg-primary/80 rounded-t-lg relative group cursor-pointer hover:bg-primary transition-colors"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap">
                    {day.generated.toLocaleString()} items
                  </div>
                </motion.div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <PerformanceCard
          label="Content/Hour"
          value={mockAnalytics.performance.contentPerHour}
          unit="items"
          icon={<TrendUp className="w-4 h-4" />}
        />
        <PerformanceCard
          label="Avg Generation Time"
          value={mockAnalytics.performance.averageGenerationTime}
          unit="seconds"
          icon={<Clock className="w-4 h-4" />}
        />
        <PerformanceCard
          label="Success Rate"
          value={mockAnalytics.performance.successRate}
          unit="%"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <PerformanceCard
          label="Error Rate"
          value={mockAnalytics.performance.errorRate}
          unit="%"
          icon={<Target className="w-4 h-4" />}
          isLow
        />
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  change,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  description: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}) {
  const colorClasses = {
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    orange: 'bg-orange-500/10 text-orange-500',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium',
          change > 0 ? 'text-green-500' : 'text-red-500'
        )}>
          {change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs font-medium mt-2">{label}</p>
    </div>
  );
}

// Performance Card Component
function PerformanceCard({
  label,
  value,
  unit,
  icon,
  isLow = false,
}: {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  isLow?: boolean;
}) {
  return (
    <div className="bg-secondary/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold', isLow ? 'text-green-500' : '')}>
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
