<template>
  <div class="dialog-wrapper">
    <div class="dialog flex flex-col gap-5 shadow-2xl border-[1px] z-50">
      <svg
        @click="emits('close')"
        class="absolute top-4 right-4 h-9 w-9"
        fill="none"
        stroke="#ff0000"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <form
        @submit="handleSubmit"
        class="w-full flex flex-col justify-center items-center gap-4"
      >
        <tok-input
          min="0"
          id="amount"
          v-model="state.amount"
          :required="true"
          class="w-full"
          label="Custom Amount"
          placeholder=" "
          type="number"
        />
        <button class="primary-btn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import useAuction from "@/modules/live/store/AuctionStore.js";
import { reactive } from "vue";
import { useAuthStore } from "@/store/auth.js";

const state = reactive({
  amount: "",
});
const emits = defineEmits(["close"]);
const auctionStore = useAuction();
const authStore = useAuthStore();
const { bid } = auctionStore;

const handleSubmit = (evt) => {
  evt.preventDefault();
  emits("handleBid", {amount: state.amount});
  emits("close");
};
</script>
