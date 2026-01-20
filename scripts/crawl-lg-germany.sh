#!/bin/bash

# LGAIP Crawler Script for LG Germany Website
# Uses agent-browser (Playwright-based) to crawl product data
#
# Usage: ./crawl-lg-germany.sh [category] [output_dir]
# Example: ./crawl-lg-germany.sh tv ./data/products

set -e

CATEGORY=${1:-"tv"}
OUTPUT_DIR=${2:-"./data/crawled"}
BASE_URL="https://www.lg.com/de"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$OUTPUT_DIR"

echo "==================================================="
echo "LGAIP Crawler - LG Germany"
echo "Category: $CATEGORY"
echo "Output: $OUTPUT_DIR"
echo "Timestamp: $TIMESTAMP"
echo "==================================================="

# Function to crawl a single product page
crawl_product() {
    local product_url="$1"
    local output_file="$2"

    echo "Crawling: $product_url"

    # Open the product page
    agent-browser open "$product_url"

    # Wait for page to fully load
    agent-browser wait --load networkidle
    agent-browser wait 2000

    # Get full page snapshot as JSON
    agent-browser snapshot --json > "${output_file}_snapshot.json"

    # Take screenshots
    agent-browser screenshot --full "${output_file}_full.png"

    # Extract product title
    echo "Extracting product data..."

    # Get structured data (JSON-LD)
    agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('script[type=\"application/ld+json\"]')).map(s => JSON.parse(s.textContent)))" > "${output_file}_jsonld.json" 2>/dev/null || echo "[]" > "${output_file}_jsonld.json"

    # Get meta tags
    agent-browser eval "JSON.stringify({title: document.title, description: document.querySelector('meta[name=\"description\"]')?.content, keywords: document.querySelector('meta[name=\"keywords\"]')?.content})" > "${output_file}_meta.json" 2>/dev/null || echo "{}" > "${output_file}_meta.json"

    # Get all images
    agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('img')).map(img => ({src: img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight})))" > "${output_file}_images.json" 2>/dev/null || echo "[]" > "${output_file}_images.json"

    echo "Completed: $product_url"
}

# Function to get product listing for a category
get_category_products() {
    local category="$1"
    local category_url="${BASE_URL}/${category}"

    echo "Fetching product listing from: $category_url"

    # Open category page
    agent-browser open "$category_url"
    agent-browser wait --load networkidle
    agent-browser wait 3000

    # Take category screenshot
    agent-browser screenshot --full "${OUTPUT_DIR}/category_${category}_${TIMESTAMP}.png"

    # Get product links
    agent-browser snapshot -i --json > "${OUTPUT_DIR}/category_${category}_snapshot.json"

    # Extract product URLs (this will need to be parsed)
    agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('a[href*=\"/de/\"]')).filter(a => a.href.includes('/produkte/') || a.href.includes('/product/')).map(a => ({href: a.href, text: a.textContent?.trim()})))" > "${OUTPUT_DIR}/category_${category}_links.json" 2>/dev/null || echo "[]" > "${OUTPUT_DIR}/category_${category}_links.json"
}

# Main execution
echo ""
echo "Step 1: Getting category product listing..."
get_category_products "$CATEGORY"

echo ""
echo "Step 2: Crawling complete!"
echo "Output saved to: $OUTPUT_DIR"
echo ""

# Close browser session
agent-browser close 2>/dev/null || true

echo "Crawler finished at $(date)"
