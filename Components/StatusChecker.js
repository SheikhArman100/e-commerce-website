"use client";
import { useRouter } from "next/navigation.js";
import useUserDetails from "@/hooks/useUserDetails.js";

const StatusChecker = ({ children }) => {
  const router = useRouter();
  const { isPending, error, data } = useUserDetails();

  if (isPending) {
    return (
      <div className="h-screen w-full bg-customBlack flex items-center justify-center">
        <span className="loading loading-spinner text-warning" />
      </div>
    );
  }
  if (error) {
    router.push("/auth/signin");
  }
  return <>{data && children}</>;
};

export default StatusChecker;
