"use client";

import { PackageSearch } from "lucide-react";
import Image from "next/image.js";
import { useState } from "react";

/**
 * A product-variant thumbnail that can never break the layout.
 *
 * Three states, in order of preference:
 *   1. the variant's own image from the file server,
 *   2. a flavour-tinted, flavour-marked placeholder when there is no image row
 *      (every seeded product is in this state — `images` is `[]`),
 *   3. the same placeholder when the file server 404s, thanks to the `onError`
 *      fallback.
 *
 * The order archive grew this pattern first; the cart and the check-out rail
 * share it here so a missing photo degrades identically on every page. The
 * caller owns the box size (`className`, e.g. `w-20 md:w-24`) and may add a
 * `badge` (the quantity pill) on top.
 */
const softTint = (color) =>
  /^#[0-9a-fA-F]{6}$/.test(color ?? "") ? `${color}14` : null;

const ProductThumb = ({
  path,
  alt,
  flavorColor,
  sizes = "64px",
  className = "",
  badge = null,
}) => {
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(path) && !imageFailed;
  const tint = softTint(flavorColor);

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-textColor/10 bg-white shadow-inner transition-colors group-hover/item:border-accentColor/30">
        {showImage ? (
          <Image
            src={`${fileBase}/${path}`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover/item:scale-110"
            alt={alt || "Product image"}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center"
            style={tint ? { backgroundColor: tint } : undefined}
          >
            <PackageSearch
              size={16}
              style={{ color: flavorColor || "#9B2242", opacity: 0.55 }}
            />
          </span>
        )}
      </div>

      {badge}
    </div>
  );
};

export default ProductThumb;
