<template>
  <div
      class="flex w-full rounded-lg bg-transparent text-white gap-3 py-4 flex-shrink-0
    relative items-center"
      @click="handleClick"
  >
    <div class="flex-col gap-2 w-full">
      <p class="text-lg font-bold">
        {{ product?.name }}
      </p>
      <p v-if="product.available" class="text-sm font-light">STOK: {{ product.quantity }}</p>
      <div class="flex w-full items-center gap-8">
        <p v-if="product?.discountedPrice > 0" class="font-semibold text-lg text-[16px]">
          <p :class="[product?.discountedPrice > 0 ? 'line-through text-info': '']"
           class="font-semibold  text-lg text-[16px]">₺{{ product.price }}</p>
          {{ getPriceFormatted(product?.discountedPrice) }}
        </p>
      </div>
      <button v-if="!isOwner" class="primary-btn w-28 mt-2 cursor-pointer"
              @click="router.push(`/product/${product?._id}`)">Satın Al
      </button>
    </div>

    <img :src="product.images[0]" alt="" class="h-16 ml-auto object-contain">

     <!-- MÜZAYEDE
       <svg
          v-if="!tokshowStore.tokshow.ended  && isOwner && !tokshowStore.tokshow.event"
          aria-hidden="true"
          class="self-start h-12 w-12 -mt-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          @click="state.openActions = !state.openActions"
          @click.stop=""
      >
        <path
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></path>
      </svg>
     -->

    <hr class="mt-4"/>

  </div>
  <shop-tab-actions
      v-if="state.openActions"
      :is-owner="isOwner"
      :product="product"
      @close="state.openActions = false"
  />
</template>

<script setup>
import {useCart} from "@/store/cart.js";
import {storeToRefs} from "pinia";
import Swal from "sweetalert2";
import {reactive} from "vue";
import {useRouter} from "vue-router";
import ShopTabActions from "@/modules/live/components/shop/ShopTabActions.vue";
import useTokshow from "@/store/useTokshow.js";
import {useUtils} from "@/shared/composables/utils";

const utils = useUtils();
const {getPriceFormatted} = utils;

const props = defineProps(["product", "isOwner"]);
const tokshowStore = useTokshow();
const router = useRouter();

const state = reactive({
  inCart: false,
  qty: 1,
  openActions: false,
});

const cart = useCart();
const {addToCart} = cart;
const {products} = storeToRefs(cart);

const handleClick = () => {
  if (!props.isOwner) {
    router.push(`/product/${props.product._id}`);
  }
};

const handleBuy = () => {
  addToCart(props.product);
  state.inCart = true;
  Swal.fire({
    icon: "info",
    text: "Added to cart",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    cancelButtonColor: "#FF0000",
  });
  router.push("/checkout");
};
</script>
