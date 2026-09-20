const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'dist');
const storefrontDist = path.join(rootDir, 'E-commerce-main', 'dist');
const dashboardDir = path.join(rootDir, 'E-commerce-dashboard');

console.log('🚀 Starting Vercel deployment build...');

// Clean and create dist directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 1. Copy storefront distribution to root dist
if (fs.existsSync(storefrontDist)) {
  console.log('📦 Copying storefront files to /dist...');
  fs.cpSync(storefrontDist, outputDir, { recursive: true });
} else {
  console.error('❌ Storefront dist folder not found at:', storefrontDist);
  process.exit(1);
}

// 2. Copy dashboard to output/dashboard
if (fs.existsSync(dashboardDir)) {
  const targetDashboard = path.join(outputDir, 'dashboard');
  console.log('📦 Copying dashboard to /dist/dashboard...');
  fs.cpSync(dashboardDir, targetDashboard, { recursive: true });
}

// 3. Generate static API fallbacks in /dist/api
const apiOutputDir = path.join(outputDir, 'api');
if (!fs.existsSync(apiOutputDir)) {
  fs.mkdirSync(apiOutputDir, { recursive: true });
}

const productsJsonPath = path.join(storefrontDist, 'data', 'products.json');
const categoriesJsonPath = path.join(storefrontDist, 'data', 'categories.json');

if (fs.existsSync(productsJsonPath)) {
  const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  
  // Static /api/products response
  fs.writeFileSync(path.join(apiOutputDir, 'products.json'), JSON.stringify(productsData));
  fs.writeFileSync(path.join(apiOutputDir, 'products'), JSON.stringify(productsData));

  // Static /api/sellers response
  const sellersData = { success: true, sellers: productsData.sellers || [] };
  fs.writeFileSync(path.join(apiOutputDir, 'sellers.json'), JSON.stringify(sellersData));
  fs.writeFileSync(path.join(apiOutputDir, 'sellers'), JSON.stringify(sellersData));
}

if (fs.existsSync(categoriesJsonPath)) {
  const categoriesData = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf8'));
  
  // Static /api/categories response
  fs.writeFileSync(path.join(apiOutputDir, 'categories.json'), JSON.stringify(categoriesData));
  fs.writeFileSync(path.join(apiOutputDir, 'categories'), JSON.stringify(categoriesData));
}

// Health check response
const healthData = { status: 'ok', service: 'E-Commerce Central Backend' };
fs.writeFileSync(path.join(apiOutputDir, 'health.json'), JSON.stringify(healthData));
fs.writeFileSync(path.join(apiOutputDir, 'health'), JSON.stringify(healthData));

console.log('✅ Build complete! All static files and API fallbacks ready in /dist');
