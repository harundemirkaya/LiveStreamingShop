<template>
  <div class="flex flex-row w-full justify-between my-5 items-center sticky top-0 bg-white z-20 py-2">
    <p class="base font-medium text-primary">{{results}} Results</p>
    <div class="flex gap-10 relative">
      <button
          @click="clearFilters"
          class="hidden lg:flex primary-btn items-center gap-2 border-0"
      >Clear filters
      </button>
      <button
          @click="emit('toggleSideFilters')"
          class="hidden lg:flex outline-btn items-center gap-2"
      >
        Hide Filters
        <!--     slider icon-->
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
        </svg>
      </button>
      <div class="flex items-center" ref="box">
        <button
            @click="state.isSortModalOpen = !state.isSortModalOpen"
            class="hidden lg:flex primary-outline-btn  items-center gap-2 border-0"
        >
          Sort By:
          <span class="font-semibold">{{ sortName }}</span>
          <!--        chevron down icon-->
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>
        <sort-modal v-if="state.isSortModalOpen" @close="state.isSortModalOpen = false"/>
      </div>
      <button
          @click="emit('toggleFilterModal')"
          class="lg:hidden outline-btn flex items-center gap-2"
      >
        Filter
        <!--     slider icon-->
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const  SortModal = defineAsyncComponent({
  loader:() => import("@/modules/categories/components/filters/SortModal.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import {defineAsyncComponent, reactive} from "vue";
import {useSort} from "@/store/sort.js";
import {storeToRefs} from "pinia";
import {useFilters} from "@/store/filters.js";
import {useRoute} from "vue-router";

const sortState = useSort()
const filterStore = useFilters()
const {setCatId} = filterStore
const route = useRoute()
const {sortName} = storeToRefs(sortState)



const state = reactive({
  isSortModalOpen: false
})


const emit = defineEmits(['toggleSideFilters', 'toggleFilterModal'])
const props= defineProps(['results'])
const clearFilters = () => {
  filterStore.$reset()
  sortState.$reset()
  setCatId(route.params.categoryId)
};

</script>
