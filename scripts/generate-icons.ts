import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Create a simple icon for PWA
function createIcon(size: number): Buffer {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Rounded rectangle
  const rectSize = size * 0.6;
  const x = (size - rectSize) / 2;
  const y = (size - rectSize) / 2;
  const radius = size * 0.08;

  ctx.fillStyle = '#e94560';
  ctx.beginPath();
  ctx.roundRect(x, y, rectSize, rectSize, radius);
  ctx.fill();

  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.25}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('QRF', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

// Generate icons
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 384, name: 'icon-384x384.png' },
];

const additionalIcons = [
  { size: 32, name: 'favicon-32x32.png', dir: 'public' },
  { size: 16, name: 'favicon-16x16.png', dir: 'public' },
  { size: 180, name: 'apple-touch-icon.png', dir: 'public' },
];

// Generate PWA icons
sizes.forEach(({ size, name }) => {
  const iconBuffer = createIcon(size);
  const iconPath = path.join(iconsDir, name);
  fs.writeFileSync(iconPath, iconBuffer);
  console.log(`Generated ${name}`);
});

// Generate additional icons
additionalIcons.forEach(({ size, name, dir }) => {
  const iconBuffer = createIcon(size);
  const iconPath = path.join(process.cwd(), dir, name);
  fs.writeFileSync(iconPath, iconBuffer);
  console.log(`Generated ${name}`);
});

console.log('All PWA icons generated successfully!');

export {};
