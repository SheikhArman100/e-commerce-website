"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";
import useUserDetails from "./useUserDetails.js";

/**
 * Delivered-but-unreviewed items for the signed-in customer.
 * Hits GET /review/pending (auth) -> { data: [{ orderId, orderNumber, productId, productTitle, productSlug }] }.
 *
 * Enabled only once `useUserDetails` has actually confirmed a session, so no
 * popup ever fires for a guest. The gate is the `/auth/user` response rather
 * than the persisted `accessToken`: the token is restored from localStorage
 * and can outlive its server-side session (or be missing while the refresh
 * cookie is still valid), which would either fire the request anonymously or
 * skip it for a customer who is genuinely signed in. `useUserDetails` reads
 * the session cookie, so it is the honest answer to "is anyone signed in?".
 * Both hooks share the ["user"] cache entry, so this costs no extra request.
 */
const usePendingReviews = () => {
  const axiosPrivate = useAxiosPrivate();
  const { data: user } = useUserDetails();

  return useQuery({
    queryKey: ["pending-reviews"],
    enabled: Boolean(user),
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
