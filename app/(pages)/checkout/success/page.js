"use client";
import Button from "@/Components/Button.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation.js";

const Success = () => {
  const searchParams = useSearchParams();
  const transId = searchParams.get("transId");
  const router = useRouter();

  const axiosPrivate = useAxiosPrivate();
  const { isPending} = useQuery({
    queryKey: ["payment"],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `order/payment/success?transId=${transId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });
  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-accentColor" />
      </div>
    );
  }
  
  return (
    <article className="w-full min-h-screen flex flex-col items-center justify-center text-center md:pt-[7rem] py-8 px-8 lg:px-[2rem] xl:px-[4rem] bg-cream">
      <div className="p-3 bg-ruby w-[20rem] aspect-[1/0.8] rounded-lg shadow-xl">
        <div className="w-full h-full border border-chocolate/20 flex flex-col items-center justify-center gap-y-3 bg-white/90">
          <BadgeCheck size={32} className="stroke-ruby" />
          <h4 className="text-xl font-bold text-chocolate">
            Payment Successful !
          </h4>
          <p className="text-sm font-semibold text-gray-400">
            Transaction id is <br /> {transId}
          </p>
          <Button className="hidden md:flex " href="/">
            <Button.Border1 />
            <Button.Border2 />
            <Button.Title>Go to home</Button.Title>
            <Button.Icon>
              <ArrowRight className="stroke-white" />
            </Button.Icon>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default Success;
