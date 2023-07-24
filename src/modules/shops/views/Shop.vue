<template>
  <div class="flex flex-col content-container py-10 lg:py-16">
    <div class="flex flex-col items-center lg:items-start  lg:flex-row w-full gap-16 lg:gap-20">
      <img
        :src="state.shop?.image || '/imgs/mic_logo.png'"
        alt="img"
        class="w-32 h-32 md:w-60 md:h-60 lg:w-50 lg:h-50 xl:h-60 xl:w-60 lg:self-center cursor-pointer rounded-full object-cover border-2"
      />
      <div class="flex flex-col gap-6 max-w-sm text-center lg:text-start">
        <p class="text-3xl font-semibold text-primary tracking-wide">
          {{ state?.shop?.name || state?.shop?.userId?.userName }}
        </p>
        <p class="text-lg font-medium -mt-5">
          @{{ state?.shop?.name || state?.shop?.userId?.userName }}
        </p>
        <div class="flex items-center gap-4">
          <button
            v-if="
              !state.loading &&
              state?.shop?.userId?._id !== authStore?.authUser?._id
            "
            class="primary-btn text-white text-lg font-medium"
            @click="handleFollowClick"
          >
            <span> {{ state.isFollowing ? "Unfollow" : "follow" }} </span>
          </button>
          <spinner-v2 :load="state.loading" />
          <p class="text-lg font-medium text-primary w-full">
            {{ state?.followers }} following
          </p>
        </div>
        <p class="font-medium tracking-wide text-primary">
          {{ state.shop?.description }}
        </p>
        <div v-if="isMyShop && !state.loading" class="flex gap-4">
          <button
            class="btn btn-outline rounded-[44px] border-info text-primary hover:text-white hover:bg-info hover:border-info"
            @click="handleAdd"
          >
            Add Products
          </button>
          <button
            class="btn btn-outline rounded-[44px] border-info text-primary hover:text-white hover:bg-info hover:border-info"
            @click="handleEdit"
          >
            Edit Shop Details
          </button>
        </div>
      </div>
    </div>
  </div>

  <hr />
  <shop-shows v-if="state.shop?.userId" :user-id="state.shop?.userId?._id"  />

  <hr />
  <div
    class="flex flex-col content-container py-16"
    v-if="state.products.length > 0"
  >
    <p class="text-3xl font-semibold tracking-wide my-6">Products</p>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center w-full gap-8 lg:gap-12"
    >
      <product-card
        :editable="isMyShop"
        v-for="product in state.products"
        :key="product._id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import {computed, defineAsyncComponent, onMounted, reactive, watch} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFollow } from "@/shared/composables/follow.js";
import useFetch from "@/shared/composables/Fetch";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
const  ProductCard = defineAsyncComponent({
  loader:() => import("@/shared/components/Cards/ProductCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  ShopShows = defineAsyncComponent({
  loader:() => import("@/modules/shops/components/ShopShows.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})


const route = useRoute();
const router = useRouter();

const { follow, loading, checkFollowing } = useFollow();
const authStore = useAuthStore();

const state = reactive({
  isFollowing: false,
  shop: null,
  products: [],
  loading: false,
  followers: 0,
});

const isMyShop = computed(
  () => route.params.shopId === authStore?.authUser?.shopId?._id
);

const getShopById = async () => {
  state.loading = true;
  const { status, data } = await useFetch(`/shop/shop/${route.params.shopId}`);
  state.shop = data.value;
  state.followers = data?.value?.userId?.followers?.length;
  state.loading = false;

  if (status.value === 200) {

    state.isFollowing = checkFollowing({ followedId: data?.userId?._id });
  }
};

const getProductsByShop = async (userId) => {
  state.loading = true;
  const { data } = await useFetch(
    `/products/paginated/allproducts?userid=${userId}&page=1&limit=30`
  );
  state.products = data.value.products;
  state.loading = false;
  state.followers;
};

onMounted(async() => {
  window.scrollTo(0, 0);
  if (route.params.shopId) {
    await getShopById()
    await getProductsByShop(state.shop.userId._id);

  } else {
    router.push(`/shop/new`);
  }

  state.isFollowing = checkFollowing({ followedId: state?.shop?.userId?._id });
});


const handleAdd = () => {
  router.push(`/shop/add/${state?.shop?._id}`);
};

const handleEdit = () => {
  router.push(`/shop/edit/${state?.shop?._id}`);
};

watch(authStore, () => {
  state.isFollowing = checkFollowing({ followedId: state?.shop?.userId?._id });
});
const handleFollowClick = async () => {
  state.loading = true;
  await follow({ followedId: state?.shop?.userId?._id });
  state.loading = false;
  let following = checkFollowing({ followedId: state?.shop?.userId?._id });
  if (following) {
    ++state.followers;
  } else {
    state.followers = state.followers === 0 ? 0 : state.followers - 1;
  }
};
</script>
