'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Warning,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Barcode,
  Recycle,
  Certificate,
  Globe,
  ArrowRight,
  Info,
  Sparkle,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock compliance data for the demo
const mockComplianceData = {
  overview: {
    totalProducts: 1247,
    compliant: 1198,
    pendingReview: 32,
    requiresAction: 17,
  },
  germanCompliance: {
    lucid: {
      name: 'LUCID Packaging Registry',
      registered: 1198,
      pending: 32,
      failed: 17,
      description: 'German packaging law compliance for recycling fees',
    },
    weee: {
      name: 'WEEE Registration',
      registered: 1215,
      pending: 15,
      failed: 17,
      description: 'Waste electrical equipment disposal compliance',
    },
    battg: {
      name: 'BattG Battery Law',
      registered: 856,
      pending: 12,
      failed: 5,
      notApplicable: 374,
      description: 'Battery disposal and recycling requirements',
    },
  },
  productIdentifiers: {
    ean: { valid: 1230, invalid: 17, missing: 0 },
    gtin: { valid: 1230, invalid: 12, missing: 5 },
    upc: { valid: 1180, invalid: 8, missing: 59 },
    asin: { valid: 1024, invalid: 0, missing: 223 },
  },
  contentQuality: {
    titleOptimization: 94,
    descriptionQuality: 91,
    imageCompliance: 97,
    attributeCompleteness: 89,
    seoScore: 92,
    translationAccuracy: 96,
  },
  platformStatus: [
    { platform: 'Amazon DE', status: 'compliant', issues: 0, lastCheck: '2 hours ago' },
    { platform: 'MediaMarkt', status: 'compliant', issues: 0, lastCheck: '1 hour ago' },
    { platform: 'Saturn', status: 'compliant', issues: 0, lastCheck: '1 hour ago' },
    { platform: 'Otto', status: 'warning', issues: 3, lastCheck: '3 hours ago' },
    { platform: 'eBay DE', status: 'compliant', issues: 0, lastCheck: '30 min ago' },
    { platform: 'Kaufland', status: 'warning', issues: 2, lastCheck: '4 hours ago' },
    { platform: 'Galaxus', status: 'compliant', issues: 0, lastCheck: '1 hour ago' },
    { platform: 'Shopee', status: 'compliant', issues: 0, lastCheck: '2 hours ago' },
    { platform: 'Lazada', status: 'compliant', issues: 0, lastCheck: '2 hours ago' },
    { platform: 'TikTok Shop', status: 'pending', issues: 5, lastCheck: '6 hours ago' },
  ],
  recentIssues: [
    {
      id: 1,
      severity: 'high',
      type: 'LUCID Missing',
      product: 'OLED65C4',
      platform: 'Otto',
      description: 'LUCID registration number not found in product listing',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      severity: 'medium',
      type: 'EAN Mismatch',
      product: 'WM-F12WD',
      platform: 'Kaufland',
      description: 'EAN code does not match product database',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      severity: 'low',
      type: 'Image Size',
      product: 'GR-F589NL',
      platform: 'TikTok Shop',
      description: 'Main image below recommended resolution (1000x1000)',
      timestamp: '5 hours ago',
    },
    {
      id: 4,
      severity: 'medium',
      type: 'Description Length',
      product: 'OLED55B4',
      platform: 'Amazon DE',
      description: 'Product description exceeds platform character limit',
      timestamp: '6 hours ago',
    },
  ],
};

