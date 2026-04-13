import Image from "next/image.js";


const OrderList= ({
    orderId,
     totalAmount, status, createdAt, items = []
  }) => {
    const date = new Date(createdAt).toLocaleDateString("en-US", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Ensure orderId is treated as string for slicing logic
    const idString = String(orderId || "");
    const shortId = idString.length > 15 ? idString.slice(0, 15) + "..." : idString;
    
    // Attempt to find a representative image from the first item
    // Since current JSON doesn't have it, we'll be extremely safe
    const firstItem = items[0];
    const imagePath = firstItem?.product?.images?.[0] || "/assets/cakeIcon.svg"; // Fallback to a known asset

    return (
      <div className="w-full h-fit flex items-center gap-x-4 py-4 border-b border-textColor/10 last:border-none">
        <div className="relative w-[3.5rem] md:w-[4.5rem] aspect-square p-1 sm:p-2 border border-accentColor2 rounded-lg bg-white/50">
          <div className="h-full w-full relative">
            <Image
              src={imagePath}
              fill
              sizes="72px"
              className="h-full w-full object-cover rounded-lg"
              alt={`Order ${shortId}`}
            />
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col justify-between">
          <div className="flex flex-col items-start ">
            <h5 className="text-sm font-bold text-textColor text-eclipse uppercase tracking-tight">Order #{shortId}</h5>
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">{date}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((item, index)=>(
              <span key={index} className="px-2 py-0.5 text-[10px] font-bold border border-textColor/10 text-textColor bg-textColor/5 rounded-md uppercase tracking-tighter">
                {item.quantity}X {item.productTitle || item.product?.title}
              </span>
            ))}
          </div>
        </div>
        <div className="h-full flex flex-col justify-between items-center gap-y-3">
          <p className="text-sm font-bold text-accentColor font2">৳{totalAmount}</p>
          <div className={`flex gap-x-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            status === "Completed" || status === "Delivered" ? "bg-accentColor/10 text-accentColor border-accentColor/20" : 
            status === "Cancelled" ? "bg-red-50 text-red-600 border-red-200" : 
            "bg-accentColor2/20 text-accentColor border-accentColor2/30"
          } `}>
            {status}
          </div>
        </div>
      </div>
    );
  };

export default OrderList