"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";
import { useAuthStore } from "@/libs/zustand/authStore.js";

/**
 * Delivered-but-unreviewed items for the signed-in customer.
 * Hits GET /review/pending (auth) -> { data: [{ orderId, orderNumber, productId, productTitle, productSlug }] }.
 * Disabled for guests (no access token) so no popup ever fires anonymously.
 */
const usePendingReviews = () => {
  const axiosPrivate = useAxiosPrivate();
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["pending-reviews"],
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const res = await axiosPrivate.get("/review/pending", {
        withCredentials: true,
      });
      const payload = res.data?.data;
      return Array.isArray(payload) ? payload : [];
    },
  });
};

export default usePendingReviews;
