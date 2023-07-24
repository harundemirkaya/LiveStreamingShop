<template>
  <div class="dialog-wrapper bg-gray-400/70">
    <div class="dialog items-start flex flex-col gap-4 w-full shadow-2xl border-[1px]  relative h-fit">
      <svg
          aria-hidden="true"
          class="absolute top-4 right-4 h-9 w-9"
          fill="none"
          stroke="#ff0000"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          @click="emits('close')">
        <path
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-linecap="round"
            stroke-linejoin="round">
        </path>
      </svg>
      <div class="w-full flex  justify-center gap-6">
        <div class="chips">Highest Bid &nbsp; &nbsp;<br/>
          <span class="text-primary font-semibold">${{ auctionStore.getHighestBid }}</span>
        </div>
        <div class="chips">Highest Bidder &nbsp; &nbsp;<br/>
          <span class="text-primary font-semibold">{{ auctionStore.getHighestBidder?.user?.firstName }}</span>
        </div>
      </div>

      <p class="h3 underline pb-1 text-center w-full mt-10">All Bids</p>

      <div class="flex flex-col gap-4 w-full">
        <div @click="router.push(`/profile/${item.user._id}`)" v-for="item in auctionStore.auction.bids" class="flex items-center gap-2 cursor-pointer">
          <img :src="item.user.profilePhoto || '/imgs/profile.svg'" alt="'/imgs/profile.svg'"
          class="w-6 h-6 rounded-full border-[1px] shadow-lg object-cover"
          >
          <p class="base font-semibold">{{ item.user.firstName }} {{ item.user.lastName }}</p>
          <p class="">${{item.amount}}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import useAuction from "@/modules/live/store/AuctionStore.js";
import {useRouter} from "vue-router";

const router = useRouter()
const emits = defineEmits(['close'])
const auctionStore = useAuction()



</script>
