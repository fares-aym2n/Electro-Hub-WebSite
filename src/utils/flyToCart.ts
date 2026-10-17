export interface FlyToCartOptions {
  imageSrc?: string;
  sourceElement?: HTMLElement | null;
  startRect?: { left: number; top: number; width: number; height: number } | null;
  onArrive?: () => void;
}

/**
 * Triggers a professional flying-product animation that captures the product thumbnail
 * and animates it along a parabolic curved trajectory directly into the header shopping cart icon.
 */
export function flyProductToCart({
  imageSrc,
  sourceElement,
  startRect,
  onArrive,
}: FlyToCartOptions): void {
  if (typeof window === 'undefined') return;

  // 1. Accessibility: Respect prefers-reduced-motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    onArrive?.();
    return;
  }

  // 2. Identify the active visible header cart icon
  const isMobile = window.innerWidth < 768;
  const preferredTarget = isMobile
    ? document.querySelector<HTMLElement>('[data-header-cart-target="mobile"]')
    : document.querySelector<HTMLElement>('[data-header-cart-target="desktop"]');
  const targetElement =
    preferredTarget ||
    document.querySelector<HTMLElement>('[data-header-cart-target="desktop"]') ||
    document.querySelector<HTMLElement>('[data-header-cart-target="mobile"]') ||
    document.querySelector<HTMLElement>('[data-header-cart-icon="true"]');

  let targetX = window.innerWidth - 60;
  let targetY = 35;

  if (targetElement) {
    const tRect = targetElement.getBoundingClientRect();
    if (tRect.width > 0 && tRect.height > 0) {
      targetX = tRect.left + tRect.width / 2;
      targetY = tRect.top + tRect.height / 2;
    }
  }

  // 3. Determine start coordinates and dimensions
  let sLeft = window.innerWidth / 2 - 45;
  let sTop = window.innerHeight / 2 - 45;
  let sWidth = 90;
  let sHeight = 90;

  if (sourceElement && sourceElement.isConnected) {
    const sRect = sourceElement.getBoundingClientRect();
    if (sRect.width > 0 && sRect.height > 0) {
      sLeft = sRect.left;
      sTop = sRect.top;
      sWidth = Math.min(130, Math.max(60, sRect.width));
      sHeight = Math.min(130, Math.max(60, sRect.height));
    }
  } else if (startRect) {
    sLeft = startRect.left;
    sTop = startRect.top;
    sWidth = Math.min(130, Math.max(60, startRect.width));
    sHeight = Math.min(130, Math.max(60, startRect.height));
  }

  const startCenterX = sLeft + sWidth / 2;
  const startCenterY = sTop + sHeight / 2;
  const deltaX = targetX - startCenterX;
  const deltaY = targetY - startCenterY;

  // 4. Create floating animated product clone element
  const clone = document.createElement('div');
  clone.className = 'electro-flying-product';
  clone.style.position = 'fixed';
  clone.style.left = `${sLeft}px`;
  clone.style.top = `${sTop}px`;
  clone.style.width = `${sWidth}px`;
  clone.style.height = `${sHeight}px`;
  clone.style.zIndex = '99999';
  clone.style.pointerEvents = 'none';
  clone.style.userSelect = 'none';
  clone.style.borderRadius = '18px';
  clone.style.overflow = 'hidden';
  clone.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.22), 0 4px 14px rgba(196, 155, 130, 0.35)';
  clone.style.border = '2px solid rgba(196, 155, 130, 0.8)';
  clone.style.backgroundColor = '#FAF6F2';
  clone.style.display = 'flex';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';
  clone.style.padding = '6px';
  clone.style.willChange = 'transform, opacity';

  const img = document.createElement('img');
  img.src =
    imageSrc ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';
  img.alt = 'Flying product item';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  clone.appendChild(img);

  document.body.appendChild(clone);

  // 5. Generate smooth parabolic flight trajectory
  const steps = 30;
  const keyframes: Keyframe[] = [];
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  // Parabolic peak height: creates a natural upward toss arc before dropping into cart
  const arcHeight = Math.min(180, Math.max(70, distance * 0.16 + 40));

  for (let i = 0; i <= steps; i++) {
    const p = i / steps; // progress 0 -> 1
    // Smoothstep easing curve
    const easeP = p * p * (3 - 2 * p);
    const curX = deltaX * easeP;
    // Parabolic arc peaks around midway
    const arc = 4 * arcHeight * p * (1 - p);
    const curY = deltaY * easeP - arc;
    // Smooth shrinking down to 0.12 near cart entrance
    const scale = Math.max(0.1, 1 - 0.88 * Math.pow(p, 1.25));
    // Fade out as the item physically drops into the cart basket
    const opacity = p > 0.85 ? Math.max(0, (1 - p) / 0.15) : 1;
    // Dynamic tilt in direction of travel
    const rotation = (deltaX >= 0 ? 30 : -30) * Math.sin(p * Math.PI);

    keyframes.push({
      transform: `translate3d(${curX}px, ${curY}px, 0) scale(${scale}) rotate(${rotation}deg)`,
      opacity,
    });
  }

  // 6. Execute hardware-accelerated Web Animation
  const animationDuration = Math.min(850, Math.max(650, distance * 0.65));

  try {
    const anim = clone.animate(keyframes, {
      duration: animationDuration,
      easing: 'linear',
      fill: 'forwards',
    });

    anim.onfinish = () => {
      clone.remove();
      onArrive?.();
    };

    anim.oncancel = () => {
      clone.remove();
    };
  } catch {
    clone.remove();
    onArrive?.();
  }
}
