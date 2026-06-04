"use client";

import { useState } from "react";
import { IMAGES, type ImgKey, type StopType } from "@/lib/itinerary";
import { TYPE_TOKENS } from "@/lib/theme";

interface StopImageProps {
  img?: ImgKey;
  type: StopType;
  alt: string;
  className?: string;
}

/**
 * Square thumbnail for a stop. Uses a plain <img> and, on load failure
 * (or when no img key is given), renders the stop type's pale tone
 * background with a centered emoji — so a stop never shows a broken image.
 */
export default function StopImage({
  img,
  type,
  alt,
  className = "",
}: StopImageProps) {
  const token = TYPE_TOKENS[type];
  const src = img ? IMAGES[img] : undefined;
  const [failed, setFailed] = useState(false);

  const showFallback = !src || failed;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl border border-line ${className}`}
      style={{ backgroundColor: token.tone }}
    >
      {showFallback ? (
        <div
          className="flex h-full w-full items-center justify-center"
          aria-label={alt}
          role="img"
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            {token.emoji}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
