import { reactive, toRaw, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCart } from "@/store/cart.js";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { useFetch } from "@/shared/composables/Fetch.js";
import { useAuthStore } from "@/store/auth.js";
import { loadStripe } from "@stripe/stripe-js/pure";
export const useCheckoutSummary = () => {
  const authStore = useAuthStore();

  const state = reactive({
    qty: 1,
    product: {},
    loading: false,
    shippingAddress: null,
    paymentOptions: [
      { name: "cc", enabled: true, default: true },
      { name: "cod", enabled: true, default: false },
    ],
    defaultPaymentOption: null,
    stripe: null, //Stripe(authStore.appSettings[0].stripepublickey),
    cardNumberElement: null,
    cardExpiryElement: null,
    cardCVCElement: null,
    stripeValidationError: "",
  });

  const router = useRouter();
  const cart = useCart();
  const {
    removeFromCart,

    setShipping,
    setShippingMethods,
  } = cart;
  const { shipping } = storeToRefs(cart);

  const setValidationError = (event) => {
    state.stripeValidationError = event.error ? event.error.message : "";
  };

  const createAndMountFormElements = async () => {
    state.stripe = await loadStripe(authStore.appSettings[0].stripepublickey);
    var elements = state.stripe?.elements();
    state.cardNumberElement = elements?.create("cardNumber");
    state.cardNumberElement?.mount("#card-number-element");
    state.cardExpiryElement = elements?.create("cardExpiry");
    state.cardExpiryElement?.mount("#card-expiry-element");
    state.cardCvcElement = elements?.create("cardCvc");
    state.cardCvcElement?.mount("#card-cvc-element");
    state.cardNumberElement?.on("change", setValidationError);
    state.cardExpiryElement?.on("change", setValidationError);
    state.cardCvcElement?.on("change", setValidationError);
  };

  const placeOrder = async () => {
    if (state.defaultPaymentOption == null) {
      Swal.fire({
        icon: "error",
        title: "Sorry!",
        text: "Select payment method",
      });
      return;
    }
    if (shipping == null) {
      Swal.fire({
        icon: "error",
        title: "Sorry!",
        text: "Select shipping method",
      });
      return;
    }
    state.loading = true;
    await saveOrder();
  };

  const saveOrder = async () => {
    const order = {
      shippingId: authStore.authUser.address?._id,
      paymentMethod: state.defaultPaymentOption.name,
      productId: cart.products[0].item._id,
      shopId: cart.products[0].item.shopId._id,
      total: cart.total,
      tax: 0,
      status:
        state.defaultPaymentOption.name === "cc" ? "pending" : "processing",
      shippingFee: cart.shipping.amount,
      shippingMethd: JSON.stringify(toRaw(cart.shipping)),
      quantity: cart.products[0].qty,
      productOwnerId: cart.products[0].item.ownerId._id,
      variation: "",
    };
    let { data: orderData } = await useFetch(
      "/orders/" + authStore.authUser?._id,
      {
        data: { order: [order] },
        method: "POST",
      }
    );
    if (orderData?.value?.success === true) {
      if (state.defaultPaymentOption.name === "cc") {
        _payWithCard(orderData);
      } else {
        Swal.fire({
          icon: "success",
          title: "Order Completed successfully!",
        }).then(() => {
          removeFromCart(cart.products[0].item._id);
          router.push("myorders");
        });
        state.loading = false;
      }
    }
  };

  const _payWithCard = async (orderData) => {
    await state.stripe
      .createToken(state.cardNumberElement)
      .then(async (result) => {
        if (result.error) {
          state.stripeValidationError = result.error.message;
          state.loading = false;
          Swal.fire({
            icon: "error",
            title: "Sorry!",
            text: result.error.message,
          });
        } else if (result.token) {
          let paymentdata = {
            productOwner: cart.products[0].item.ownerId._id,
            amount:
              orderData.value?.newOrder?.servicefee +
              orderData.value?.newOrder?.subTotal,
            cardid: result.token.id,
            confirm: true,
          };
          let { data: paymentResponse } = await useFetch(
            `/stripe/createIntent`,
            {
              method: "POST",
              data: paymentdata,
            }
          );
          if (paymentResponse.value.response === true) {
            await useFetch("/orders/orders/" + orderData.value?.newOrder?._id, {
              data: {
                status: "processing",
                shopId: orderData.value?.newOrder?.shopId.id,
              },
              method: "PUT",
            });

            Swal.fire({
              icon: "success",
              title: "Order Completed successfully!",
            }).then(() => {
              removeFromCart(cart.products[0].item._id);
              router.push("myorders");
            });
            state.loading = false;
          } else {
            Swal.fire({
              icon: "error",
              title: "Sorry!",
              text: "Error checking out",
            });
          }
        }
      });
  };
  const getProductById = async () => {
    state.loading = true;
    const { data, status } = await useFetch(
      `/products/products/${cart.products[0]._id}`
    );
    state.loading = false;

    if (status.value === 200) {
      state.product = data.value;
    }

    if (state?.product?.shopId?.shippingMethods.length > 0) {
      handleShipping(state?.product?.shopId?.shippingMethods[0]);
      setShippingMethods(state?.product?.shopId?.shippingMethods);
    } else {
      handleShipping({ amount: 0, name: "Free" });
      setShippingMethods([{ amount: 0, name: "Free" }]);
    }
  };

  const handleShipping = (option) => {
    setShipping(option);
  };

  const handleSetpaymentOption = (option) => {
    state.defaultPaymentOption = option;
    if (option.name === "cc") {
    }
  };

  return {
    ...toRefs(state),
    setValidationError,
    createAndMountFormElements,
    saveOrder,
    getProductById,
    handleShipping,
    handleSetpaymentOption,
    placeOrder,
  };
};
