<template>
  <div class="flex flex-col gap-3 py-8">
    <p class="text-[16px] leading-[1.5px] font-semibold text-primary -mb-8">Sort By</p>
  </div>
  <div v-for="sort in sorts" :key="sort.name" @click="handleClick(sort)" class="flex gap-3">
    <input
        :id="sort.name"
        :checked="sort.name === sortName"
        :readonly="true"
        class="w-6"
        type="radio"
    >
  <label @click="handleClick(sort)" :for="sort.name" class="labels">{{sort.name}}</label>
  </div>
</template>

<script setup>
import {useSort} from "@/store/sort.js";
import {storeToRefs} from "pinia";

const sortState = useSort()
const { sortName} = storeToRefs(sortState)

const handleClick = (sort) => {
  sortState.addSort(sort)
}

</script>

