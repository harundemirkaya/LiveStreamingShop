<template>
  <div
    @click="handleClick"
    class="flex flex-col h-[40vh] md:h-[30vh] lg:h-[25vh] xl:h-[35vh] 2xl:h-[35vh] flex-shrink-0 flex flex-col cursor-pointer w-full relative rounded-md hover:shadow-2xl hover:ring-[1px] hover:ring-gray-200 hover:ring-offset-8 hover:ring-offset-[7px] transition-all transition duration-150 delay-75 ease-in-out"
  >
    <div
      class="bg-white w-full h-14 flex gap-4 items-center py-1 px-1 rounded-t-md"
      @click.stop=""
    >
      <img
        :src="product?.shopId?.image || '/imgs/mic_logo.png'"
        alt="img"
        class="object-cover w-8 h-8 rounded-full"
      />
      <div class="flex flex-col truncate">
        <p class="text-xs xl:text-lg font-semibold w-full text">
          {{ product.name }}
        </p>
        <p class="text-xs xl:text-sm">{{ product.shopId?.name }}</p>
      </div>

      <button
        v-if="editable"
        class="primary-btn text-sm h-7 w-16 px-0 py-0 ml-auto"
        @click="handleEdit"
      >
        Düzenle
      </button>
    </div>
    <div
      :style="{
        backgroundImage: `url(${product?.images[0] || '/imgs/mic_logo.png'})`,
      }"
      class="h-full w-full bg-no-repeat bg-center rounded-xl bg-[#D3D3D3] relative bg-cover"
    >
      <div
        v-if="product?.discountedPrice > 0"
        class="absolute bottom-2 right-2 bg-black/70 rounded-md px-4 text-white text-lg font-normal tracking-wider"
      >
        <p>{{ getPriceFormatted(product?.discountedPrice) }}</p>
        <p class="line-through">{{ getPriceFormatted(product?.price) }}</p>
      </div>
      <div
        v-if="product?.discountedPrice < 1"
        class="absolute bottom-2 right-2 bg-black/70 rounded-md px-4 text-white text-lg font-normal tracking-wider"
      >
        {{ getPriceFormatted(product?.price) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUtils } from "@/shared/composables/utils";
import { useRouter } from "vue-router";

const props = defineProps(["product", "editable"]);
const router = useRouter();
const utils = useUtils();
const { getPriceFormatted } = utils;
const handleClick = () => {
  router.push(`/product/${props.product._id}`);
};

const handleEdit = () => {
  router.push(`/product/edit/${props.product._id}`);
};
</script>
