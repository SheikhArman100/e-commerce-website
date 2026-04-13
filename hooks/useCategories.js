import { axiosPublic } from '@/libs/axios/config.js'
import { useQuery } from '@tanstack/react-query'

const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosPublic.get("category")
      return response.data
    }
  })
}

export default useCategories
