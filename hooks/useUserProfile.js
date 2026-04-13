import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate.js";

const useUserProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/user/profile");
      return response.data.data;
    },
  });
};

export default useUserProfile;
