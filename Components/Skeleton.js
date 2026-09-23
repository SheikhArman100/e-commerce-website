/**
 * Skeleton loaders for the shop (products) and product-detail pages.
 *
 * SSR already delivers the heading, chips, filter pills and the first grid
 * server-side, so the only states left that can pend are URL navigations: the
 * grid skeleton (mirrors <Card>'s exact box and the grid's column classes)
 * shows while a filter/search/page change streams in, base/product blocks back
 * the mobile result-count pill, and the detail skeletons below mirror
 * ProductClient's gallery / info / similar-grids so route transitions land
 * without shifting the layout. `animate-pulse` is a core Tailwind utility;
 * decorative blocks are `aria-hidden` while their container announces itself
 * via `role="status"` + sr-only text.
 */

/** Base shimmering block. */
export const Skeleton = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-textColor/10 ${className}`}
  />
);

/**
 * One card placeholder with <Card />'s exact outer box
 * (h-64/w-[10.5rem] … md:h-80/md:w-64) and CardContainer's column layout:
 * category circle + flavour dots on top, image block in the middle, title and
 * price lines at the bottom — the same areas <Card /> fills.
 */
export const ProductCardSkeleton = () => (
  <div className="relative h-64 w-[10.5rem] rounded-sm border border-textColor/10 bg-white p-2 shadow-sm sm:h-72 sm:w-60 sm:p-3 md:h-80 md:w-64">
    <div className="relative flex h-full w-full flex-col items-center justify-between py-3">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
        <div className="flex gap-x-1">
          <Skeleton className="h-2 w-2 rounded-full sm:h-3 sm:w-3" />
          <Skeleton className="h-2 w-2 rounded-full sm:h-3 sm:w-3" />
          <Skeleton className="h-2 w-2 rounded-full sm:h-3 sm:w-3" />
        </div>
      </div>
      <Skeleton className="h-28 w-28 rounded-2xl md:h-40 md:w-44" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-3.5 w-32 sm:w-40" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * Grid of card placeholders using the product grid's exact column classes, so
 * the first row lands precisely where the real cards will.
 */
export const ProductGridSkeleton = ({ count = 12 }) => (
  <div
    role="status"
    className="relative z-10 flex w-full flex-col items-center"
  >
    <span className="sr-only">Loading delicacies...</span>
    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 place-items-center sm:gap-8 md:grid-cols-3 md:gap-12 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Product-detail loader: mirrors ProductClient's two pillars — the gallery
 * card (aspect box + thumbnails) on the left, the info column (breadcrumb,
 * title, price, flavours, sizes, CTA, accordions) on the right — plus the
 * 4-up "Similar Specialties" row, each reusing ProductCardSkeleton's exact
 * <Card> box.
 */
export const ProductDetailSkeleton = () => (
  <div
    role="status"
    className="relative w-full bg-bgColor pt-24"
  >
    <span className="sr-only">Loading delicacy...</span>
    <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
      <Skeleton className="mb-12 h-4 w-44" />
      <div className="flex flex-col gap-x-16 lg:flex-row xl:gap-x-24">
        <div className="w-full lg:w-1/2 xl:w-[55%]">
          <Skeleton className="mx-auto aspect-[4/5] max-h-[750px] w-full rounded-[2.5rem] sm:aspect-square md:rounded-[3.5rem]" />
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
            <Skeleton className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
            <Skeleton className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-5 pt-12 lg:w-1/2 lg:pt-24 xl:w-[45%]">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32 rounded-sm" />
            <Skeleton className="h-12 w-32 rounded-sm" />
          </div>
          <Skeleton className="h-12 w-full max-w-sm rounded-sm" />
        </div>
      </div>
      <div className="mt-32 grid grid-cols-2 gap-8 border-t border-textColor/10 pt-24 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

