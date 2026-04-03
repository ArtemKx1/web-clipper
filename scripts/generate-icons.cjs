const fs = require('fs');
const path = require('path');

const { createCanvas, loadImage } = require('canvas');

const rootDir = path.join(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'icons');
const sourceIcon = path.join(rootDir, 'icon.png');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  if (!fs.existsSync(sourceIcon)) {
    console.error('icon.png not found at:', sourceIcon);
    process.exit(1);
  }

  const img = await loadImage(sourceIcon);
  
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;
  
  let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
  
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const idx = (y * img.width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (b < r + 15 || b < g + 15 || (r > 150 && g > 150)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  
  const padding = 40;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(img.width - 1, maxX + padding);
  maxY = Math.min(img.height - 1, maxY + padding);
  
  console.log(`Crop bounds: ${minX}, ${minY} to ${maxX}, ${maxY}`);
  
  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  const iconSize = Math.max(contentWidth, contentHeight);
  
  console.log(`Content size: ${contentWidth}x${contentHeight}, icon area: ${iconSize}x${iconSize}`);

  const sizes = [16, 48, 128];

  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, size, size);
    
    const tempCanvas = createCanvas(maxX - minX + 1, maxY - minY + 1);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, minX, minY, maxX - minX + 1, maxY - minY + 1, 0, 0, maxX - minX + 1, maxY - minY + 1);
    
    const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imgData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const brightness = (r + g + b) / 3;
      const maxVal = Math.max(r, g, b);
      const saturation = maxVal === 0 ? 0 : (maxVal - Math.min(r, g, b)) / maxVal;
      
      if (b > r + 10 && b > g + 10 && saturation > 0.5) {
        pixels[i + 3] = 0;
      }
    }
    
    tempCtx.putImageData(imgData, 0, 0);
    
    const scale = size / iconSize;
    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;
    const offsetX = (size - scaledWidth) / 2;
    const offsetY = (size - scaledHeight) / 2;
    
    ctx.drawImage(tempCanvas, offsetX, offsetY, scaledWidth, scaledHeight);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
    console.log(`Created icon${size}.png (${size}x${size})`);
  }

  console.log('Done!');
}

generateIcons().catch(console.error);
