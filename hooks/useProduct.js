
import { axiosPublic } from '@/libs/axios/config.js';
import { useQuery } from '@tanstack/react-query';

const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosPublic.get(`product/${id}`);
      return response.data; // This returns { success, statusCode, message, data }
    },
    enabled: !!id,
  });
}

export default useProduct;
