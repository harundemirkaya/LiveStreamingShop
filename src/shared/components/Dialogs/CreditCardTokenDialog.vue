<template>
  <div class="dialog-wrapper">
    <div class="dialog border-0">
      <p class="text-primary text-1xl font-semibold tracking-wide text-center">
        {{ title }}
      </p>

      <div class="flex flex-col gap-8 my-8 max-w-sm w-full">
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
      <spinner-v2 :load="state.loading" />
      <button
        v-if="!state.loading"
        class="outline-btn mt-6"
        type="button"
        @click.prevent="generateToken"
      >
        Submit
      </button>
      <button class="mt-6" @click="handleClose">Cancel</button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { useFetch } from "@/shared/composables/Fetch";
import { loadStripe } from "@stripe/stripe-js/pure";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const emits = defineEmits(["close"]);
const authStore = useAuthStore();
const { saveUserDefaultPayment } = authStore;

const state = reactive({
  stripe: null,
  cardNumberElement: null,
  cardExpiryElement: null,
  cardCVCElement: null,
  stripeValidationError: "",
  loading: false,
});

onMounted(() => {
  createAndMountFormElements();
});
const setValidationError = (event) => {
  state.stripeValidationError = event.error ? event.error.message : "";
};

const generateToken = async () => {
  state.loading = true;
  await state.stripe
    .createToken(state.cardNumberElement)
    .then(async (result) => {
      if (result.error) {
        state.stripeValidationError = result.error.message;
        state.loading = false;
      } else if (result.token) {
        let paymentdata = {
          userid: authStore.authUser?._id,
          id: result.token.id,
          cardid: result.token.card.id,
          name: result.token.card.brand,
          token: result.token.id,
          last4: result.token.card.last4,
          type: "card",
        };
        let { data, status } = await useFetch(
          `/users/paymentmethod/${authStore.authUser?._id}`,
          {
            method: "POST",
            data: paymentdata,
          }
        );
        if (data.value.success === true) {
          state.loading = false;
          saveUserDefaultPayment(data.value.reponse);
          emits("close", true);
        }
      }
    });
};

const createAndMountFormElements = async () => {
  state.stripe = await loadStripe(authStore.appSettings[0].stripepublickey);
  var elements = state.stripe.elements();
  state.cardNumberElement = elements.create("cardNumber");
  state.cardNumberElement.mount("#card-number-element");
  state.cardExpiryElement = elements.create("cardExpiry");
  state.cardExpiryElement.mount("#card-expiry-element");
  state.cardCvcElement = elements.create("cardCvc");
  state.cardCvcElement.mount("#card-cvc-element");
  state.cardNumberElement.on("change", setValidationError);
  state.cardExpiryElement.on("change", setValidationError);
  state.cardCvcElement.on("change", setValidationError);
};
const handleClose = () => emits("close");
</script>
