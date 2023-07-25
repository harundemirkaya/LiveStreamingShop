<template>
  <div v-if="!state.loading" class="flex flex-col gap-4 w-full lg:w-7/12">
    <div v-if="state.inCart" class="flex flex-col gap-2">
      <p class="text-lg font-medium tracking-wide">
        This item is already in your bag
      </p>
    </div>
    <button
        v-else-if="!isOwner"
        class="primary-btn py-5 px-[18px] rounded-[40px] border-2 border-transparent text-[16px] font-medium"
        @click="addToBag"
    >
      Buy now
    </button>
    <button
        v-if="favoriteStore.isFavorite(route.params.productId) === -1"
        class="outline-btn flex items-center justify-center py-5 px-[18px] rounded-[40px] gap-2 text-[16px] font-medium"
        @click="addToFavorite"
    >
      Favorite
      <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            clip-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            fill-rule="evenodd"
        ></path>
      </svg>
    </button>
    <button
        v-else
        class="outline-btn flex items-center justify-center py-5 px-[18px] rounded-[40px] gap-2 text-[16px] font-medium"
        @click="removeFavorite(route.params.productId)"
    >
      Remove from favorite
      <svg class="w-6 h-6" fill="currentColor" height="16"
           viewBox="0 0 16 16" width="16"
           xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.931.586 7 3l1.5 4-2 3L8 15C22.534 5.396 13.757-2.21 8.931.586ZM7.358.77 5.5 3 7 7l-1.5 3 1.815 4.537C-6.533 4.96 2.685-2.467 7.358.77Z"/>
      </svg>
    </button>
    <button
        v-if="isOwner && product.quantity > 0"
        :class="
        authStore.authUser?.payoutmethod == null
          ? 'bg-[#DDDDDD]'
          : 'bg-[#FF2323]'
      "
        :disabled="!authStore.authUser?.payoutmethod "
        class="bg-[#FF2323] primary-btn py-5 px-[18px]"
        @click="goLive"
    >
      Yayına Başla
    </button>
    <button @click="state.isShareModalOpen = true" class="primary-btn px-[18px] py-5">Share</button>
  </div>
  <spinner-v2 :load="state.loading"/>
  <share-modal
      facebook-url="https://www.facebook.com/sharer/sharer.php?u=tokshop.live"
      insta-url="https://www.instagram.com/?url=https://www.drdrop.co/"
      :whatsapp-url="state.whatsAppURL"
      :absolute-url="absoluteURL"
      v-if="state.isShareModalOpen" @close="state.isShareModalOpen = false" />
</template>

<script setup>
import {useCart} from "@/store/cart.js";
import {storeToRefs} from "pinia";
import {defineAsyncComponent, onMounted, reactive} from "vue";
import {useItems} from "@/shared/composables/Items.js";
import {useAuthStore} from "@/store/auth.js";
import {useFetch} from "@/shared/composables/Fetch.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import {useRoute, useRouter} from "vue-router";
import {useFavorite} from "@/store/favoriteStore.js";
import Swal from "sweetalert2";
const  ShareModal = defineAsyncComponent({
  loader:() => import("@/modules/live/components/ShareModal.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const props = defineProps(["product", "isOwner"]);
const route = useRoute();

const absoluteURL = new URL(route.fullPath, window.location.origin).href;

const state = reactive({
  inCart: false,
  loading: false,
  isShareModalOpen: false,
  whatsAppURL: `whatsapp://send?text=Check out this product from Tokshop ${absoluteURL}`
});

const {addItem, item, loading} = useItems();

const router = useRouter();
const authStore = useAuthStore();
const favoriteStore = useFavorite()
const {addFavorite, removeFavorite} = favoriteStore

// to ignore all methods and non-reactive props of the state we use storeToRefs
const {authUser: user} = storeToRefs(authStore);

const addToFavorite = async () => {
  addFavorite(route.params.productId)
  Swal.fire({
    icon: "success",
    text: "Added to favorite"
  })
};


const cart = useCart();
const {addToCart, getCartItemById} = cart;
const {products} = storeToRefs(cart);
const addToBag = () => {
  addToCart(props.product);
  state.inCart = true;
  router.push("/checkout")
};

const goLive = async () => {
  state.loading = true;
  const body = {
    title: props.product.name,
    roomType: "public",
    allowrecording: true,
    allowchat: true,
    discount: props.product.discountedPrice,
    productIds: [props.product._id],
    hostIds: [],
    userIds: [],
    raisedHands: [],
    speakerIds: [],
    invitedIds: [],
    shopId: props.product.shopId._id,
    status: true,
    ended: false,
    productPrice: [props.product.price],
    activeTime: Date.now(),
    channel: props.product.interest[0]?._id,
  };

  const {status, data} = await useFetch(
      `/rooms/${authStore?.authUser?._id}`,
      {
        method: "POST",
        data: body,
      }
  );

  if (status.value === 200) router.push(`/live/${data.value._id}`);

  state.loading = false;
};

onMounted(() => {
  const exists = getCartItemById(props.product._id);
  if (exists) state.inCart = true;
});
</script>
