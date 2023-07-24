<template>
  <div
    class="content-container mx-auto flex flex-col py-16 relative w-full gap-6"
  >
    <div class="flex flex-col gap-4">
      <p class="text-2xl font-semibold tracking-wide">
        Products ({{ state.products.length }})
      </p>
      <p
        v-if="state.products.length === 0 && !state.loading"
        class="text-lg font-medium text-info"
      >
        No products fit this search criteria
      </p>
      <spinner-v2 :load="state.loading" />
      <div
        v-if="state.products.length > 0 && !state.loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 lg:gap-x-6 gap-y-6 w-full"
      >
        <product-card
          v-for="product in state.products"
          :key="product._id"
          :product="product"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-2xl font-semibold tracking-wide">
        Shops ({{ state.shops.length }})
      </p>
      <p
        v-if="state.shops.length === 0 && !state.loading"
        class="text-lg font-medium text-info"
      >
        No shops fit this search criteria
      </p>

      <div
        v-if="state.shops.length > 0 && !state.loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 lg:gap-x-6 gap-y-6 w-full"
      >
        <popular-shop-card
          v-for="(shop, index) in state.shops"
          :key="index"
          :shop="shop"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-2xl font-semibold tracking-wide">
        Shows ({{ state.tokshows.length }})
      </p>
      <p
        v-if="state.tokshows.length === 0 && !state.loading"
        class="text-lg font-medium text-info"
      >
        No shows fit this search criteria
      </p>
      <div
        v-if="state.tokshows.length > 0 && !state.loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 lg:gap-x-6 gap-y-6 w-full"
      >
        <tok-show-card
          v-for="(show, index) in state.tokshows"
          :key="index"
          :event="show"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import {defineAsyncComponent, onMounted, reactive, watch} from "vue";
import useFetch from "@/shared/composables/Fetch.js";
const  ProductCard = defineAsyncComponent({
  loader:() => import("@/shared/components/Cards/ProductCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  PopularShopCard = defineAsyncComponent({
  loader:() => import("@/modules/landing/components/cards/PopularShopCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  TokShowCard = defineAsyncComponent({
  loader:() => import("@/shared/components/Cards/TokShowCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";


const state = reactive({
  products: [],
  shops: [],
  tokshows: [],
  loading: false,
});

const router = useRouter();
const route = useRoute();

const searchProducts = async () => {
  state.loading = true;
  const { data } = await useFetch(
    `/products/paginated/allproducts?page=1&limit=15&featured=false&channel&title=${route.params.keyword}&price&userid&interest`
  );
  state.products = data.value.products;
  state.loading = false;
};

const searchShops = async () => {
  state.loading = true;
  const { data } = await useFetch(
    `shop/allshops/paginated?title=${route.params.keyword}&limit&page`
  );
  state.shops = data.value.shops;
  state.loading = false;
};

onMounted(() => {
  searchShops();
  searchProducts();
});

watch(route, (value) => {
  if (value.params.keyword) {
    searchProducts();
    searchShops();
  }
});
</script>
