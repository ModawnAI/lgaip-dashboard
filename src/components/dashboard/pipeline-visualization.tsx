'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Spinner,
  Warning,
  ArrowRight,
  Images,
  FileText,
  ShieldCheck,
  Image,
  MagnifyingGlass,
  UserCheck,
  CloudArrowUp,
  Play,
  Pause,
  SkipForward,
  Package,
  Eye,
} from '@phosphor-icons/react';
import { useDashboardStore } from '@/store/dashboard-store';
import { platformConfigs } from '@/data/sample-products';
import { PipelineStep } from '@/types/product';
import { cn } from '@/lib/utils';
import { PlatformIcon } from '@/components/icons/platform-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';

// Pipeline step definition interface
interface PipelineStepDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  agent: string;
}

// Function to get localized pipeline steps
function getPipelineSteps(t: ReturnType<typeof useTranslation>['t']): PipelineStepDefinition[] {
  return [
    {
      id: 'asset-verification',
      name: t.pipeline.steps.assetVerification.name,
      description: t.pipeline.steps.assetVerification.description,
      icon: Images,
      agent: t.pipeline.steps.assetVerification.agent,
    },
    {
      id: 'spec-verification',
      name: t.pipeline.steps.specVerification.name,
      description: t.pipeline.steps.specVerification.description,
      icon: FileText,
      agent: t.pipeline.steps.specVerification.agent,
    },
    {
      id: 'compliance-check',
      name: t.pipeline.steps.qualityAssurance.name,
      description: t.pipeline.steps.qualityAssurance.description,
      icon: ShieldCheck,
      agent: t.pipeline.steps.qualityAssurance.agent,
    },
    {
      id: 'banner-generation',
      name: t.pipeline.steps.contentGeneration.name,
      description: t.pipeline.steps.contentGeneration.description,
      icon: Image,
      agent: t.pipeline.steps.contentGeneration.agent,
    },
    {
      id: 'thumbnail-generation',
      name: t.pipeline.steps.platformOptimization.name,
      description: t.pipeline.steps.platformOptimization.description,
      icon: Image,
      agent: t.pipeline.steps.platformOptimization.agent,
    },
    {
      id: 'seo-optimization',
      name: t.pipeline.steps.qualityAssurance.name,
      description: t.pipeline.steps.qualityAssurance.description,
      icon: MagnifyingGlass,
      agent: t.pipeline.steps.qualityAssurance.agent,
    },
    {
      id: 'human-review',
      name: t.pipeline.steps.finalReview.name,
      description: t.pipeline.steps.finalReview.description,
      icon: UserCheck,
      agent: t.pipeline.steps.finalReview.agent,
    },
    {
      id: 'distribution',
      name: t.pipeline.steps.platformOptimization.name,
      description: t.pipeline.steps.platformOptimization.description,
      icon: CloudArrowUp,
      agent: t.pipeline.steps.platformOptimization.agent,
    },
  ];
}

