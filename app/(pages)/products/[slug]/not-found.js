import Link from "next/link";

const ProductNotFound = () => {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-bgColor pt-32">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-accentColor">
          Item Not Found
        </h2>
        <p className="mb-6 text-textColor/60">
          The delicacy seems to have vanished.
        </p>
        <Link
          href="/products"
          className="text-sm font-bold uppercase tracking-[0.2em] text-accentColor hover:underline"
        >
          Back to Collections
        </Link>
      </div>
    </section>
  );
};

export default ProductNotFound;