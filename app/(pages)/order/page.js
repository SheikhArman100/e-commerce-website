"use client"
import RevealParagraph from '@/Components/RevealParagraph.js'
import RevealTitle from '@/Components/RevealTitle.js'
import StatusChecker from '@/Components/StatusChecker.js'
import useAxiosPrivate from '@/hooks/useAxiosPrivate.js'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import OrderList from './OrderList.js'

const Order = () => {
  const axiosPrivate=useAxiosPrivate()
  const{data,isPending,error}=useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const response = await axiosPrivate.get("order", {
        withCredentials: true,
      });
      return response.data;
    },
  })

  const orders=data?.data
  

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-accentColor" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Something went wrong</p>
      </div>
    );
  }
  
  return (
    <StatusChecker>
    <article className="w-full min-h-screen flex flex-col items-center text-center md:mt-[7rem] py-8  px-8 lg:px-[2rem] xl:px-[4rem]">
      <section>
        <RevealTitle
          phrases={["Your Order History"]}
          phraseStyle="text-4xl font-medium text-accentColor"
        />
        <RevealParagraph
          phrases={[
            "Your journey with us is documented here, showcasing a chronicle of your indulgent choices and pastry passions. Whether it's the celebration of special occasions or the simple joy of treating yourself, your order history provides a nostalgic stroll through a delectable timeline. We are honored to be a part of your culinary adventures, preserving the memories of each delicious experience in your personalized order history",
          ]}
          phraseStyle="text-sm text-stone-500 leading-relaxed font-light"
          containerStyle="max-w-[40rem]"
        />
      </section>
      <div className="h-px w-full bg-textColor/10 mt-12 mb-16" />
      <section className=' w-full flex justify-center items-center '>
        <div className='w-full max-w-3xl  grid grid-cols-1'>
        {orders?.map((order,index)=>(
            <OrderList 
              key={index} 
              orderId={order.id} 
              totalAmount={order.payableAmount || order.totalAmount} 
              status={order.status} 
              createdAt={order.createdAt} 
              items={order.items || []}
            />
          ))}
        </div>
          
      </section>
    </article>
    </StatusChecker>
  )
}

export default Order