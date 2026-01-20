/**
 * Inngest Client Configuration
 * Handles background job processing for the content generation pipeline
 */

import { Inngest, EventSchemas } from 'inngest';

// Define event types for the pipeline
type PipelineEvents = {
  'pipeline/start': {
    data: {
      pipelineId: string;
      productId: string;
      productTitle: string;
      modelNumber: string;
      channel: 'd2c' | '3p';
      platforms: string[];
      language: string;
      countryCode: string;
    };
  };
  'pipeline/step.completed': {
    data: {
      pipelineId: string;
      stepId: string;
      stepName: string;
      status: 'completed' | 'failed' | 'skipped';
      output?: Record<string, unknown>;
      error?: string;
    };
  };
  'pipeline/completed': {
    data: {
      pipelineId: string;
      status: 'completed' | 'failed';
      summary: {
        totalSteps: number;
        completedSteps: number;
        failedSteps: number;
        skippedSteps: number;
      };
    };
  };
  'content/generate': {
    data: {
      pipelineId: string;
      productId: string;
      platform: string;
      language: string;
      optimizationGoals: string[];
    };
  };
  'content/generated': {
    data: {
      pipelineId: string;
      productId: string;
      platform: string;
      content: {
        title: string;
        description: string;
        bulletPoints: string[];
        seoKeywords: string[];
      };
    };
  };
};

// Create the Inngest client
export const inngest = new Inngest({
  id: 'lgaip-dashboard',
  schemas: new EventSchemas().fromRecord<PipelineEvents>(),
});

// Pipeline step definitions (matching the UI)
export const PIPELINE_STEPS = [
  {
    id: 'asset-verification',
    name: 'Asset Verification',
    description: 'Validating images, checking quality and dimensions',
    agent: 'Asset Verification Agent',
  },
  {
    id: 'spec-verification',
    name: 'Spec Verification',
    description: 'Cross-referencing specifications with source data',
    agent: 'Spec Verification Agent',
  },
  {
    id: 'compliance-check',
    name: 'Compliance Check',
    description: 'Ensuring content meets platform requirements',
    agent: 'Compliance Agent',
  },
  {
    id: 'banner-generation',
    name: 'Banner Generation',
    description: 'Creating platform-optimized banner images',
    agent: 'Banner Generation Agent',
  },
  {
    id: 'thumbnail-generation',
    name: 'Thumbnail Generation',
    description: 'Generating product thumbnails for listings',
    agent: 'Thumbnail Agent',
  },
  {
    id: 'seo-optimization',
    name: 'SEO Optimization',
    description: 'Optimizing titles, descriptions, and keywords',
    agent: 'SEO Agent',
  },
  {
    id: 'human-review',
    name: 'Human Review',
    description: 'Content review and approval workflow',
    agent: 'Human-in-the-Loop',
  },
  {
    id: 'distribution',
    name: 'Platform Distribution',
    description: 'Publishing content to marketplace APIs',
    agent: 'Distribution Agent',
  },
] as const;

export type PipelineStepId = (typeof PIPELINE_STEPS)[number]['id'];
