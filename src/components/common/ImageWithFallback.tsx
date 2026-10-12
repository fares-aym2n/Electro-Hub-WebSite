import { useState } from 'react';
import type { FC, ImgHTMLAttributes } from 'react';
import { Cpu } from 'lucide-react';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  category?: string;
}

export const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  category,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 text-slate-400 p-6 ${className}`}
      >
        <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold text-center">
          {alt || 'Hardware Component'}
        </span>
        {category && (
          <span className="text-[11px] text-cyan-400/80 font-mono mt-1">{category}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800/40 animate-pulse flex items-center justify-center">
          <Cpu className="w-6 h-6 text-slate-500 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
