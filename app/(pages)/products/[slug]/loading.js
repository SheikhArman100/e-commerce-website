/**
 * Route-level loader: App Router streams this instantly while the server
 * page's `no-store` fetches (product + similars) resolve, so slug-to-slug
 * navigations show the gallery/info/similar skeletons instead of a blank
 * document. Mirrors the shop page's `loading.js` pattern.
 */
import { ProductDetailSkeleton } from "@/Components/Skeleton";

const ProductLoading = () => {
  return <ProductDetailSkeleton />;
};

export default ProductLoading;
