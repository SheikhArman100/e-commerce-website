"use client";

import { axiosPublic } from "@/libs/axios/config.js";
import { useAuthStore } from "@/libs/zustand/authStore.js";


const useUpdateAT = () => {
   const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const update = async () => {
    const response = await axiosPublic.get("/auth/token", {
      withCredentials: true,
    });
    setAccessToken(response.data.data.accessToken);
    return response.data.data.accessToken;
  };
  return update;
};

export default useUpdateAT;
