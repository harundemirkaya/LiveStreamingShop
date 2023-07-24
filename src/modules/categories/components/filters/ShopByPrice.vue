<template>
  <div class="flex flex-col gap-4 py-8">
    <p class="text-[16px] leading-[1.5px] font-semibold text-primary mb-4">Shop By Price</p>
    <div
        v-for="(price, idx) in prices"
        :key="price.min"
        class="flex gap-3 items-center hover:font-bold"
        @click="handlePriceClick({min: price.min, max: price.max, idx})"
    >
      <input
          type="checkbox"
          :id="idx"
          name="price"
          value="price"
          class="w-6"
          :checked="minPrice === price.min"
          :readonly="true"
      >
      <label
          @click="handlePriceClick({min: price.min, max: price.max, idx})"
          :for="idx"
             :class="[filterState.filters.minPrice === price.min ? 'font-bold': 'font-normal']"
             class="text-[16px] leading-[1.5px] text-primary cursor-pointer"
      >
        {{
          idx === prices.length - 1
              ? `Over $. ${price.min.toLocaleString("en-US")}`
              : `$. ${price.min.toLocaleString(
                  "en-US"
              )} - $. ${price.max.toLocaleString("en-US")}`
        }}
      </label>
    </div>

  </div>
</template>

<script setup>
import {useFilters} from "@/store/filters.js";
import {reactive} from "vue";
import {storeToRefs} from "pinia";

const state = reactive({
  index: null
})

const prices = [
  {
    min: 0,
    max: 2500,
  },
  {
    min: 2500,
    max: 5000,
  },
  {
    min: 5000,
    max: 10000,
  },
  {
    min: 10000,
  },
];
const filterState = useFilters()
const {minPrice} = storeToRefs(filterState)
const handlePriceClick = ({min, max, idx}) => {
  filterState.setPrice({min, max})
  state.index = state.index === idx ? null : idx
}

</script>
