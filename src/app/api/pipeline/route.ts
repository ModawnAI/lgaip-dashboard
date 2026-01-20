/**
 * Pipeline API Route
 * Triggers pipeline runs via Inngest
 */

import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId,
      productTitle,
      modelNumber,
      channel,
      platforms,
      language = 'de-DE',
      countryCode = 'de',
    } = body;

    // Validate required fields
    if (!productId || !productTitle || !channel) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, productTitle, channel' },
        { status: 400 }
      );
    }

    if (channel === '3p' && (!platforms || platforms.length === 0)) {
      return NextResponse.json(
        { error: '3P channel requires at least one platform' },
        { status: 400 }
      );
    }

    // Generate a unique pipeline ID
    const pipelineId = `pipeline-${productId}-${Date.now()}`;

    // Send the pipeline start event to Inngest
    await inngest.send({
      name: 'pipeline/start',
      data: {
        pipelineId,
        productId,
        productTitle,
        modelNumber: modelNumber || productId,
        channel,
        platforms: platforms || [],
        language,
        countryCode,
      },
    });

    return NextResponse.json({
      success: true,
      pipelineId,
      message: 'Pipeline started successfully',
    });
  } catch (error) {
    console.error('Pipeline start error:', error);
    return NextResponse.json(
      { error: 'Failed to start pipeline' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return pipeline status endpoint info
  return NextResponse.json({
    endpoints: {
      POST: 'Start a new pipeline run',
      body: {
        productId: 'string (required)',
        productTitle: 'string (required)',
        modelNumber: 'string (optional)',
        channel: "'d2c' | '3p' (required)",
        platforms: 'string[] (required for 3p channel)',
        language: "string (default: 'de-DE')",
        countryCode: "string (default: 'de')",
      },
    },
  });
}
