
import { axiosPublic } from '@/libs/axios/config.js';
import { useQuery } from '@tanstack/react-query';

const useProducts = (params = {}) => {
  const { 
    page = 1, 
    limit = 12, 
    categoryId = null, 
    minPrice = null, 
    maxPrice = null,
    inStock = null,
    searchTerm = null,
    flavorName = null,
    sizeName = null
  } = params;

  return useQuery({
    queryKey: ["products", { page, limit, categoryId, minPrice, maxPrice, inStock, searchTerm, flavorName, sizeName }],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (categoryId && categoryId !== 'all') queryParams.append("categoryId", categoryId);
      if (minPrice) queryParams.append("minPrice", minPrice.toString());
      if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());
      if (inStock) queryParams.append("inStock", inStock);
      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (flavorName) queryParams.append("flavorName", flavorName);
      if (sizeName) queryParams.append("sizeName", sizeName);

      const response = await axiosPublic.get(`product?${queryParams.toString()}`);
      return response.data; // This returns { success, message, meta, data }
    }
  });
}

export default useProducts