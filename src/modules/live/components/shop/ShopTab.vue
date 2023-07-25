<template>
  <div
    class="flex flex-col inset-0 z-50 bg-black/80 w-screen self-center h-screen fixed px-4 lg:px-2
    lg:relative lg:w-full lg:h-full lg:text-primary items-center"
  >
    <svg
      aria-hidden="true"
      class="absolute top-4 z-50 right-8 h-8 w-8 lg:hidden cursor-pointer"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      @click="emit('close')"
    >
      <path
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>

    <div v-if="event" class="flex flex-col w-full gap-3 mt-14 lg:mt-0">
      <p class="text-slate-100 font-semibold">{{event?.productIds?.length}} &nbsp; Ürün</p>
      <shop-tab-card
        v-for="(product, index) in event?.productIds"
        :key="index"
        :isOwner="isOwner"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import ShopTabCard from "./ShopTabCard.vue";
import { computed } from "vue";
import { useAuthStore } from "@/store/auth.js";

const props = defineProps(["event"]);
const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const isOwner = computed(
  () => authStore.authUser?._id === props.event?.ownerId?._id
);
</script>
