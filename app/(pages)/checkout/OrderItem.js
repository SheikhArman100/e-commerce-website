import Image from "next/image.js";

const OrderItem = ({
  image,
  title,
  category,
  flavor,
  size,
  quantity,
  price,
}) => {
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  return (
    <div className="w-full flex items-center gap-x-6 py-4 group first:pt-0">
      {/* Small Boutique Thumb */}
      <div className="relative">
        <div className="relative w-16 aspect-square bg-white shadow-inner overflow-hidden rounded-sm border border-stone-200 group-hover:border-accentColor/40 transition-colors">
          {image ? (
            <Image
              src={`${fileBase}/${image}`}
              fill
              sizes="64px"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              alt={title || "Product Image"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 italic text-[0.5rem] text-stone-400">No Image</div>
          )}
        </div>
        
        {/* Quantity Badge */}
        <div className="absolute -top-1.5 -right-1.5 bg-accentColor h-5 w-5 text-[0.55rem] font-black rounded-full flex items-center justify-center text-bgColor shadow-lg z-10">
          {quantity}
        </div>
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h5 className="text-[0.7rem] uppercase tracking-widest text-textColor font-bold leading-tight line-clamp-1 mb-1">{title}</h5>
        <div className="flex items-center gap-3">
          <span className="text-[0.55rem] uppercase tracking-widest text-stone-500 font-bold">{category}</span>
          {flavor && (
            <span
              className="inline-block w-3 h-3 rounded-full border border-stone-300 flex-shrink-0"
              style={{ backgroundColor: flavor.color || '#ccc' }}
              title={flavor.name}
            />
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-[0.75rem] font-bold text-textColor tracking-widest">${(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};
export default OrderItem