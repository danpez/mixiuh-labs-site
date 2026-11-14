"use client";

import { PixelLightImage, type PixelLightImageProps } from "@mixiuh/pixel-ui";
import { lightCover } from "@/data/covers";

/**
 * A cover listed in src/data/covers.ts: downloads its light AVIF twin and keeps the
 * original as the fallback for browsers that cannot show AVIF.
 */
export function CoverImage(props: Omit<PixelLightImageProps, "light">) {
  // The key gives every cover its own attempt at the light file; data-cover is how
  // the e2e suite finds the covers (e2e/home-covers.spec.ts).
  return <PixelLightImage key={props.src} data-cover="" {...props} light={lightCover(props.src)} />;
}
