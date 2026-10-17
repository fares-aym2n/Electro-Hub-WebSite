export interface FlyToCartOptions {
  imageSrc?: string;
  sourceElement?: HTMLElement | null;
  startRect?: { left: number; top: number; width: number; height: number } | null;
  onArrive?: () => void;
}

/**
 * Lightweight, ultra-fast Add to Cart flight animation (~240ms).
 * Smoothly projects a compact thumbnail toward the header cart icon
 * with a quick shrink and opacity fade, followed by a subtle cart bounce.
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

  let targetCenterX = window.innerWidth - 44;
  let targetCenterY = 32;

  if (targetElement) {
    const tRect = targetElement.getBoundingClientRect();
    if (tRect.width > 0 && tRect.height > 0) {
      targetCenterX = tRect.left + tRect.width / 2;
      targetCenterY = tRect.top + tRect.height / 2;
    }
  }

  // 3. Determine start coordinates and dimensions
  let sLeft = window.innerWidth / 2 - 25;
  let sTop = window.innerHeight / 2 - 25;
  let sWidth = 50;
  let sHeight = 50;

  if (sourceElement && sourceElement.isConnected) {
    const sRect = sourceElement.getBoundingClientRect();
    if (sRect.width > 0 && sRect.height > 0) {
      sLeft = sRect.left;
      sTop = sRect.top;
      sWidth = sRect.width;
      sHeight = sRect.height;
    }
  } else if (startRect && startRect.width > 0 && startRect.height > 0) {
    sLeft = startRect.left;
    sTop = startRect.top;
    sWidth = startRect.width;
    sHeight = startRect.height;
  }

  const startCenterX = sLeft + sWidth / 2;
  const startCenterY = sTop + sHeight / 2;
  const deltaX = targetCenterX - startCenterX;
  const deltaY = targetCenterY - startCenterY;

  // 4. Create floating animated product clone element (compact 50x50)
  const clone = document.createElement('div');
  clone.className = 'electro-flying-product';
  clone.style.position = 'fixed';
  clone.style.left = `${startCenterX - 25}px`;
  clone.style.top = `${startCenterY - 25}px`;
  clone.style.width = '50px';
  clone.style.height = '50px';
  clone.style.zIndex = '99999';
  clone.style.pointerEvents = 'none';
  clone.style.userSelect = 'none';
  clone.style.borderRadius = '12px';
  clone.style.overflow = 'hidden';
  clone.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.18)';
  clone.style.border = '1.5px solid #CCA893';
  clone.style.backgroundColor = '#FAF6F2';
  clone.style.display = 'flex';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';
  clone.style.padding = '4px';
  clone.style.willChange = 'transform, opacity';

  const img = document.createElement('img');
  img.src =
    imageSrc ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';
  img.alt = '';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  clone.appendChild(img);

  document.body.appendChild(clone);

  // 5. Generate lightweight, responsive 3-point keyframes (approx 240ms duration)
  const midX = deltaX * 0.52;
  // Natural subtle upward toss (20px to 45px depending on horizontal travel)
  const arcLift = Math.min(45, Math.max(18, Math.abs(deltaX) * 0.08));
  const midY = deltaY * 0.5 - arcLift;
  const tilt = (deltaX >= 0 ? 15 : -15);

  const keyframes: Keyframe[] = [
    {
      transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
      opacity: 1,
    },
    {
      transform: `translate3d(${midX}px, ${midY}px, 0) scale(0.65) rotate(${tilt}deg)`,
      opacity: 0.92,
      offset: 0.55,
    },
    {
      transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.12) rotate(${tilt * 1.5}deg)`,
      opacity: 0,
    },
  ];

  const duration = 240; // 240 milliseconds - fast, crisp, snappy

  let isCleanedUp = false;
  const cleanup = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
    onArrive?.();
  };

  try {
    const anim = clone.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
      fill: 'forwards',
    });

    anim.onfinish = cleanup;
    anim.oncancel = cleanup;
  } catch {
    cleanup();
  }

  // Safety failsafe: always remove DOM element within 300ms
  setTimeout(cleanup, duration + 60);
}
