import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";

const useCarts = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/cart/user");
      return response.data;
    },
  });
};

export default useCarts;
