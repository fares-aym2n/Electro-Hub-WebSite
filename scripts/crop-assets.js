import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function cropAssets() {
  const assetsDir = path.resolve('public/assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const refDir = path.resolve('public/references');

  console.log('Extracting assets from reference designs...');

  // 1. Main headphone from product-details.jpg
  // Card area is approx x: 96, y: 78, width: 345, height: 410
  await sharp(path.join(refDir, 'product-details.jpg'))
    .extract({ left: 96, top: 78, width: 345, height: 410 })
    .toFile(path.join(assetsDir, 'sony-main.jpg'));
  console.log('Extracted sony-main.jpg');

  // 2. Thumbnails from product-details.jpg
  // Thumbnails are on the left: x: 23, width: 62. Each card is height: 62
  const thumbTops = [88, 166, 244, 322, 400];
  for (let i = 0; i < thumbTops.length; i++) {
    await sharp(path.join(refDir, 'product-details.jpg'))
      .extract({ left: 23, top: thumbTops[i], width: 62, height: 62 })
      .toFile(path.join(assetsDir, `sony-thumb-${i + 1}.jpg`));
    console.log(`Extracted sony-thumb-${i + 1}.jpg`);
  }

  // 3. Desk image from sign-up.jpg
  // Left image is at left: 0, top: 215, width: 535, height: 305
  await sharp(path.join(refDir, 'sign-up.jpg'))
    .extract({ left: 0, top: 215, width: 535, height: 305 })
    .toFile(path.join(assetsDir, 'signup-desk.jpg'));
  console.log('Extracted signup-desk.jpg');

  // 4. Desk image from sign-in.jpg
  // Left image is at left: 0, top: 55, width: 466, height: 465
  await sharp(path.join(refDir, 'sign-in.jpg'))
    .extract({ left: 0, top: 55, width: 466, height: 465 })
    .toFile(path.join(assetsDir, 'signin-desk.jpg'));
  console.log('Extracted signin-desk.jpg');

  // 5. Headphone on stone pedestal from checkout.jpg
  // Center image is at left: 428, top: 55, width: 285, height: 465
  await sharp(path.join(refDir, 'checkout.jpg'))
    .extract({ left: 428, top: 55, width: 285, height: 465 })
    .toFile(path.join(assetsDir, 'checkout-pedestal.jpg'));
  console.log('Extracted checkout-pedestal.jpg');

  // 6. Review card headphone image from write-review.jpg
  // Left card is at left: 46, top: 80, width: 295, height: 408
  await sharp(path.join(refDir, 'write-review.jpg'))
    .extract({ left: 46, top: 80, width: 295, height: 408 })
    .toFile(path.join(assetsDir, 'review-card.jpg'));
  console.log('Extracted review-card.jpg');

  // 7. Small checkout thumbnail
  await sharp(path.join(refDir, 'checkout.jpg'))
    .extract({ left: 745, top: 135, width: 62, height: 68 })
    .toFile(path.join(assetsDir, 'checkout-item-thumb.jpg'));
  console.log('Extracted checkout-item-thumb.jpg');
}

cropAssets().catch(console.error);
