import DeleteButton from "@/Components/DeleteButton.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image.js";
import { toast } from "react-toastify";


const CartItem = ({
  cartId,
  image,
  title,
  category,
  flavor,
  size,
  quantity,
  price,
  originalPrice,
  discountPercentage
}) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const isDiscounted = discountPercentage > 0;

  const updateQuantityMutation = useMutation({
    mutationFn: async (newQuantity) => {
      const response = await axiosPrivate.patch(`cart/${cartId}`, { quantity: newQuantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  });

  const handleUpdateQuantity = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantityMutation.mutate(newQuantity);
    }
  };

  return (
    <div className="w-full h-fit flex items-center gap-x-6 py-6 border-b border-textColor/10 last:border-none group">
      {/* Thumbnail Wrapper */}
      <div className="relative">
        <div className="relative w-20 md:w-24 aspect-square bg-white shadow-inner overflow-hidden rounded-sm border border-textColor/10 group-hover:border-accentColor/30 transition-colors">
          {image ? (
            <Image
              src={`${fileBase}/${image}`}
              fill
              sizes="(max-width: 768px) 80px, 96px"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              alt={title || "Product Image"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 italic text-[0.6rem] text-stone-400">No Image</div>
          )}
        </div>
      </div>

      {/* Details Container */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="mb-2">
          <h5 className="text-[0.7rem] md:text-xs uppercase tracking-[0.2em] font-black text-textColor line-clamp-1 mb-1">
            {title}
          </h5>
          <p className="text-[0.6rem] uppercase tracking-widest font-medium text-stone-500">
            {category}
          </p>
        </div>

        {/* Selection Details */}
        <div className="flex flex-wrap items-center gap-6 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            {flavor && (
              <div className="flex items-center gap-x-2">
                <div 
                  className="h-2 w-2 rounded-full border border-textColor/20 shadow-sm"
                  style={{ backgroundColor: flavor.color || '#000' }}
                />
                <span className="text-[0.6rem] uppercase tracking-widest font-bold text-stone-500">
                  {flavor.name}
                </span>
              </div>
            )}
            
            {size && (
              <div className="flex items-center gap-x-2 before:content-[''] before:h-3 before:w-[1px] before:bg-textColor/10">
                <span className="text-[0.6rem] uppercase tracking-widest font-bold text-accentColor">
                  Size: {size}
                </span>
              </div>
            )}
          </div>

          {/* Premium Quantity Control */}
          <div className="flex items-center gap-x-4 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
            <button 
              onClick={() => handleUpdateQuantity(-1)}
              disabled={quantity <= 1 || updateQuantityMutation.isPending}
              className="text-stone-500 hover:text-white transition-colors disabled:opacity-20"
            >
              <Minus size={12} />
            </button>
            <span className={`text-[0.65rem] font-black tracking-widest w-4 text-center ${updateQuantityMutation.isPending ? 'text-accentColor animate-pulse' : 'text-stone-300'}`}>
              {quantity}
            </span>
            <button 
              onClick={() => handleUpdateQuantity(1)}
              disabled={quantity >= 10 || updateQuantityMutation.isPending}
              className="text-stone-500 hover:text-white transition-colors disabled:opacity-20"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="flex flex-col items-end gap-y-3 pl-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-white tracking-tighter">
            ${price?.toFixed(2)}
          </span>
          {isDiscounted && (
            <span className="text-[0.6rem] text-stone-500 line-through tracking-widest opacity-60">
              ${originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="opacity-40 hover:opacity-100 transition-opacity">
          <DeleteButton cartId={cartId} />
        </div>
      </div>
    </div>
  );
};

export default CartItem