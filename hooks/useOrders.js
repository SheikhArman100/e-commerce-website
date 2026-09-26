import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";

/**
 * The signed in customer's own order history, newest first.
 *
 * Hits `/order/my-orders` — `/order` itself is the admin listing and answers a
 * customer with 403. That one route also nests its payload one level deeper
 * than its siblings (`{ data: { meta, data } }` instead of `data` + `meta`),
 * so it is unwrapped here and every consumer sees a plain `{ orders, meta }`.
 *
 * `keepPreviousData` lets a page change keep the current archive on screen
 * (with the container's "Refreshing…" hint) instead of flashing skeletons.
 *
 * @param {number} page  1-based page index
 * @param {number} limit rows per page
 */
const useOrders = (page = 1, limit = 6) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["order", page, limit],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await axiosPrivate.get("/order/my-orders", {
        params: { page, limit },
        withCredentials: true,
      });

      const payload = response.data?.data ?? {};

      return {
        orders: payload.data ?? [],
        meta: payload.meta ?? null,
      };
    },
  });
};

export default useOrders;
