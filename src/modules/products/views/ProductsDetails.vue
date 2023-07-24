<template>
  <div class="content-container flex flex-col py-16 min-h-screen">
    <spinner-v2 :load="loading" v-if="loading" />
    <div v-if="!loading && product" class="flex flex-col w-full">
      <div class="flex flex-col lg:flex-row w-full gap-x-16">
        <div class="flex w-7/12">
          <large-device-images :images="product?.images" />
        </div>
        <div class="flex flex-col gap-6 lg:gap-12 w-full lg:w-[500px]">
          <Header :name="product?.name" :interests="product.interest" :price="product?.price" :discountedPrice="product?.discountedPrice"  />
          <mobile-images :images="product?.images" />
          <product-details-actions :product="product" :is-owner="isOwner" />
          <product-description :description="product?.description" />
        </div>
      </div>
      <div class="flex flex-col w-full">
        <similar-products :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
const  LargeDeviceImages = defineAsyncComponent({
  loader:() => import("@/modules/products/components/Product Details Components/LargeDeviceImages.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  Header = defineAsyncComponent({
  loader:() => import("@/modules/products/components/Product Details Components/Header.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  MobileImages = defineAsyncComponent({
  loader:() => import("@/modules/products/components/Product Details Components/MobileImages.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  ProductDescription = defineAsyncComponent({
  loader:() => import("@/modules/products/components/Product Details Components/ProductDescription.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  SimilarProducts = defineAsyncComponent({
  loader:() => import("@/modules/products/components/Product Details Components/SimilarProducts.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import ProductDetailsActions from "@/modules/products/components/Product Details Components/ProductDetailsActions.vue";

import {computed, defineAsyncComponent, onMounted, ref, watch} from "vue";
import { useItems } from "@/shared/composables/Items.js";
import { useRoute } from "vue-router";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useAuthStore } from "@/store/auth.js";

const product = ref(null);
const { getItems, loading, items } = useItems();
const route = useRoute();
const authStore = useAuthStore();

const isOwner = computed(
  () => authStore.authUser?._id === product.value?.ownerId?._id
);

onMounted(() => {
  window.scrollTo(0, 0);
  getItems(`/products/products/${route.params.productId}`);
});

watch(items, (value) => {
  product.value = value;
});
</script>