export function PipelineVisualization() {
  const {
    selectedProduct,
    selectedChannel,
    selectedPlatforms,
    getCountryConfig,
  } = useDashboardStore();

  const { t } = useTranslation();
  const pipelineSteps = getPipelineSteps(t);
  const countryConfig = getCountryConfig();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [stepStatuses, setStepStatuses] = useState<Record<string, PipelineStep['status']>>({});
  const [stepOutputs, setStepOutputs] = useState<Record<string, unknown>>({});
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Simulate pipeline execution
  useEffect(() => {
    if (!isRunning || currentStepIndex >= pipelineSteps.length) {
      if (currentStepIndex >= pipelineSteps.length) {
        setIsRunning(false);
      }
      return;
    }

    const currentStep = pipelineSteps[currentStepIndex];

    // Set current step to in_progress
    setStepStatuses(prev => ({ ...prev, [currentStep.id]: 'in_progress' }));

    // Simulate step completion
    const duration = currentStep.id === 'human-review' ? 3000 : 1500 + Math.random() * 1500;

    const timer = setTimeout(() => {
      // Complete current step
      setStepStatuses(prev => ({ ...prev, [currentStep.id]: 'completed' }));

      // Generate mock output
      setStepOutputs(prev => ({
        ...prev,
        [currentStep.id]: generateMockOutput(currentStep.id),
      }));

      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex]);

  const startPipeline = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setStepStatuses({});
    setStepOutputs({});
  };

  const pausePipeline = () => {
    setIsRunning(false);
  };

  const skipStep = () => {
    if (currentStepIndex >= 0 && currentStepIndex < pipelineSteps.length) {
      const currentStep = pipelineSteps[currentStepIndex];
      setStepStatuses(prev => ({ ...prev, [currentStep.id]: 'skipped' }));
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const getStepStatus = (stepId: string, index: number): PipelineStep['status'] => {
    if (stepStatuses[stepId]) return stepStatuses[stepId];
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex && isRunning) return 'in_progress';
    return 'pending';
  };

  const getProgress = () => {
    const completedSteps = Object.values(stepStatuses).filter(
      s => s === 'completed' || s === 'skipped'
    ).length;
    return (completedSteps / pipelineSteps.length) * 100;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary/50 rounded-lg flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{selectedProduct?.modelNumber}</p>
              <h1 className="text-xl font-headline font-semibold text-foreground">
                {t.pipeline.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {selectedChannel}
                </Badge>
                {selectedChannel === '3p' && (
                  <span className="text-sm text-muted-foreground">
                    {selectedPlatforms.length} {t.contentEditor.platforms.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isRunning && currentStepIndex < 0 && (
              <Button onClick={startPipeline} className="gap-2">
                <Play className="w-4 h-4" weight="fill" />
                {t.pipeline.startPipeline}
              </Button>
            )}
            {isRunning && (
              <>
                <Button variant="outline" onClick={pausePipeline} className="gap-2">
                  <Pause className="w-4 h-4" weight="fill" />
                  {t.pipeline.stopPipeline}
                </Button>
                <Button variant="outline" onClick={skipStep} className="gap-2">
                  <SkipForward className="w-4 h-4" weight="fill" />
                  {t.common.next}
                </Button>
              </>
            )}
            {!isRunning && currentStepIndex >= 0 && currentStepIndex < pipelineSteps.length && (
              <Button onClick={() => setIsRunning(true)} className="gap-2">
                <Play className="w-4 h-4" weight="fill" />
                {t.common.next}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {currentStepIndex >= pipelineSteps.length
                ? t.pipeline.completed
                : currentStepIndex >= 0
                  ? `${t.pipeline.progress}: ${currentStepIndex + 1}/${pipelineSteps.length}`
                  : t.contentEditor.readyToGenerate}
            </span>
            <span className="font-medium">{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      </div>

      {/* Target Platforms */}
      {selectedChannel === '3p' && selectedPlatforms.length > 0 && (
        <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3">{t.pipeline.targetPlatforms}</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPlatforms.map(platform => {
              const config = platformConfigs[platform as keyof typeof platformConfigs];
              return (
                <div
                  key={platform}
                  className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border"
                >
                  <PlatformIcon platform={platform} size={24} />
                  <span className="text-sm font-medium">{config?.name || platform}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pipeline Steps */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Steps List */}
          <div className="space-y-3">
            {pipelineSteps.map((step, index) => {
              const status = getStepStatus(step.id, index);
              const Icon = step.icon;
              const isActive = index === currentStepIndex && isRunning;
              const isSelected = selectedStepId === step.id;

              return (
                <motion.button
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedStepId(step.id)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                    isActive && 'border-primary bg-primary/5 shadow-lg',
                    status === 'completed' && !isActive && 'border-green-200 bg-green-50',
                    status === 'failed' && 'border-red-200 bg-red-50',
                    status === 'skipped' && 'border-yellow-200 bg-yellow-50',
                    status === 'pending' && !isActive && 'border-border bg-card opacity-60',
                    isSelected && 'ring-2 ring-primary ring-offset-2'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number / Status */}
                    <div className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                      status === 'completed' && 'bg-green-100',
                      status === 'in_progress' && 'bg-primary/10',
                      status === 'failed' && 'bg-red-100',
                      status === 'skipped' && 'bg-yellow-100',
                      status === 'pending' && 'bg-secondary'
                    )}>
                      {status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />}
                      {status === 'in_progress' && <Spinner className="w-5 h-5 text-primary animate-spin" />}
                      {status === 'failed' && <Warning className="w-5 h-5 text-red-600" weight="fill" />}
                      {status === 'skipped' && <SkipForward className="w-5 h-5 text-yellow-600" weight="fill" />}
                      {status === 'pending' && <Circle className="w-5 h-5 text-muted-foreground" />}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={cn(
                          'w-4 h-4',
                          status === 'completed' && 'text-green-600',
                          status === 'in_progress' && 'text-primary',
                          status === 'failed' && 'text-red-600',
                          (status === 'pending' || status === 'skipped') && 'text-muted-foreground'
                        )} weight="duotone" />
                        <h4 className="font-medium text-foreground">{step.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Agent: {step.agent}
                      </p>
                    </div>

                    {/* Arrow for active */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-shrink-0"
                      >
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Step Detail Panel */}
          <div className="bg-secondary/30 rounded-xl p-6 sticky top-0 h-fit">
            {(() => {
              if (!selectedStepId) {
                return (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t.common.select}
                    </p>
                  </div>
                );
              }
              const selectedStep = pipelineSteps.find(s => s.id === selectedStepId);
              if (!selectedStep) return null;
              const typedStep: PipelineStepDefinition = {
                id: selectedStep.id,
                name: selectedStep.name,
                description: selectedStep.description,
                icon: selectedStep.icon,
                agent: selectedStep.agent,
              };
              return (
                <StepDetailPanel
                  key={selectedStepId}
                  step={typedStep}
                  status={getStepStatus(selectedStepId, pipelineSteps.findIndex(s => s.id === selectedStepId))}
                  output={stepOutputs[selectedStepId] as Record<string, unknown> | null}
                  platforms={selectedPlatforms}
                />
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepDetailPanelProps {
  step: PipelineStepDefinition;
  status: PipelineStep['status'];
  output: Record<string, unknown> | null;
  platforms: string[];
}

function StepDetailPanel({ step, status, output, platforms }: StepDetailPanelProps) {
  const Icon = step.icon;
  const { t } = useTranslation();

  // Get localized status text
  const getStatusText = (s: PipelineStep['status']) => {
    switch (s) {
      case 'completed': return t.pipeline.completed;
      case 'in_progress': return t.pipeline.running;
      case 'failed': return t.pipeline.failed;
      case 'pending': return t.pipeline.pending;
      case 'skipped': return t.pipeline.pending;
      default: return s;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          'p-2 rounded-lg',
          status === 'completed' && 'bg-green-100',
          status === 'in_progress' && 'bg-primary/10',
          status === 'pending' && 'bg-secondary'
        )}>
          <Icon className={cn(
            'w-6 h-6',
            status === 'completed' && 'text-green-600',
            status === 'in_progress' && 'text-primary',
            status === 'pending' && 'text-muted-foreground'
          )} weight="duotone" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{step.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{getStatusText(status)}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

      {/* Agent Info */}
      <div className="p-3 bg-card rounded-lg border border-border mb-4">
        <p className="text-xs text-muted-foreground mb-1">Agent</p>
        <p className="text-sm font-medium">{step.agent}</p>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Output</h4>
          <div className="p-3 bg-card rounded-lg border border-border">
            <pre className="text-xs text-muted-foreground overflow-auto max-h-48">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Platforms for distribution step */}
      {step.id === 'distribution' && status !== 'pending' && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-foreground">{t.pipeline.targetPlatforms}</h4>
          {platforms.map(platform => {
            const config = platformConfigs[platform as keyof typeof platformConfigs];
            return (
              <div
                key={platform}
                className="flex items-center justify-between p-2 bg-card rounded-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={platform} size={20} />
                  <span className="text-sm">{config?.name || platform}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {status === 'completed' ? t.pipeline.completed : t.pipeline.pending}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper to generate mock output
function generateMockOutput(stepId: string): unknown {
  switch (stepId) {
    case 'asset-verification':
      return {
        imagesVerified: 4,
        totalSize: '2.4 MB',
        resolutions: ['1200x800', '1920x1080', '800x800'],
        quality: 'High',
        issues: [],
      };
    case 'spec-verification':
      return {
        specsValidated: 24,
        categoriesChecked: ['Display', 'Audio', 'Connectivity', 'Dimensions'],
        dataQuality: '98%',
        warnings: 0,
      };
    case 'compliance-check':
      return {
        platformsChecked: 5,
        complianceScore: 98,
        rules: {
          imageSize: 'pass',
          titleLength: 'pass',
          descriptionLength: 'pass',
          prohibitedWords: 'pass',
        },
        warnings: ['Consider adding more lifestyle images for Amazon'],
      };
    case 'banner-generation':
      return {
        bannersCreated: 3,
        formats: ['1200x628', '1080x1080', '1920x1080'],
        variants: ['Primary', 'Lifestyle', 'Features'],
        aiModel: 'DALL-E 3',
      };
    case 'thumbnail-generation':
      return {
        thumbnailsCreated: 5,
        sizes: ['500x500', '800x800', '1200x1200'],
        backgroundRemoval: true,
        optimized: true,
      };
    case 'seo-optimization':
      return {
        titleOptimized: true,
        keywordsAdded: 12,
        readabilityScore: 85,
        seoScore: 92,
        recommendations: ['Add more long-tail keywords', 'Include brand name in title'],
      };
    case 'human-review':
      return {
        status: 'approved',
        reviewer: 'content-reviewer@lg.com',
        timestamp: new Date().toISOString(),
        comments: 'Approved for distribution',
      };
    case 'distribution':
      return {
        platformsPublished: 5,
        status: 'success',
        timestamp: new Date().toISOString(),
        apiResponses: {
          mediamarkt: 'ok',
          saturn: 'ok',
          amazon: 'ok',
          otto: 'ok',
          ebay: 'ok',
        },
      };
    default:
      return null;
  }
}
