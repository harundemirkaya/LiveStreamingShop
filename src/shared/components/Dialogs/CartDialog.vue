<template>
  <div class="dialog-wrapper bg-transparent" @click="emit('close')">
    <div
      class="rounded-lg p-6 flex flex-col gap-4 w-full absolute top-20 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-[10%] max-w-sm z-50 bg-white shadow-2xl"
      @click.stop=""
    >
      <div
        v-if="cart.products.length > 0"
        class="flex flex-col items-center gap-8 max-h-[40vh] overflow-y-scroll"
      >
        <div
          v-for="(product, index) in cart.products"
          :key="index"
          class="flex flex-col lg:flex-row gap-4 w-full items-center"
        >
          <div
            :style="{
              backgroundImage: `url('${
                product.image ? product.image : setImage
              }')`,
            }"
            class="flex w-20 h-20 rounded-full bg-cover bg-center bg-no-repeat"
          />
          <div class="flex flex-col gap-2 truncate w-7/12">
            <p class="text-2xl font-semibold">{{ product.name }}</p>
            <p class="whitespace-nowrap">
              {{ product.description }}
            </p>
            <!-- <div
              class="flex rounded-[57px] items-center w-36 justify-between px-1 py-1 border-info border-[.1rem] relative"
            >
              <svg
                class="h-8 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                @click="decrementCart(product._id)"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"
                />
              </svg>
             
              <input
                v-model="product.qty"
                class="w-12 focus:outline-none pl-4 border-base-200 border-2"
                min="0"
                type="number"
              />
              <svg
                class="h-8 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                @click="incrementCart(product._id)"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                />
              </svg> 
              <svg
                class="absolute -right-1/3 h-8 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                @click="removeFromCart(product._id)"
              >
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                />
                <path
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  fill-rule="evenodd"
                />
              </svg>
            </div> -->
          </div>
        </div>
      </div>
      <div
        :class="[
          cart.products.length === 0 ? 'text-center text-info' : 'text-primary',
        ]"
        v-else
      >
        <span
          class="text-bold text-lg font-bold justify-center place-items-center"
        >
          Empty cart
        </span>
      </div>

      <div
        v-if="cart.products.length > 0"
        class="grid grid-cols-2 place-items-stretch gap-4"
      >
        <p class="md:text-md font-medium">Tax</p>
        <p class="md:text-md font-medium text-end">
          {{ getPriceFormatted("0.00") }}
        </p>
        <p class="md:text-md font-medium">
          Shipping Cost({{ cart.shipping.name }})
        </p>
        <p class="md:text-md font-medium text-end">
          {{ getPriceFormatted(cart.shipping.amount) }}
        </p>
        <p class="md:text-md">Subtotal</p>
        <p class="md:text-md text-end">
          {{ getPriceFormatted(total) }}
        </p>
        <p class="md:text-md font-semibold">Total</p>
        <p class="md:text-md font-semibold text-end">
          {{ getPriceFormatted(cart.shipping.amount + total) }}
        </p>
      </div>
      <button
        v-if="cart.products.length > 0"
        class="primary-btn"
        role="button"
        @click="handleCheckout"
      >
        Checkout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive } from "vue";
import setImage from "@/shared/assets/images/product.jpeg";
import { useCart } from "@/store/cart.js";
import { storeToRefs } from "pinia";
import { useUtils } from "@/shared/composables/utils";
const utils = useUtils();
const { getPriceFormatted } = utils;

const state = reactive({
  qty: 0,
});

const cart = useCart();
const { decrementCart, removeFromCart, incrementCart } = cart;
const { products, total, shipping } = storeToRefs(cart);

const router = useRouter();
const emit = defineEmits(["close"]);

const handleCheckout = () => {
  emit("close");
  router.push("/checkout");
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
