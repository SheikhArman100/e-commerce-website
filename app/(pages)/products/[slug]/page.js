
import ProductClient from "./ProductClient";

async function getProduct(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/slug/${slug}`, {
      cache: 'no-store'
    });
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

async function getSimilarProducts(categoryId, productId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product?categoryId=${categoryId}&limit=5`, {
      cache: 'no-store'
    });
    const result = await res.json();
    // Filter out the current product
    return result.data?.filter(p => p.id !== productId).slice(0, 4) || [];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

const ProductPage = async ({ params }) => {
  const { slug } = params;
  const product = await getProduct(slug);
  
  if (!product) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-bgColor pt-32">
        <div className="text-center">
          <h2 className="text-4xl text-accentColor font-bold mb-4">Item Not Found</h2>
          <p className="text-white/60">The delicacy you're looking for seems to have vanished.</p>
        </div>
      </section>
    );
  }

  const similarProducts = await getSimilarProducts(product.category?.id, product.id);
  
  return (
    <>
      <ProductClient 
        product={product} 
        similarProducts={similarProducts} 
      />
    </>
  );
};

export default ProductPage;
