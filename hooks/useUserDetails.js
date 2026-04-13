import { useQuery } from "@tanstack/react-query";

import { axiosPublic } from "@/libs/axios/config.js";

const useUserDetails = () => {
  
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosPublic.get("/auth/user", {
        withCredentials: true,
      });

      return response.data.data;
    },
  });
};

export default useUserDetails;