export function CompliancePanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'german' | 'quality' | 'issues'>('overview');

  const complianceRate = Math.round(
    (mockComplianceData.overview.compliant / mockComplianceData.overview.totalProducts) * 100
  );

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-6 h-6 text-primary" weight="duotone" />
            <h1 className="text-xl font-headline font-semibold text-foreground">
              Compliance Dashboard
            </h1>
            <Badge variant="secondary" className="text-xs">
              <Sparkle className="w-3 h-3 mr-1" />
              Demo Data
            </Badge>
          </div>
          <p className="text-muted-foreground">
            German e-commerce compliance and content quality monitoring
          </p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {(['overview', 'german', 'quality', 'issues'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm capitalize transition-colors',
                activeTab === tab ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
            >
              {tab === 'german' ? 'German Law' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Compliant Products"
          value={mockComplianceData.overview.compliant}
          total={mockComplianceData.overview.totalProducts}
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending Review"
          value={mockComplianceData.overview.pendingReview}
          color="yellow"
        />
        <StatCard
          icon={<Warning className="w-5 h-5" />}
          label="Requires Action"
          value={mockComplianceData.overview.requiresAction}
          color="red"
        />
        <StatCard
          icon={<ShieldCheck className="w-5 h-5" />}
          label="Compliance Rate"
          value={`${complianceRate}%`}
          color="blue"
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Platform Status Grid */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Platform Compliance Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {mockComplianceData.platformStatus.map((platform) => (
                <div
                  key={platform.platform}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        platform.status === 'compliant' && 'bg-green-500',
                        platform.status === 'warning' && 'bg-yellow-500',
                        platform.status === 'pending' && 'bg-blue-500'
                      )}
                    />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {platform.issues > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {platform.issues} issues
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{platform.lastCheck}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Identifiers */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-primary" />
              Product Identifier Validation
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(mockComplianceData.productIdentifiers).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium uppercase">{key}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((data.valid / (data.valid + data.invalid + data.missing)) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(data.valid / (data.valid + data.invalid + data.missing)) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="text-green-500">{data.valid} valid</span>
                    {data.invalid > 0 && <span className="text-red-500">{data.invalid} invalid</span>}
                    {data.missing > 0 && <span className="text-yellow-500">{data.missing} missing</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'german' && (
        <div className="space-y-6">
          {/* German Compliance Cards */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(mockComplianceData.germanCompliance).map(([key, data]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{data.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
                  </div>
                  {key === 'lucid' && <FileText className="w-5 h-5 text-primary" />}
                  {key === 'weee' && <Recycle className="w-5 h-5 text-green-500" />}
                  {key === 'battg' && <Certificate className="w-5 h-5 text-yellow-500" />}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Registered</span>
                    <span className="font-medium text-green-500">{data.registered}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium text-yellow-500">{data.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Failed</span>
                    <span className="font-medium text-red-500">{data.failed}</span>
                  </div>
                  {'notApplicable' in data && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">N/A</span>
                      <span className="font-medium text-gray-500">{data.notApplicable}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Progress
                    value={(data.registered / (data.registered + data.pending + data.failed)) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((data.registered / (data.registered + data.pending + data.failed)) * 100)}%
                    compliance rate
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-500 mb-1">German E-Commerce Compliance</p>
              <p className="text-sm text-muted-foreground">
                All products sold in Germany must comply with LUCID (packaging registration), WEEE
                (electronic waste), and BattG (battery law) regulations. Non-compliance can result in
                fines up to EUR200,000 and sales prohibition.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="space-y-6">
          {/* Content Quality Metrics */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4">Content Quality Scores</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(mockComplianceData.contentQuality).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        value >= 95 && 'text-green-500',
                        value >= 85 && value < 95 && 'text-yellow-500',
                        value < 85 && 'text-red-500'
                      )}
                    >
                      {value}%
                    </span>
                  </div>
                  <Progress
                    value={value}
                    className={cn(
                      'h-3',
                      value >= 95 && '[&>div]:bg-green-500',
                      value >= 85 && value < 95 && '[&>div]:bg-yellow-500',
                      value < 85 && '[&>div]:bg-red-500'
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quality Recommendations */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4">AI Quality Recommendations</h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Improve Attribute Completeness',
                  description: 'Add missing energy efficiency ratings to 134 products',
                  impact: 'High',
                },
                {
                  title: 'Optimize Product Titles',
                  description: 'Standardize brand positioning in 78 product titles',
                  impact: 'Medium',
                },
                {
                  title: 'Update Image Dimensions',
                  description: 'Resize 23 images to meet TikTok Shop requirements',
                  impact: 'Low',
                },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                >
                  <div>
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        rec.impact === 'High'
                          ? 'destructive'
                          : rec.impact === 'Medium'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {rec.impact}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-6">
          {/* Issue Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-500/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-500">High Severity</span>
              </div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Requires immediate action</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Warning className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-yellow-500">Medium Severity</span>
              </div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Review within 24 hours</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-500">Low Severity</span>
              </div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-muted-foreground">Address when possible</p>
            </div>
          </div>

          {/* Recent Issues List */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4">Recent Issues</h3>
            <div className="space-y-3">
              {mockComplianceData.recentIssues.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      issue.severity === 'high' && 'bg-red-500/10',
                      issue.severity === 'medium' && 'bg-yellow-500/10',
                      issue.severity === 'low' && 'bg-blue-500/10'
                    )}
                  >
                    {issue.severity === 'high' && <XCircle className="w-5 h-5 text-red-500" />}
                    {issue.severity === 'medium' && <Warning className="w-5 h-5 text-yellow-500" />}
                    {issue.severity === 'low' && <Info className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{issue.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {issue.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{issue.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Product: {issue.product}</span>
                      <span>{issue.timestamp}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                    Resolve
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  total,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  total?: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
}) {
  const colorClasses = {
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    red: 'bg-red-500/10 text-red-500',
    blue: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {total && <span className="text-sm text-muted-foreground">/ {total.toLocaleString()}</span>}
      </div>
    </div>
  );
}
