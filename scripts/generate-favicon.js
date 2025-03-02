const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Colors matching the UDelaWhere theme
const BLUE_BG = '#001B3D';
const YELLOW = '#FFD200';

// Create favicon (16x16)
function createFavicon() {
  const canvas = createCanvas(16, 16);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = BLUE_BG;
  ctx.fillRect(0, 0, 16, 16);
  
  // Question mark
  ctx.fillStyle = YELLOW;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', 8, 8);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), buffer);
  console.log('Favicon created at public/favicon.png');
}

// Create larger app icons
function createAppIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = BLUE_BG;
  ctx.fillRect(0, 0, size, size);
  
  // Two question marks
  ctx.fillStyle = YELLOW;
  const fontSize = Math.floor(size * 0.6);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw two question marks side by side
  ctx.fillText('?', size * 0.35, size * 0.5);
  ctx.fillText('?', size * 0.65, size * 0.5);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, `../public/logo${size}.png`), buffer);
  console.log(`App icon created at public/logo${size}.png`);
}

// Create all icons
createFavicon();
createAppIcon(192);
createAppIcon(512);

console.log('Done generating favicon and app icons!'); 