export interface FlyToCartOptions {
  imageSrc?: string;
  sourceElement?: HTMLElement | null;
  startRect?: { left: number; top: number; width: number; height: number } | null;
  onArrive?: () => void;
}

/**
 * Slick, noticeable, and snappy Add to Cart flying animation (~460ms).
 * Features an initial playful pop, an elegant parabolic arc towards the cart,
 * a smooth shrink into the basket, and a juicy cart bounce upon arrival.
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
  let sLeft = window.innerWidth / 2 - 34;
  let sTop = window.innerHeight / 2 - 34;
  let sWidth = 68;
  let sHeight = 68;

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

  // 4. Create floating animated product clone element (noticeable 68x68 thumbnail)
  const clone = document.createElement('div');
  clone.className = 'electro-flying-product';
  clone.style.position = 'fixed';
  clone.style.left = `${startCenterX - 34}px`;
  clone.style.top = `${startCenterY - 34}px`;
  clone.style.width = '68px';
  clone.style.height = '68px';
  clone.style.zIndex = '99999';
  clone.style.pointerEvents = 'none';
  clone.style.userSelect = 'none';
  clone.style.borderRadius = '16px';
  clone.style.overflow = 'hidden';
  clone.style.boxShadow =
    '0 14px 30px -4px rgba(196, 155, 130, 0.45), 0 6px 14px rgba(0, 0, 0, 0.12)';
  clone.style.border = '2px solid #C49B82';
  clone.style.backgroundColor = '#FAF6F2';
  clone.style.display = 'flex';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';
  clone.style.padding = '5px';
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

  // 5. Generate slick 5-point trajectory with initial pop and curved arc (~460ms)
  const midX = deltaX * 0.54;
  // Upward arc height for natural physics
  const arcLift = Math.min(80, Math.max(35, Math.abs(deltaX) * 0.12 + 20));
  const midY = deltaY * 0.5 - arcLift;
  const tilt = deltaX >= 0 ? 16 : -16;

  const keyframes: Keyframe[] = [
    // 0%: Origin
    {
      transform: 'translate3d(0, 0, 0) scale(0.92) rotate(0deg)',
      opacity: 0.9,
    },
    // 15%: Playful initial pop & lift to catch the user's attention immediately
    {
      transform: `translate3d(${deltaX * 0.08}px, ${-arcLift * 0.35}px, 0) scale(1.1) rotate(${tilt * 0.3}deg)`,
      opacity: 1,
      offset: 0.15,
    },
    // 55%: Gliding along graceful upward arc
    {
      transform: `translate3d(${midX}px, ${midY}px, 0) scale(0.82) rotate(${tilt}deg)`,
      opacity: 0.98,
      offset: 0.55,
    },
    // 85%: Accelerating toward the cart basket
    {
      transform: `translate3d(${deltaX * 0.88}px, ${deltaY * 0.88 - arcLift * 0.15}px, 0) scale(0.38) rotate(${tilt * 1.3}deg)`,
      opacity: 0.85,
      offset: 0.85,
    },
    // 100%: Sinks right into the cart icon
    {
      transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.08) rotate(${tilt * 1.6}deg)`,
      opacity: 0,
    },
  ];

  const duration = 460; // 460ms: sweet spot between fast and satisfyingly noticeable

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
      easing: 'cubic-bezier(0.2, 0.85, 0.3, 1)',
      fill: 'forwards',
    });

    anim.onfinish = cleanup;
    anim.oncancel = cleanup;
  } catch {
    cleanup();
  }

  // Safety failsafe: always remove DOM element within 550ms
  setTimeout(cleanup, duration + 90);
}
