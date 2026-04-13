import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";

const useCoupons = () => {
  const axiosPrivate = useAxiosPrivate();

  // Fetch active coupons
  const useActiveCoupons = () => useQuery({
    queryKey: ["coupons", "active"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/coupon?isActive=true");
      return response.data.data;
    },
  });

  // Validate coupon
  const useValidateCoupon = () => useMutation({
    mutationFn: async ({ code, amount }) => {
      const response = await axiosPrivate.post("/coupon/validate", { code, amount });
      return response.data.data;
    },
  });

  return {
    useActiveCoupons,
    useValidateCoupon,
  };
};

export default useCoupons;
