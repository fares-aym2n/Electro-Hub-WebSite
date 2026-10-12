import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function run() {
  const refDir = path.resolve('public/references');
  const files = [
    'product-details.jpg',
    'sign-up.jpg',
    'sign-in.jpg',
    'checkout.jpg',
    'write-review.jpg'
  ];

  console.log('--- Image Dimensions ---');
  for (const file of files) {
    const filePath = path.join(refDir, file);
    const meta = await sharp(filePath).metadata();
    console.log(`${file}: ${meta.width} x ${meta.height}`);
  }

  // Sample colors from product-details.jpg
  // Header is at y=30, x=500
  // Background is at y=200, x=300
  // Card is at y=250, x=200
  // Button is at y=360, x=650
  // Price is at y=270, x=500
  const pdImage = sharp(path.join(refDir, 'product-details.jpg'));
  const { data, info } = await pdImage.raw().toBuffer({ resolveWithObject: true });

  function getHex(x, y) {
    const idx = (y * info.width + x) * info.channels;
    const r = data[idx].toString(16).padStart(2, '0');
    const g = data[idx + 1].toString(16).padStart(2, '0');
    const b = data[idx + 2].toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  console.log('\n--- Sampled Colors from product-details.jpg (width: ' + info.width + ', height: ' + info.height + ') ---');
  console.log('Header Background (x=500, y=25):', getHex(500, 25));
  console.log('Page Background (x=500, y=100):', getHex(500, 100));
  console.log('Product Card Box (x=250, y=200):', getHex(250, 200));
  console.log('Thumbnail Box (x=50, y=200):', getHex(50, 200));
  console.log('Add To Cart Button (x=650, y=365):', getHex(650, 365));
  console.log('Price Text (x=500, y=268):', getHex(500, 268));
  console.log('Footer Background (x=500, y=550):', getHex(500, 550));
}

run().catch(console.error);
