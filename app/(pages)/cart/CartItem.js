"use client";

import DeleteButton from "@/Components/DeleteButton.js";
import ProductThumb from "@/Components/ProductThumb.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import {
  LOW_STOCK_THRESHOLD,
  MAX_ITEM_QUANTITY,
  cartItemCount,
  cartSubtotal,
  formatTaka,
  isItemDiscounted,
  itemDiscountPercentage,
  itemStock,
  lineTotal,
  listPrice,
  unitPrice,
} from "@/libs/orderTotals.js";
import { cn } from "@/libs/utils.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import Link from "next/link.js";
import { toast } from "react-toastify";

/**
 * One line of the selection.
 *
 * Everything shown comes from the API's own cart payload: the resolved variant
 * (`productFlavorSize` → flavour, size, `price`, `stock`, images) and the TWO
 * prices — `originalPrice` (untouched variant price) and `salesPrice` (lowest
 * campaign-aware price). The strike-through therefore keys off
 * `salesPrice < originalPrice` instead of a `discountPercentage` field the cart
 * endpoint never sends (the old row read that missing prop, so a discounted
 * item silently showed as full price).
 *
 * `PATCH /cart/:cartItemId { quantity }` is the only write. It is applied
 * optimistically so the row and the summary move together, and rolled back when
 * the API refuses (it re-checks stock server side and answers 507 with its own
 * message). The stepper is capped by the API's per-line maximum and by the stock
 * it reported, so it cannot walk into a request that is going to fail.
 */
const CartItem = ({ item }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const product = item?.product;
  const variant = item?.productFlavorSize;
  const flavor = variant?.productFlavor?.flavor;
  const sizeName = variant?.size?.name;
  const quantity = Number(item?.quantity ?? 1);

  const stock = itemStock(item);
  const price = unitPrice(item);
  const original = listPrice(item);
  const discounted = isItemDiscounted(item);
  const percent = itemDiscountPercentage(item);

  const ceiling =
    stock === null ? MAX_ITEM_QUANTITY : Math.min(stock, MAX_ITEM_QUANTITY);
  const overStock = stock !== null && quantity > stock;

  const quantityMutation = useMutation({
    mutationFn: async (nextQuantity) => {
      const response = await axiosPrivate.patch(`/cart/${item.id}`, {
        quantity: nextQuantity,
      });
      return response.data;
    },
    // Optimistic: move the row and the rail at once — remember the truth first.
    onMutate: async (nextQuantity) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (current) => {
        const items = current?.data?.items;
        if (!items) return current;

        const nextItems = items.map((row) =>
          row.id === item.id ? { ...row, quantity: nextQuantity } : row
        );

        return {
          ...current,
          data: {
            ...current.data,
            items: nextItems,
            totals: {
              totalItems: cartItemCount(nextItems),
              totalAmount: cartSubtotal(nextItems),
            },
          },
        };
      });

      return { previous };
    },
    onError: (error, _nextQuantity, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
      toast.error(error.response?.data?.message || "Failed to update quantity");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" }),
  });

  const changeQuantity = (delta) => {
    const next = quantity + delta;
    if (next < 1 || next > ceiling) return;
    quantityMutation.mutate(next);
  };

  const pending = quantityMutation.isPending;
  const href = product?.slug ? `/products/${product.slug}` : null;

  return (
    <div className="group/item flex w-full flex-wrap items-center gap-x-6 gap-y-5 border-b border-textColor/10 py-6 last:border-none">
      {/* Photo + quantity badge */}
      <ProductThumb
        path={variant?.productFlavor?.images?.[0]?.path}
        alt={product?.title}
        flavorColor={flavor?.color}
        sizes="(max-width: 768px) 80px, 96px"
        className="w-20 md:w-24"
        badge={
          <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accentColor text-[0.55rem] font-black text-bgColor shadow-lg">
            {quantity}
          </span>
        }
      />

      {/* What it is */}
      <div className="min-w-0 flex-1">
        {href ? (
          <Link
            href={href}
            className="line-clamp-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-textColor transition-colors hover:text-accentColor"
          >
            {product?.title}
          </Link>
        ) : (
          <p className="line-clamp-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-textColor">
            {product?.title}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {product?.category?.name && (
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.2em] text-stone-500">
              {product.category.name}
            </span>
          )}
          {flavor?.name && (
            <span className="flex items-center gap-x-2 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-stone-500">
              {flavor?.color && (
                <span
                  className="h-2 w-2 rounded-full border border-textColor/20"
                  style={{ backgroundColor: flavor.color }}
                />
              )}
              {flavor.name}
            </span>
          )}
          {sizeName && (
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-accentColor">
              Size {sizeName}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Quantity stepper — cream type on chocolate, so it is always legible */}
          <div
            className={cn(
              "flex items-center gap-x-3 rounded-full bg-textColor px-3 py-1.5",
              pending && "opacity-70"
            )}
          >
            <button
              type="button"
              aria-label={`Decrease quantity of ${product?.title || "item"}`}
              onClick={() => changeQuantity(-1)}
              disabled={quantity <= 1 || pending}
              className="flex h-5 w-5 items-center justify-center rounded-full text-bgColor transition-colors hover:bg-bgColor/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bgColor/40 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <Minus size={12} className="stroke-current" />
            </button>

            <span
              aria-live="polite"
              className={cn(
                "w-5 text-center text-[0.65rem] font-black tracking-widest text-bgColor",
                pending && "animate-pulse"
              )}
            >
              {quantity}
            </span>

            <button
              type="button"
              aria-label={`Increase quantity of ${product?.title || "item"}`}
              onClick={() => changeQuantity(1)}
              disabled={quantity >= ceiling || pending}
              className="flex h-5 w-5 items-center justify-center rounded-full text-bgColor transition-colors hover:bg-bgColor/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bgColor/40 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <Plus size={12} className="stroke-current" />
            </button>
          </div>

          {/* Stock / ceiling hints straight from the variant the API returned */}
          {overStock ? (
            <span className="text-[0.5rem] font-black uppercase tracking-[0.25em] text-red-500">
              Only {stock} in stock — reduce to continue
            </span>
          ) : stock === 0 ? (
            <span className="text-[0.5rem] font-black uppercase tracking-[0.25em] text-red-500">
              Out of stock
            </span>
          ) : stock !== null && stock <= LOW_STOCK_THRESHOLD ? (
            <span className="text-[0.5rem] font-black uppercase tracking-[0.25em] text-stone-400">
              Only {stock} left
            </span>
          ) : quantity >= ceiling ? (
            <span className="text-[0.5rem] font-black uppercase tracking-[0.25em] text-stone-400">
              Max {ceiling} per order
            </span>
          ) : null}
        </div>
      </div>

      {/* Unit price, discount, line total, remove */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-x-3">
          {discounted && (
            <span className="rounded-full border border-accentColor2/40 bg-accentColor2/20 px-2 py-0.5 text-[0.5rem] font-black uppercase tracking-[0.2em] text-accentColor">
              -{percent}%
            </span>
          )}
          <span className="text-[0.8rem] font-bold tracking-[0.15em] text-textColor">
            {formatTaka(price)}
          </span>
          {discounted && (
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-stone-400 line-through">
              {formatTaka(original)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-x-4">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-stone-500">
            {formatTaka(lineTotal(item))} total
          </span>
          <DeleteButton
            cartId={item.id}
            itemTitle={product?.title}
            label={`Remove ${product?.title || "item"} from cart`}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
