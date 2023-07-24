<template>
<div class="flex flex-col gap-3 p-4 absolute top-10 right-0 z-50 bg-white border-[1px]
      rounded-xl">
  <p class="text-[16px] leading-[1.5px] font-medium text-primary mb-4">
    Sort By
  </p>
  <div v-for="sort in sorts" :key="sort.name" @click="handleClick(sort)" class="flex gap-3">
    <input
        :id="sort.name"
        :checked="sort.name === sortName"
        :readonly="true"
        class="w-6"
        type="radio"
    >
    <label @click="handleClick(sort)" :for="sort.name" class="labels">{{ sort.name }}</label>
  </div>
</div>
</template>

<script setup>
import {useSort} from "@/store/sort.js";
import {storeToRefs} from "pinia";


const emit = defineEmits(['close'])
const sortState = useSort()
const {sortName} = storeToRefs(sortState)
const handleClick = (sort) => {
  sortState.addSort(sort)
  emit('close')
}
</script>