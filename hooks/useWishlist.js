import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";

const useWishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axiosPrivate.get("/wishlist/user", {
        withCredentials: true,
      });
      return response.data;
    },
  });
};

export default useWishlist;
