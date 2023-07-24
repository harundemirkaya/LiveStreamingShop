<template>
  <div v-if="!state.isEmpty">
    <div
      class="flex flex-col lg:flex-row w-full gap-9 items-center content-container py-10 lg:py-16"
    >
      <div class="flex flex-col w-full gap-8">
        <p class="text-3xl font-semibold tracking-wider">Checkout</p>
        <shipping-form-vue />
      </div>
      <div class="flex flex-col w-full">
        <checkout-summary-vue @placeOrder="placeOrder" />
      </div>
    </div>
    <div v-if="dialogState.isOpen">
      <confirm-checkout-dialog @close="dialogToggle" />
    </div>
  </div>
  <div v-else class="flex flex-col gap-5 items-center py-16">
    <p class="text-2xl text-info font-semibold">Cart is empty</p>
    <a href="/" class="text-info text-lg underline">Continue shopping</a>
  </div>
</template>

<script setup>
import {defineAsyncComponent, reactive, watch} from "vue";
import CheckoutSummaryVue from "../components/CheckoutSummary.vue";
const  ConfirmCheckoutDialog = defineAsyncComponent({
  loader:() => import("@/modules/checkout/components/ConfirmCheckoutDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import ShippingFormVue from "../components/ShippingForm.vue";
import { useCart } from "@/store/cart.js";
import { useFetch } from "@/shared/composables/Fetch";
import BankDetails from "@/modules/settings/views/BankDetails.vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const state = reactive({
  isEmpty: false,
});

const placeOrder = async () => {
  let method = "POST";
  let url = "/stripe/createIntent";

  state.loading = true;
  console.log(cartStore.products[0].item.ownerId.payoutmethod);
  let response = await useFetch(url, {
    method: method,
    data: {
      amount: cartStore.total * 100,
      currency: "usd",
      payment_method_types: ["card"],
      capture_method: "automatic",
      application_fee_amount: Math.trunc(cartStore.total * 0.1 * 100),
      accountno: cartStore.products[0].item.ownerId.payoutmethod.accountno,
    },
  });
  console.log(response);
  state.loading = false;
};



const dialogState = reactive({ isOpen: false });
const dialogToggle = () => (dialogState.isOpen = !dialogState.isOpen);

const cartStore = useCart();


watch(cartStore, (value) => {
  if (value.products.length < 1) state.isEmpty = true;
  else state.isEmpty = false;
});

</script>
