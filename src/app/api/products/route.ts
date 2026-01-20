import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  CrawledProduct,
  DashboardProduct,
  ProductCategoryId,
  ProductCategoryInfo,
  toDashboardProduct,
  isValidCrawledProduct,
} from '@/types/crawled-product';

// Base path for product data (in public/data directory)
const DATA_BASE_PATH = path.join(process.cwd(), 'public', 'data');

// Category configuration mapping directory names to category info
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
 * Read all JSON files from a directory
 */
async function readProductsFromDirectory(
  dirPath: string,
  categoryId: ProductCategoryId,
  categoryName: string
): Promise<DashboardProduct[]> {
  const products: DashboardProduct[] = [];

  try {
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    for (const file of jsonFiles) {
      // Skip known non-product files
      if (file === 'manifest.json' || file === 'all-urls.json' || file.startsWith('_')) {
        continue;
      }

      try {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);

        // Validate the parsed JSON is a valid product
        if (!isValidCrawledProduct(parsed)) {
          // Skip non-product JSON files silently
          continue;
        }

        const dashboardProduct = toDashboardProduct(
          parsed,
          categoryId,
          categoryName
        );
        products.push(dashboardProduct);
      } catch (err) {
        console.error(`Error reading product file ${file}:`, err);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }

  return products;
}

/**
 * Get all products from all category directories
 */
async function getAllProducts(): Promise<{
  products: DashboardProduct[];
  categories: ProductCategoryInfo[];
}> {
  const allProducts: DashboardProduct[] = [];
  const categories: ProductCategoryInfo[] = [];

  for (const [dirName, config] of Object.entries(CATEGORY_CONFIG)) {
    const dirPath = path.join(DATA_BASE_PATH, dirName);

    try {
      await fs.access(dirPath);
      const products = await readProductsFromDirectory(
        dirPath,
        config.id,
        config.name
      );

      if (products.length > 0) {
        allProducts.push(...products);
        categories.push({
          id: config.id,
          name: config.name,
          dataDir: dirName,
          count: products.length,
        });
      }
    } catch {
      // Directory doesn't exist, skip
      console.log(`Directory ${dirName} not found, skipping`);
    }
  }

  // Sort products by category name, then by title
  allProducts.sort((a, b) => {
    if (a.categoryName !== b.categoryName) {
      return a.categoryName.localeCompare(b.categoryName);
    }
    return a.title.localeCompare(b.title);
  });

  // Sort categories by count (descending)
  categories.sort((a, b) => b.count - a.count);

  return { products: allProducts, categories };
}

/**
 * GET /api/products
 * Returns all products from all category directories
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const { products, categories } = await getAllProducts();

    let filteredProducts = products;

    // Filter by category if specified
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter((p) => p.category === category);
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.modelNumber.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        products: filteredProducts,
        categories,
        total: products.length,
        filtered: filteredProducts.length,
      },
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
