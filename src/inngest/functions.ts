/**
 * Inngest Functions for Content Generation Pipeline
 * Each function handles a specific step in the pipeline
 * Enhanced with German e-commerce compliance validation
 */

import { inngest, PIPELINE_STEPS } from '@/lib/inngest';
import { Platform } from '@/types/product';
import { platformRequirementsMap, GERMAN_GLOBAL_COMPLIANCE } from '@/lib/gemini';

// German compliance requirement keys
type GlobalComplianceKey = keyof typeof GERMAN_GLOBAL_COMPLIANCE;

/**
 * Validate EAN/GTIN format (13-digit barcode)
 */
function validateEANGTIN(ean: string | undefined): { valid: boolean; error?: string } {
  if (!ean) {
    return { valid: false, error: 'EAN/GTIN is required but not provided' };
  }

  // Remove any spaces or dashes
  const cleanEan = ean.replace(/[\s-]/g, '');

  // Check if 13 digits
  if (!/^\d{13}$/.test(cleanEan)) {
    return { valid: false, error: `EAN/GTIN must be 13 digits, got: ${cleanEan.length} characters` };
  }

  // Validate checksum (GS1 standard)
  const digits = cleanEan.split('').map(Number);
  const sum = digits.slice(0, 12).reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);
  const checkDigit = (10 - (sum % 10)) % 10;

  if (checkDigit !== digits[12]) {
    return { valid: false, error: `Invalid EAN/GTIN checksum. Expected check digit: ${checkDigit}` };
  }

  return { valid: true };
}

/**
 * Check global German compliance requirements for a platform
 */
function checkGlobalCompliance(
  platform: Platform,
  productData: {
    ean?: string;
    lucidNumber?: string;
    weeeNumber?: string;
    productCategory?: string;
    hasGermanReturnAddress?: boolean;
    hasImpressum?: boolean;
  }
): {
  passed: boolean;
  requirements: Array<{
    name: string;
    required: boolean;
    status: 'pass' | 'fail' | 'warning' | 'not_applicable';
    message: string;
  }>;
} {
  const platformReqs = platformRequirementsMap[platform];
  const globalCompliance = platformReqs?.globalCompliance || [];
  const results: Array<{
    name: string;
    required: boolean;
    status: 'pass' | 'fail' | 'warning' | 'not_applicable';
    message: string;
  }> = [];

  let allPassed = true;

  // Check each required global compliance
  for (const complianceKey of globalCompliance) {
    const compliance = GERMAN_GLOBAL_COMPLIANCE[complianceKey as GlobalComplianceKey];
    if (!compliance) continue;

    switch (complianceKey) {
      case 'EAN_GTIN': {
        const eanValidation = validateEANGTIN(productData.ean);
        results.push({
          name: compliance.name,
          required: compliance.required,
          status: eanValidation.valid ? 'pass' : 'fail',
          message: eanValidation.valid
            ? `EAN/GTIN ${productData.ean} validated successfully`
            : eanValidation.error || 'Invalid EAN/GTIN',
        });
        if (!eanValidation.valid && compliance.required) allPassed = false;
        break;
      }

      case 'LUCID': {
        const hasLucid = !!productData.lucidNumber;
        results.push({
          name: compliance.name,
          required: compliance.required,
          status: hasLucid ? 'pass' : 'fail',
          message: hasLucid
            ? `LUCID number registered: ${productData.lucidNumber}`
            : 'LUCID Packaging Register number required for German marketplace',
        });
        if (!hasLucid && compliance.required) allPassed = false;
        break;
      }

      case 'WEEE': {
        // WEEE is required for electronics categories
        const weeeCategories = GERMAN_GLOBAL_COMPLIANCE.WEEE.categories;
        const isElectronics = weeeCategories.some(cat =>
          productData.productCategory?.toLowerCase().includes(cat.toLowerCase())
        );

        if (isElectronics) {
          const hasWeee = !!productData.weeeNumber;
          results.push({
            name: compliance.name,
            required: true,
            status: hasWeee ? 'pass' : 'fail',
            message: hasWeee
              ? `WEEE registration: ${productData.weeeNumber}`
              : 'WEEE registration required for electronics in Germany',
          });
          if (!hasWeee) allPassed = false;
        } else {
          results.push({
            name: compliance.name,
            required: false,
            status: 'not_applicable',
            message: 'Product category does not require WEEE registration',
          });
        }
        break;
      }

      case 'GERMAN_RETURN_ADDRESS': {
        const hasAddress = productData.hasGermanReturnAddress ?? false;
        results.push({
          name: compliance.name,
          required: compliance.required,
          status: hasAddress ? 'pass' : 'warning',
          message: hasAddress
            ? 'German return address configured'
            : 'German return address recommended for most platforms',
        });
        // This is a warning, not a hard fail
        break;
      }

      case 'IMPRESSUM': {
        const hasImpressum = productData.hasImpressum ?? false;
        results.push({
          name: compliance.name,
          required: compliance.required,
          status: hasImpressum ? 'pass' : 'fail',
          message: hasImpressum
            ? 'Impressum (legal business info) configured'
            : 'Impressum required by German law for online sellers',
        });
        if (!hasImpressum && compliance.required) allPassed = false;
        break;
      }
    }
  }

  return { passed: allPassed, requirements: results };
}

