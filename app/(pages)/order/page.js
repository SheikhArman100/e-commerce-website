"use client"
import RevealParagraph from '@/Components/RevealParagraph.js'
import RevealTitle from '@/Components/RevealTitle.js'
import StatusChecker from '@/Components/StatusChecker.js'
import useAxiosPrivate from '@/hooks/useAxiosPrivate.js'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import OrderList from './OrderList.js'
import OrderContainer from './OrderContainer.js'

const Order = () => {

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
        <OrderContainer />

      </article>
    </StatusChecker>
  )
}

export default Order