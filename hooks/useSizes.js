import { axiosPublic } from '@/libs/axios/config.js'
import { useQuery } from '@tanstack/react-query'

const useSizes = () => {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const response = await axiosPublic.get("size")
      return response.data
    }
  })
}

export default useSizes
