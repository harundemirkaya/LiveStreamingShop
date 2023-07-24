<template>
  <div class="flex flex-col w-full items-center text-white gap-2">
    <p class="text-lg text-left self-start ml-4">
      {{ auctions.length }} products
    </p>
    <div
      v-for="auction in auctions"
      class="flex flex-col gap-1 w-full px-4 py-2 rounded-lg"
      :key="auction._id"
    >
      <p class="text-2xl font-semibold">{{ auction.product?.name }}</p>
      <p class="text-gray-200">
        {{
          auction.product.available
            ? auction.product.quantity + " " + " " + "available"
            : "Not available"
        }}
      </p>
      <p class="text-sm">Starting Bid: &nbsp;&nbsp; ${{ auction.baseprice }}</p>
      <hr class="mt-3" />
    </div>
  </div>
</template>

<script setup>
import { useAuctionTab } from "@/modules/live/composables/useAuctionTab.js";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const { getAllAuctions, loading, auctions } = useAuctionTab();
const route = useRoute();

onMounted(() => {
  getAllAuctions(route.params.roomId);
});
</script>
