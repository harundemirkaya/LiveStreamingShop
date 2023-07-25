<template>
  <div class="dialog-wrapper bg-gray-400/70">
    <div
      class="absolute left-1/2 -translate-x-1/2 lg:left-52 bg-white py-4 z-50 w-64 h-64 shadow-2xl flex flex-col gap-5 items-center border-[1px] rounded-lg justify-center divide-y"
      v-if="!authStore.authStore?.payoutmethod && isOwner"
    >
      <div class="w-full flex justify-center font-light text-black text-xl">
        Müzayede
      </div>
      <div
        v-if="isOwner"
        class="text-info font-semibold cursor-pointer w-full flex items-center justify-center my-auto h-1/2"
        @click="handleStartAuction"
      >
        Müzayede Başlat
      </div>
      <div
        v-else
        class="text-info font-semibold cursor-pointer w-full flex justify-center items-center h-full"
        @click="handleBuy"
      >
        Buy
      </div>
      <div class="w-full flex justify-center py-4">
        <button class="primary-btn py-1 w-32" @click="emits('close')">
          Vazgeç
        </button>
      </div>
    </div>
    <div
      class="absolute left-1/2 -translate-x-1/2 lg:left-52 bg-white py-4 z-50 w-64 h-64 shadow-2xl flex flex-col gap-5 items-center border-[1px] rounded-lg justify-center divide-y"
      v-else-if="isOwner"
    >
      <div
        class="w-full flex justify-center font-light text-black px-4 text-md"
      >
        You cannot start auction without setting up your payout method
      </div>
      <div
        class="text-info font-semibold cursor-pointer w-full flex items-center justify-center my-auto h-1/2"
      >
        Set up now
      </div>
      <div class="w-full flex justify-center py-4">
        <button class="primary-btn py-1 w-32" @click="emits('close')">
          Cancel
        </button>
      </div>
    </div>
    <auction-modal
      v-if="state.isActionModalOpen"
      :product="product"
      @close="handleClose"
    />
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { useCart } from "@/store/cart.js";
import { useRouter } from "vue-router";
import AuctionModal from "@/modules/live/components/auction/AuctionModal.vue";
import { reactive, watch } from "vue";
import { useAuthStore } from "@/store/auth.js";

const props = defineProps(["isOwner", "product"]);
const emits = defineEmits(["close"]);
const router = useRouter();
const authStore = useAuthStore();
const state = reactive({
  isActionModalOpen: false,
});

const cart = useCart();
const { addToCart } = cart;

const handleBuy = () => {
  addToCart(props.product);
  Swal.fire({
    icon: "info",
    text: "Added to cart",
  }).then(() => {
    router.push("/checkout");
  });
};

const handleStartAuction = () => {
  state.isActionModalOpen = true;
};

const handleClose = () => {
  state.isActionModalOpen = false;
  emits("close");
};
</script>
