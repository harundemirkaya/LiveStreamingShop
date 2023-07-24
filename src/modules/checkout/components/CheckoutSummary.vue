<template>
  <div
    class="border-info border-[0.1rem] rounded-lg p-4 flex flex-col gap-5 w-full"
  >
    <div v-if="cart.products.length > 0">
      <div
        v-for="(product, index) in cart.products"
        :key="index"
        class="flex flex-col md:flex-row gap-4 w-full relative md:justify-between"
      >
        <div
          class="flex flex-col md:flex-row md:items-center w-full md:w-1/2 gap-6 relative"
        >
          <div
            :style="{
              backgroundImage: `url('${
                product?.image ? product?.image : setImage
              }')`,
            }"
            class="flex w-12 h-12 lg:w-12 lg:h-12 rounded-full bg-cover bg-center bg-no-repeat"
            @click="router.push(`/product/${product?._id}`)"
          />
          <div class="flex flex-col gap-3 w-full">
            <p class="text-2xl font-semibold">{{ product?.name }}</p>
          </div>
        </div>

        <div
          class="flex rounded-[57px] items-center w-36 md:mr-10 justify-between px-1 py-1 border-info border-[.1rem] relative"
        >
          <!-- minus icon -->
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
          <p class="">{{ product.qty }}</p>
          <!-- plus icon -->
          <svg
            class="h-8 cursor-pointer"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            @click="incrementCart(product._id)"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1
                0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
            />
          </svg>
          <!-- trash icon -->
          <svg
            aria-hidden="true"
            class="w-8 h-8 absolute -right-10 cursor-pointer"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="removeFromCart(product._id)"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1
                  1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div v-else>
      <span
        class="text-bold text-lg text-black font-bold justify-center place-items-center"
      >
        No products
      </span>
    </div>

    <div class="grid grid-cols-2 place-items-stretch gap-4">
      <p class="md:text-xl font-medium">Tax</p>
      <p class="md:text-xl font-medium text-end">
        {{ getPriceFormatted("0.00") }}
      </p>
      <p class="md:text-xl font-medium">
        Shipping Cost({{ cart?.shipping?.name }})
      </p>
      <p class="md:text-xl font-medium text-end">
        {{ getPriceFormatted(shipping == null ? 0 : cart.shipping.amount) }}
      </p>
      <p class="md:text-xl font-medium">Subtotal</p>
      <p class="md:text-xl font-medium text-end">
        {{ getPriceFormatted(total) }}
      </p>
      <p class="md:text-xl font-semibold">Total</p>
      <p class="md:text-xl font-semibold text-end">
        {{
          getPriceFormatted(parseInt(cart?.shipping?.amount) + parseInt(total))
        }}
      </p>
    </div>

    <p class="text-xl mt-8 font-medium">Choose Shipping Method</p>
    <div class="flex flex-wrap items-center gap-4 px-4">
      <button
        v-for="option in cart.shippingMethods"
        :key="option"
        :class="[
          cart.shipping.name === option.name
            ? 'border-info text-info'
            : 'border-primary text-primary',
        ]"
        class="border-[1px] px-6 py-2 rounded-md text-xl font-semibold"
        @click="handleShipping(option)"
      >
        {{ option.name }}
        <span class="text-primary text-base"
          >&nbsp;&nbsp;&nbsp; {{ getPriceFormatted(option.amount) }}</span
        >
      </button>
    </div>
    <p class="text-xl mt-8 font-medium">Choose Payment Method</p>
    <div class="flex flex-wrap items-center gap-4 px-4">
      <button
        v-for="option in paymentOptions"
        :key="option"
        :class="[
          defaultPaymentOption === option
            ? 'border-info text-info'
            : 'border-primary text-primary',
        ]"
        class="border-[1px] px-6 py-2 rounded-md text-xl font-semibold"
        @click="handleSetpaymentOption(option)"
      >
        {{
          option.name === "cc"
            ? "Credit Card"
            : option.name === "cod"
            ? "Cash On Delivery"
            : "FlutterWave"
        }}
      </button>
    </div>

    <div
      v-if="!defaultPaymentOption || defaultPaymentOption.name === 'cc'"
      class="flex flex-col gap-8 my-8 max-w-sm"
    >
      <div class="input-wrapper h-14">
        <label class="labels">Card Number</label>
        <div id="card-number-element" class="inputs" />
      </div>

      <div class="input-wrapper h-14">
        <label class="labels">Expiry Date</label>
        <div id="card-expiry-element" class="inputs" />
      </div>

      <div class="input-wrapper h-14">
        <label class="labels">CVC</label>
        <div id="card-cvc-element" class="inputs" />
      </div>
    </div>

    <spinner-v2 :load="loading" />
    <button
      class="primary-btn"
      role="button"
      @click="placeOrder"
      v-if="authStore.authUser.address"
    >
      Place Order
    </button>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCart } from "@/store/cart.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useUtils } from "@/shared/composables/utils";
import { useCheckoutSummary } from "@/modules/checkout/composables/useCheckoutSummary.js";

const utils = useUtils();
const { getPriceFormatted } = utils;

const authStore = useAuthStore();

const {
  qty,
  handleSetpaymentOption,
  handleShipping,
  getProductById,
  product,
  createAndMountFormElements,
  loading,
  paymentOptions,
  defaultPaymentOption,
  stripe,
  placeOrder,
} = useCheckoutSummary();

const router = useRouter();
const emits = defineEmits(["placeOrder"]);

const cart = useCart();
const { decrementCart, removeFromCart, incrementCart } = cart;
const { products, total, shipping, shippingMethods } = storeToRefs(cart);

const handleSubmit = async () => {
  await placeOrder();
  emits("close");
};

watch(authStore, (value) => {
  if (!value?.authUser?._id) router.push("/login");
});

onMounted(() => {
  if (!authStore.authUser?._id) router.push("/login");
  getProductById();

  createAndMountFormElements();
});
</script>
