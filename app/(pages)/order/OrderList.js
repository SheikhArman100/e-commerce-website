import Image from "next/image.js";


const OrderList= ({
    orderId,
     totalAmount, status, createdAt, paymentMethod, product
  }) => {
    const date = new Date(createdAt).toLocaleDateString("en-US", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const shortId = orderId.length > 15 ? orderId.slice(0, 15) + "..." : orderId;
    return (
      <div className="w-full h-fit   flex items-center  gap-x-4  py-4 border-b border-textColor/10 last:border-none">
        <div className="relative w-[3.5rem] md:w-[4.5rem] aspect-square p-1 sm:p-2  border border-accentColor2 rounded-lg bg-white/50">
          <div className="h-full w-full relative">
            <Image
              src={product[0].product.images[1]}
              fill
              sizes="52px"
              className="h-full w-full object-cover rounded-lg"
              alt={orderId}
            />
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col justify-between">
          <div className="flex flex-col items-start ">
            <h5 className="text-sm font-bold text-textColor text-eclipse uppercase tracking-tight">{shortId}</h5>
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">{date}</p>
          </div>
          <div className="mt-1 flex flex-col w-fit gap-x-2">
            {product.map((productItem,index)=>(
              <span key={index} className="p-1 px-2 text-[10px] font-bold border border-textColor/10 text-textColor bg-textColor/5 rounded-md font2 uppercase tracking-tighter">
              {productItem.quantity}X {productItem.product.title}
            </span>

            ))}
            {/* <span className="p-1 text-xs font-semibold border border-gray-500 text-white rounded-lg font2">
              {flavor}
            </span>
            <span className="py-1 px-2 md:px-3 text-xs font-semibold border border-gray-500 text-white rounded-lg font2">
              {size}
            </span> */}
          </div>
        </div>
        <div className="h-full flex flex-col justify-between items-center gap-y-3  ">
          <p className="text-sm font-bold text-accentColor font2">৳{totalAmount}</p>
          <div className={`flex gap-x-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            status === "Completed" ? "bg-accentColor/10 text-accentColor border-accentColor/20" : 
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