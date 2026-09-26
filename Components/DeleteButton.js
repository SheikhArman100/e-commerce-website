"use client";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";

/**
 * The archive's remove-from-selection confirmation.
 *
 * A native `<dialog>` + `showModal()` gives focus trapping, Escape-to-close and
 * an inert background for free, so only the look and the copy are ours: cream
 * glass card, ruby icon, chocolate text (the previous revision painted white
 * type on the cream card, which made the whole question invisible), and the
 * API's own success message as the toast.
 *
 * `DELETE /cart/:cartItemId` is auth-scoped server side (403 unless the item
 * belongs to the caller), so no extra guard is needed here.
 */
const DeleteButton = ({
  cartId,
  itemTitle = "this item",
  title = "Remove from selection?",
  description,
  label = "Remove item from cart",
  className = "",
}) => {
  const deleteModal = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const deleteCartMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.delete(`cart/${cartId}`);
      return response.data;
    },
    onSuccess: async (data) => {
      deleteModal.current?.close();
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        refetchType: "all",
      });
      toast.success(data?.message || "Item removed from cart");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove item");
    },
  });

  const handleDeleteCart = () => {
    deleteCartMutation.mutate();
  };

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => deleteModal.current?.showModal()}
        className={`flex h-9 w-9 items-center justify-center rounded-sm border border-textColor/10 text-textColor/40 transition-colors hover:border-accentColor/30 hover:bg-accentColor/5 hover:text-accentColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentColor/40 ${className}`}
      >
        <Trash2 size={15} strokeWidth={1.5} />
      </button>

      <dialog
        ref={deleteModal}
        aria-label={title}
        className="fixed left-1/2 top-1/2 w-[min(24rem,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-sm bg-transparent backdrop:bg-textColor/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative flex w-full flex-col items-center gap-y-8 overflow-hidden rounded-sm border border-textColor/10 bg-bgColor/95 p-10 shadow-[0_0_50px_rgba(93,64,55,0.25)] backdrop-blur-2xl">
          {/* Decorative corner glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accentColor/10 blur-3xl" />

          <section className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-accentColor/20 bg-accentColor/5">
              <Trash2 size={24} strokeWidth={1.5} className="stroke-accentColor" />
            </div>

            <span className="mb-3 text-[0.55rem] font-black uppercase tracking-[0.4em] text-stone-500">
              Action Required
            </span>
            <h4 className="mb-3 text-xl font-light tracking-tight text-textColor">
              {title}
            </h4>
            <p className="max-w-[85%] text-[0.65rem] uppercase leading-relaxed tracking-widest text-stone-500">
              {description ||
                `This will remove ${itemTitle} from your selection. You can always add it back later.`}
            </p>
          </section>

          <section className="flex w-full gap-x-4">
            <button
              type="button"
              onClick={() => deleteModal.current?.close()}
              className="flex-1 border border-textColor/15 bg-white/60 py-4 text-[0.6rem] font-black uppercase tracking-[0.3em] text-stone-500 transition-all hover:border-textColor/30 hover:text-textColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textColor/20 active:scale-95"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDeleteCart}
              disabled={deleteCartMutation.isPending}
              className="flex-1 bg-accentColor py-4 text-[0.6rem] font-black uppercase tracking-[0.3em] text-bgColor shadow-[0_0_20px_rgba(155,34,66,0.25)] transition-all hover:bg-accentColor/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentColor/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteCartMutation.isPending ? "Removing..." : "Confirm"}
            </button>
          </section>
        </div>
      </dialog>
    </>
  );
};

export default DeleteButton;
