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
    // A 403 here is a definitive "no session on this device" answer, not a
    // transient failure — retrying it only doubles the session probe that runs
    // right after a sign out.
    retry: false,
  });
};

export default useUserDetails;
