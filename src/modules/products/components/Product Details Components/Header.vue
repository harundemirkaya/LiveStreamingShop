<template>
  <div class="flex flex-col w-full gap-6">
    <p
      class="text-[24px] font-medium leading-[1.2] tracking-[0.007em] text-primary"
    >
      {{ name }}
    </p>
    <div class="flex items-center gap-4 w-full">
      <div v-for="channel in  interests" :key="channel._id" class="badge badge-lg">{{channel.name}}</div>
    </div>
    <div v-if="discountedPrice <= 0">
      <p class="text-[41px] font-medium text-primary">
        {{ getPriceFormatted(price) }}
      </p>
    </div>
    <div>
      <p
        v-if="discountedPrice > 0"
        class="text-[41px] font-medium text-primary"
      >
        {{ getPriceFormatted(discountedPrice) }}
      </p>
      <p class="text-[16px] font-medium text-primary line-through">
        {{ getPriceFormatted(price) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useUtils } from "@/shared/composables/utils";
const utils = useUtils();
const { getPriceFormatted } = utils;
const props = defineProps(["name", "price", "discountedPrice", "interests"]);
</script>