/**
 * Main Pipeline Orchestrator
 * Coordinates all pipeline steps in sequence
 */
export const runPipeline = inngest.createFunction(
  { id: 'run-pipeline', name: 'Content Generation Pipeline' },
  { event: 'pipeline/start' },
  async ({ event, step }) => {
    const { pipelineId, productId, productTitle, modelNumber, platforms, channel, language, countryCode } = event.data;

    const results: Record<string, unknown> = {};
    let completedSteps = 0;
    let failedSteps = 0;
    let skippedSteps = 0;

    // Step 1: Asset Verification
    const assetResult = await step.run('asset-verification', async () => {
      // Simulate asset verification - in production, this would check actual images
      await simulateProcessing(1500);
      return {
        stepId: 'asset-verification',
        status: 'completed' as const,
        output: {
          imagesVerified: 4,
          totalSize: '2.4 MB',
          resolutions: ['1200x800', '1920x1080', '800x800'],
          quality: 'High',
          issues: [],
        },
      };
    });
    results['asset-verification'] = assetResult;
    completedSteps++;

    // Step 2: Spec Verification
    const specResult = await step.run('spec-verification', async () => {
      await simulateProcessing(1200);
      return {
        stepId: 'spec-verification',
        status: 'completed' as const,
        output: {
          specsValidated: 24,
          categoriesChecked: ['Display', 'Audio', 'Connectivity', 'Dimensions'],
          dataQuality: '98%',
          warnings: 0,
        },
      };
    });
    results['spec-verification'] = specResult;
    completedSteps++;

    // Step 3: Compliance Check (per platform) - Enhanced with German e-commerce requirements
    const complianceResult = await step.run('compliance-check', async () => {
      await simulateProcessing(1800);

      // Mock product compliance data (in production, this would come from the database)
      const productComplianceData = {
        ean: '4005176000126', // Example valid LG EAN
        lucidNumber: 'DE3274910123456', // Example LUCID number
        weeeNumber: 'DE12345678', // Example WEEE number
        productCategory: productTitle, // Use title to detect category
        hasGermanReturnAddress: true,
        hasImpressum: true,
      };

      const platformChecks: Record<string, {
        passed: boolean;
        issues: string[];
        globalCompliance: Array<{
          name: string;
          required: boolean;
          status: 'pass' | 'fail' | 'warning' | 'not_applicable';
          message: string;
        }>;
        contentCompliance: {
          titleLength: { status: 'pass' | 'fail'; max: number; current: number };
          descriptionLength: { status: 'pass' | 'fail'; max: number };
          bulletPoints: { status: 'pass' | 'fail'; max: number; min?: number };
          imageRequirements: { status: 'pass' | 'fail' | 'warning'; minResolution: string; minQuantity: number };
        };
      }> = {};

      let totalIssues = 0;
      let totalWarnings = 0;

      for (const platform of platforms) {
        const req = platformRequirementsMap[platform as Platform];
        if (!req) continue;

        // Check global German compliance
        const globalComplianceResult = checkGlobalCompliance(platform as Platform, productComplianceData);

        // Check content compliance
        const titleExample = `LG ${productTitle} | ${modelNumber}`;
        const contentCompliance = {
          titleLength: {
            status: titleExample.length <= req.titleMaxLength ? 'pass' as const : 'fail' as const,
            max: req.titleMaxLength,
            current: titleExample.length,
          },
          descriptionLength: {
            status: 'pass' as const, // Assume pass for now
            max: req.descriptionMaxLength,
          },
          bulletPoints: {
            status: 'pass' as const,
            max: req.bulletPointsMax,
            min: req.bulletPointsMin,
          },
          imageRequirements: {
            status: 'pass' as const,
            minResolution: req.imageRequirements.minResolution,
            minQuantity: req.imageRequirements.minQuantity,
          },
        };

        // Collect issues
        const issues: string[] = [];
        globalComplianceResult.requirements.forEach(r => {
          if (r.status === 'fail') {
            issues.push(r.message);
            totalIssues++;
          } else if (r.status === 'warning') {
            totalWarnings++;
          }
        });

        if (contentCompliance.titleLength.status === 'fail') {
          issues.push(`Title exceeds max length (${contentCompliance.titleLength.current}/${contentCompliance.titleLength.max})`);
          totalIssues++;
        }

        platformChecks[platform] = {
          passed: globalComplianceResult.passed && issues.length === 0,
          issues,
          globalCompliance: globalComplianceResult.requirements,
          contentCompliance,
        };
      }

      // Calculate compliance score
      const totalChecks = platforms.length * 5; // ~5 checks per platform
      const complianceScore = Math.round(((totalChecks - totalIssues) / totalChecks) * 100);

      const warnings: string[] = [];
      if (totalWarnings > 0) {
        warnings.push(`${totalWarnings} compliance warning(s) detected`);
      }

      // Platform-specific warnings
      if (platforms.includes('amazon' as Platform)) {
        warnings.push('Amazon: Consider A+ Content for better visibility');
      }
      if (platforms.includes('galaxus' as Platform)) {
        warnings.push('Galaxus: Fill all detailed attribute fields for filter visibility');
      }
      if (platforms.includes('kaufland' as Platform)) {
        warnings.push('Kaufland: LUCID number strictly enforced - account may be blocked without it');
      }

      return {
        stepId: 'compliance-check',
        status: totalIssues === 0 ? 'completed' as const : 'warning' as const,
        output: {
          platformsChecked: platforms.length,
          complianceScore,
          totalIssues,
          totalWarnings,
          germanComplianceStatus: {
            lucid: productComplianceData.lucidNumber ? 'registered' : 'missing',
            weee: productComplianceData.weeeNumber ? 'registered' : 'missing',
            ean: validateEANGTIN(productComplianceData.ean).valid ? 'valid' : 'invalid',
            impressum: productComplianceData.hasImpressum ? 'configured' : 'missing',
            germanReturnAddress: productComplianceData.hasGermanReturnAddress ? 'configured' : 'missing',
          },
          rules: {
            eanGtin: validateEANGTIN(productComplianceData.ean).valid ? 'pass' : 'fail',
            lucidPackaging: productComplianceData.lucidNumber ? 'pass' : 'fail',
            weeeElectronics: productComplianceData.weeeNumber ? 'pass' : 'not_required',
            imageSize: 'pass',
            titleLength: 'pass',
            descriptionLength: 'pass',
            prohibitedWords: 'pass',
          },
          platformChecks,
          warnings,
        },
      };
    });
    results['compliance-check'] = complianceResult;
    completedSteps++;

    // Step 4: Banner Generation
    const bannerResult = await step.run('banner-generation', async () => {
      await simulateProcessing(3000);
      return {
        stepId: 'banner-generation',
        status: 'completed' as const,
        output: {
          bannersCreated: 3,
          formats: ['1200x628', '1080x1080', '1920x1080'],
          variants: ['Primary', 'Lifestyle', 'Features'],
          aiModel: 'DALL-E 3',
          platforms: platforms.map(p => ({
            platform: p,
            bannerUrl: `https://cdn.example.com/banners/${productId}/${p}.jpg`,
          })),
        },
      };
    });
    results['banner-generation'] = bannerResult;
    completedSteps++;

    // Step 5: Thumbnail Generation
    const thumbnailResult = await step.run('thumbnail-generation', async () => {
      await simulateProcessing(2500);
      return {
        stepId: 'thumbnail-generation',
        status: 'completed' as const,
        output: {
          thumbnailsCreated: platforms.length * 3,
          sizes: ['500x500', '800x800', '1200x1200'],
          backgroundRemoval: true,
          optimized: true,
          platforms: platforms.map(p => ({
            platform: p,
            thumbnails: [
              `https://cdn.example.com/thumbs/${productId}/${p}_500.jpg`,
              `https://cdn.example.com/thumbs/${productId}/${p}_800.jpg`,
              `https://cdn.example.com/thumbs/${productId}/${p}_1200.jpg`,
            ],
          })),
        },
      };
    });
    results['thumbnail-generation'] = thumbnailResult;
    completedSteps++;

    // Step 6: SEO Optimization (per platform) - Enhanced with platform-specific SEO requirements
    const seoResult = await step.run('seo-optimization', async () => {
      await simulateProcessing(2000);

      const platformSEO: Record<string, {
        title: string;
        titleMobile?: string;
        keywords: string[];
        metaDescription: string;
        format: string;
        seoNotes: string;
      }> = {};

      for (const platform of platforms) {
        const req = platformRequirementsMap[platform as Platform];
        if (!req) continue;

        // Generate optimized title based on platform format
        const baseTitle = `LG ${productTitle} | ${modelNumber}`;
        platformSEO[platform] = {
          title: baseTitle.slice(0, req.titleMaxLength),
          titleMobile: req.titleMobileMaxLength
            ? baseTitle.slice(0, req.titleMobileMaxLength)
            : undefined,
          keywords: [...req.keywords, ...generateKeywords(productTitle, platform)],
          metaDescription: `Entdecken Sie den ${productTitle}. Premium Qualität von LG. ${req.philosophy}`.slice(0, 160),
          format: req.titleFormat,
          seoNotes: req.seoNotes,
        };
      }

      // Generate platform-specific recommendations
      const recommendations: string[] = [];
      for (const platform of platforms) {
        const req = platformRequirementsMap[platform as Platform];
        if (!req) continue;

        if (platform === 'galaxus') {
          recommendations.push('Galaxus: Keep titles minimal - system auto-generates from attributes');
        }
        if (platform === 'amazon') {
          recommendations.push('Amazon: Use German terms (Handy vs Smartphone) based on keyword volume');
        }
        if (platform === 'otto') {
          recommendations.push('Otto: Combine lifestyle benefits with specs in bullet points');
        }
        if (platform === 'kaufland') {
          recommendations.push('Kaufland: Use HTML bold headers for section separation');
        }
      }

      return {
        stepId: 'seo-optimization',
        status: 'completed' as const,
        output: {
          titleOptimized: true,
          keywordsAdded: Object.values(platformSEO).reduce((acc, p) => acc + p.keywords.length, 0),
          readabilityScore: 85,
          seoScore: 92,
          platformSEO,
          recommendations: [
            'Include brand name in all platform titles',
            ...recommendations,
          ],
        },
      };
    });
    results['seo-optimization'] = seoResult;
    completedSteps++;

    // Step 7: Human Review (wait for approval or auto-approve in dev)
    const humanReviewResult = await step.run('human-review', async () => {
      // In production, this would create a review task and wait for human approval
      // For now, auto-approve after a delay
      await simulateProcessing(500);
      return {
        stepId: 'human-review',
        status: 'completed' as const,
        output: {
          status: 'auto-approved',
          reviewer: 'system@lg.com',
          timestamp: new Date().toISOString(),
          comments: 'Auto-approved for development environment',
          requiresManualReview: false,
        },
      };
    });
    results['human-review'] = humanReviewResult;
    completedSteps++;

    // Step 8: Platform Distribution
    const distributionResult = await step.run('distribution', async () => {
      await simulateProcessing(3000);

      const apiResponses: Record<string, string> = {};
      for (const platform of platforms) {
        apiResponses[platform] = 'ok';
      }

      return {
        stepId: 'distribution',
        status: 'completed' as const,
        output: {
          platformsPublished: platforms.length,
          status: 'success',
          timestamp: new Date().toISOString(),
          apiResponses,
          publishedUrls: platforms.map(p => ({
            platform: p,
            url: `https://${p}.example.com/products/${productId}`,
          })),
        },
      };
    });
    results['distribution'] = distributionResult;
    completedSteps++;

    // Send completion event
    await step.sendEvent('pipeline-completed', {
      name: 'pipeline/completed',
      data: {
        pipelineId,
        status: failedSteps > 0 ? 'failed' : 'completed',
        summary: {
          totalSteps: PIPELINE_STEPS.length,
          completedSteps,
          failedSteps,
          skippedSteps,
        },
      },
    });

    return {
      pipelineId,
      productId,
      status: 'completed',
      results,
      summary: {
        totalSteps: PIPELINE_STEPS.length,
        completedSteps,
        failedSteps,
        skippedSteps,
      },
    };
  }
);

