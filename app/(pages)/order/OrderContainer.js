"use client"
import useAxiosPrivate from '@/hooks/useAxiosPrivate.js'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import OrderList from './OrderList.js'

const OrderContainer = () => {
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
  )
}

export default OrderContainer