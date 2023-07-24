<template>
  <div
    class="flex flex-col mt-16 w-full gap-8"
    v-if="state.products.length > 0"
  >
    <div class="flex justify-between">
      <p class="text-[20px] font-medium leading-6 self-center">
        You Might Also Like
      </p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center w-full gap-8 lg:gap-12"
    >
      <product-card
        :product="product"
        v-for="product in state.products"
        :key="product.id"
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
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/shared/components/Cards/ProductCard.vue";
import { useFetch } from "@/shared/composables/Fetch";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const state = reactive({
  scrollPos: null,
  products: [],
  totalDocs: 0,
  pageCount: 1,
  loading: false,
});
const props = defineProps(["product"]);

const router = useRouter();

onMounted(() => {
  fetchProducts();
});

const productId = router.currentRoute._rawValue.params.productId;
const fetchProducts = async () => {
  state.loading = true;
  let { data, status } = await useFetch(
    `/products/paginated/allproducts?limit=8&page=${state.pageCount}&channel=${props.product.interest && props.product.interest[0]? props.product.interest[0].channel:""}`
  );
  if (status.value === 200) {
    state.products = [...state.products, ...data.value.products];
    state.totalDocs = data.value.totalDoc;
    data.value.totalDoc > state.products.length ? ++state.pageCount : null;
  }
  state.loading = false;
};

const boxRefPos = ref({ isLeft: true, isRight: false });

const handleScrollLeft = () =>
  (document.getElementById("boxRef").scrollLeft -= 100);
const handleScrollRight = () =>
  (document.getElementById("boxRef").scrollLeft += 100);

const handleScroll = () => {
  const { scrollLeft, scrollWidth, clientWidth } =
    document.getElementById("boxRef");
  //end check
  if (scrollLeft + clientWidth > scrollWidth - 2)
    boxRefPos.value = { ...boxRefPos.value, isRight: true };
  else boxRefPos.value = { ...boxRefPos.value, isRight: false };

  // start check
  if (scrollLeft === 0) boxRefPos.value = { ...boxRefPos.value, isLeft: true };
  else boxRefPos.value = { ...boxRefPos.value, isLeft: false };
};
</script>
