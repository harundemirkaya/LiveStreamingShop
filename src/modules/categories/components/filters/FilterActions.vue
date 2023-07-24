<template>
  <div class="fixed -bottom-0 inset-x-0 z-50 bg-white border-t-2 ">
    <div class="flex flex-row justify-between w-full px-4 py-8 gap-4">
      <button
          @click="handleClear"
          class="outline-btn w-full py-4 px-2"
      >
        Clear
      </button>
      <button @click="handleApply" class="primary-btn w-full py-4 px-2">
        Apply
      </button>
    </div>
  </div>
</template>

<script setup>
import {useFilters} from "@/store/filters.js";
import {useSort} from "@/store/sort.js";
import {useRoute} from "vue-router";

const route = useRoute()

const emit = defineEmits(["close"])

const filterState = useFilters()
const {setCatId} = filterState
const sortState = useSort()
const handleClear = () => {
  filterState.$reset()
  sortState.$reset()
  setCatId(route.params.categoryId)
  emit('close')
}

const handleApply = () => {
  emit('close')
}
</script>

