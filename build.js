const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'dist');
const storefrontDist = path.join(rootDir, 'E-commerce-main', 'dist');
const dashboardDir = path.join(rootDir, 'E-commerce-dashboard');

console.log('🚀 Starting Vercel static build...');

// Clean and create dist directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 1. Copy storefront distribution to root dist
if (fs.existsSync(storefrontDist)) {
  console.log('📦 Copying storefront (E-commerce-main/dist) to output...');
  fs.cpSync(storefrontDist, outputDir, { recursive: true });
} else {
  console.error('❌ Storefront dist folder not found at:', storefrontDist);
  process.exit(1);
}

// 2. Copy dashboard to output/dashboard
if (fs.existsSync(dashboardDir)) {
  const targetDashboard = path.join(outputDir, 'dashboard');
  console.log('📦 Copying dashboard (E-commerce-dashboard) to /dashboard...');
  fs.cpSync(dashboardDir, targetDashboard, { recursive: true });
}

console.log('✅ Build successful! Output generated in /dist');
