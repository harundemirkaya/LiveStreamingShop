<template>
  <div class="content-container mx-auto flex flex-col py-16 w-full gap-6">
    <p class="h3 font-semibold text-primary">
      Popular <span class="text-info"> Brands</span>
    </p>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-8 lg:gap-6"
    >
      <popular-shop-card
        v-for="shop in state.shops"
        :key="shop._id"
        :shop="shop"
      />
    </div>

    <spinner-v2 :load="state.loading" />
    <div
      v-if="state.totalDocs > state.shops.length && !state.loading"
      class="flex gap-2 items-center cursor-pointer justify-center"
      @click="fetchShops"
    >
      <p class="text-base text-primary font-semibold">View more</p>
      <svg
        class="w-6 h-6 text-primary font-semibold"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import useFetch from "@/shared/composables/Fetch";
import PopularShopCard from "./cards/PopularShopCard.vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

import { onMounted, reactive } from "vue";

const state = reactive({
  shops: [],
  loading: true,
  totalDocs: 0,
  pageCount: 1,
});

const fetchShops = async () => {
  state.loading = true;
  const { data, status } = await useFetch(
    `/shop/allshops/paginated?limit=10&page=${state.pageCount}`
  );
  if (status.value === 200) {
    state.shops = [...state.shops, ...data.value.shops];
    state.totalDocs = data.value.totalDoc;
    data.value.totalDoc > state.shops.length ? ++state.pageCount : null;
  }


  state.loading = false;
};

onMounted(() => {
  fetchShops();
});
</script>
