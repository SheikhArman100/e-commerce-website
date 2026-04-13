import { axiosPublic } from '@/libs/axios/config.js'
import { useQuery } from '@tanstack/react-query'

const useFlavors = () => {
  return useQuery({
    queryKey: ["flavors"],
    queryFn: async () => {
      const response = await axiosPublic.get("flavor")
      return response.data
    }
  })
}

export default useFlavors
