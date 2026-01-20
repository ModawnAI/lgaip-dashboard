import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  CrawledProduct,
  ProductCategoryId,
  toDashboardProduct,
} from '@/types/crawled-product';

// Base path for product data
const DATA_BASE_PATH = path.resolve(process.cwd(), '..');

// Category configuration
const CATEGORY_CONFIG: Record<string, { id: ProductCategoryId; name: string }> = {
  'oled-data': { id: 'oled', name: 'OLED' },
  'oled-evo-data': { id: 'oled-evo', name: 'OLED evo' },
  'qned-data': { id: 'qned', name: 'QNED' },
  'qned-evo-data': { id: 'qned-evo', name: 'QNED evo' },
  'nanocell-data': { id: 'nanocell', name: 'NanoCell' },
  '4k-uhd-data': { id: '4k-uhd', name: '4K UHD' },
  'uhd-data': { id: 'uhd', name: 'UHD' },
  'soundbar-data': { id: 'soundbar', name: 'Soundbar' },
  'tv-bundles-data': { id: 'tv-bundles', name: 'TV Bundles' },
  'tv-zubehoer-data': { id: 'tv-zubehoer', name: 'TV Zubehör' },
  'smart-tvs-data': { id: 'smart-tvs', name: 'Smart TVs' },
};

/**
 * Search for a product by model number across all directories
 */
async function findProductById(
  modelNumber: string
): Promise<{ product: CrawledProduct; categoryId: ProductCategoryId; categoryName: string } | null> {
  const normalizedId = modelNumber.toLowerCase();

  for (const [dirName, config] of Object.entries(CATEGORY_CONFIG)) {
    const dirPath = path.join(DATA_BASE_PATH, dirName);

    try {
      await fs.access(dirPath);
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const fileNameWithoutExt = file.replace('.json', '').toLowerCase();
        if (fileNameWithoutExt === normalizedId) {
          const filePath = path.join(dirPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const product: CrawledProduct = JSON.parse(content);
          return {
            product,
            categoryId: config.id,
            categoryName: config.name,
          };
        }
      }
    } catch {
      // Directory doesn't exist, continue
    }
  }

  return null;
}

/**
 * GET /api/products/[id]
 * Returns a single product by model number
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await findProductById(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const { product, categoryId, categoryName } = result;
    const dashboardProduct = toDashboardProduct(product, categoryId, categoryName);

    return NextResponse.json({
      success: true,
      data: {
        product: dashboardProduct,
        rawData: product,
      },
    });
  } catch (error) {
    console.error('Error loading product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
