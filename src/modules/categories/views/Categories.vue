<template>
  <div class="content-container flex flex-col lg:py-16 w-full min-h-[80vh]">
    <mobile-filter-modal  v-if="state.isMobileFilterModalOpen" @close="state.isMobileFilterModalOpen=false"/>
    <mobile-categories :selected-id="state.selectedCatId" @select="id => state.selectedCatId = id"/>
    <categories-nav
        :results="state.results"
        @toggleFilterModal="state.isMobileFilterModalOpen = !state.isMobileFilterModalOpen"
        @toggleSideFilters="state.isSideFiltersOpen = !state.isSideFiltersOpen"
    />
    <category-results @results="n => state.results= n" :isSideFiltersOpen="state.isSideFiltersOpen" :selected-id="state.selectedCatId" />
  </div>

</template>

<script setup>
const  MobileCategories = defineAsyncComponent({
  loader:() => import("@/modules/categories/components/filters/Mobile/MobileCategories.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  MobileFilterModal = defineAsyncComponent({
  loader:() => import("@/modules/categories/components/filters/Mobile/MobileFilterModal.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  CategoriesNav = defineAsyncComponent({
  loader:() => import("@/modules/categories/components/CategoriesNav.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import CategoryResults from "@/modules/categories/components/CategoryResults.vue";

import {defineAsyncComponent, onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import {useFilters} from "@/store/filters.js";

const state = reactive({
  selectedCatId: "",
  isMobileFilterModalOpen: false,
  isSideFiltersOpen: true,
  results: 0
})

const filterStore = useFilters()
const {setCatId} = filterStore

const route = useRoute()

onMounted(() => {
  setCatId(route.params.categoryId)
})

</script>
