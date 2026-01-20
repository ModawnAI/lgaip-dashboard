/**
 * Inngest API Route
 * Handles incoming Inngest events and serves the Inngest Dev Server
 */

import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { functions } from '@/inngest/functions';

// Create and export the Inngest serve handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
