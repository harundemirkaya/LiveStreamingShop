<template>
  <div
    class="content-container mx-auto flex flex-col py-5 relative w-full gap-6"
  >
    <p class="h3 font-semibold text-primary">
      New <span class="text-info"> Collections </span>
    </p>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center w-full gap-8 lg:gap-12"
    >
      <product-card
        v-for="product in state.products"
        :key="product._id"
        :product="product"
      />
    </div>

    <spinner-v2 :load="state.loading" />
    <div
      v-if="state.totalDocs > state.products.length && !state.loading"
      class="flex gap-2 items-center cursor-pointer justify-center"
      @click="fetchProducts"
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
import { onMounted, reactive } from "vue";
import ProductCard from "@/shared/components/Cards/ProductCard.vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";


const state = reactive({
  products: [],
  loading: true,
  totalDocs: 0,
  pageCount: 1,
});

const fetchProducts = async () => {
  state.loading = true;
  const { data, status } = await useFetch(
    `/products/paginated/allproducts?limit=12&page=${state.pageCount}`
  );
  if (status.value === 200) {
    state.products = [...state.products, ...data.value.products];
    state.totalDocs = data.value.totalDoc;
    data.value.totalDoc > state.products.length ? ++state.pageCount : null;
  }

  state.loading = false;
};

onMounted(() => {
  fetchProducts();
});
</script>
