"use client";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";

const DeleteButton = ({cartId}) => {
  const deleteModal = useRef(null);
  const axiosPrivate=useAxiosPrivate()
  const queryClient=useQueryClient()
  const deleteCartMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.delete(`cart/${cartId}`);
      return response.data;
    },
    onSuccess: async (data) => {
      deleteModal.current.close();
      queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
      toast.success(data.message || "Item removed from cart");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  });

  const handleDeleteCart = () => {
    deleteCartMutation.mutate();
  };
  return (
    <>
      <button onClick={() => deleteModal.current?.showModal()}>
        <Trash2 className="stroke-gray-300" />
      </button>
      <dialog
        ref={deleteModal}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-black/80 bg-transparent rounded-sm overflow-visible"
      >
        <div className="relative p-12 bg-bgColor/90 backdrop-blur-2xl border border-white/10 w-[24rem] flex flex-col items-center justify-center gap-y-10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Decorative Corner Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accentColor/10 blur-3xl rounded-full pointer-events-none" />

          <section className="flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full border border-white">
               <Trash2 size={32} className="stroke-accentColor " />
            </div>
            
            <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500 mb-2">
              Action Required
            </span>
            <h4 className="text-xl font-light tracking-tight text-white mb-3">Remove from collection?</h4>
            <p className="text-[0.7rem] uppercase tracking-widest leading-relaxed text-stone-400 max-w-[80%]">
              This will permanently extract the item from your shopping selection.
            </p>
          </section>

          <section className="flex gap-x-4 w-full">
            <button
              className="flex-1 py-4 border border-white/10 hover:border-white/20 text-[0.65rem] uppercase tracking-[0.3em] font-black text-stone-400 transition-all active:scale-95 bg-white"
              onClick={() => deleteModal.current?.close()}
            >
              Cancel
            </button>
            
            <button 
              className="flex-1 py-4 bg-accentColor text-bgColor text-[0.65rem] uppercase tracking-[0.3em] font-black shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all active:scale-95 disabled:opacity-50" 
              onClick={handleDeleteCart}
              disabled={deleteCartMutation.isPending}
            >
              {deleteCartMutation.isPending ? "Processing..." : "Confirm"}
            </button>
          </section>
        </div>
      </dialog>
    </>
  );
};

export default DeleteButton;
