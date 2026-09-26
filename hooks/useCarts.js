import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";

/**
 * The signed in customer's cart — the API's `GET /cart/user` (`auth()`).
 *
 * The envelope is `{ success, statusCode, message, data: cart }` where cart is
 *
 *   { id, userId, items: [...], totals: { totalItems, totalAmount }, user }
 *
 * and every item carries the product (with its campaign pricing), the resolved
 * `productFlavorSize` (price, stock, size, flavour + images) and the TWO prices
 * the storefront must use: `originalPrice` (raw variant price) and `salesPrice`
 * (lowest campaign-aware price). Money rules live in `libs/orderTotals.js`.
 *
 * `enabled` lets the header ask for the count only once a session exists — a
 * guest never fires the request.
 */
const useCarts = ({ enabled = true } = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["cart"],
    enabled,
    queryFn: async () => {
      const response = await axiosPrivate.get("/cart/user");
      return response.data;
    },
  });
};

export default useCarts;