/**
 * Content Generation Function
 * Generates platform-specific content using Gemini AI
 */
export const generateContent = inngest.createFunction(
  { id: 'generate-content', name: 'Generate Platform Content' },
  { event: 'content/generate' },
  async ({ event, step }) => {
    const { pipelineId, productId, platform, language, optimizationGoals } = event.data;

    const content = await step.run('generate-ai-content', async () => {
      // In production, this would call the Gemini API
      // For now, return mock content
      await simulateProcessing(2000);

      return {
        title: `LG Product ${productId} - Premium Quality`,
        description: `Entdecken Sie das LG ${productId}. Höchste Qualität und innovative Technologie.`,
        bulletPoints: [
          'Premium Qualität von LG',
          'Innovative Technologie',
          'Umweltfreundlich',
          'Lange Lebensdauer',
          'Exzellenter Kundenservice',
        ],
        seoKeywords: ['LG', platform, 'Premium', 'Qualität', 'Innovation'],
        aeoSnippet: `Das LG ${productId} ist ein hochwertiges Produkt mit innovativen Features.`,
        geoSummary: `LG ${productId} - Ein Premium-Produkt für anspruchsvolle Kunden.`,
        metaDescription: `Kaufen Sie das LG ${productId}. Premium Qualität zum besten Preis.`,
      };
    });

    await step.sendEvent('content-generated', {
      name: 'content/generated',
      data: {
        pipelineId,
        productId,
        platform,
        content,
      },
    });

    return content;
  }
);

// Helper functions
function simulateProcessing(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateKeywords(productTitle: string, platform: string): string[] {
  const baseKeywords = ['LG', 'Premium', 'Qualität', 'Original', 'Neu'];
  const platformKeywords: Record<string, string[]> = {
    mediamarkt: ['Technik', 'Innovation'],
    saturn: ['Tech', 'Smart'],
    amazon: ['Best Seller', 'Top Rated'],
    otto: ['Zuhause', 'Familie', 'Lifestyle'],
    galaxus: ['Präzision', 'Schweizer Standard'],
    kaufland: ['Original', 'OVP', 'Garantie'],
    ebay: ['Original', 'Händler'],
    shopee: ['Flash Sale', 'Best Price'],
    lazada: ['Official Store', 'Authentic'],
    tiktok: ['Trending', 'Viral'],
  };

  return [...baseKeywords, ...(platformKeywords[platform] || [])];
}

// Export all functions
export const functions = [runPipeline, generateContent];
