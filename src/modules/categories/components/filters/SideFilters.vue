<template>
  <div class="hidden lg:flex flex-col sticky top-0 left-0 w-80 xl:pr-10 ">
   <categories-filters />
    <hr />
    <shop-by-price />
    <hr />
  </div>
</template>

<script setup>
import CategoriesFilters from "@/modules/categories/components/filters/CategoriesFilters.vue";
import ShopByPrice from "@/modules/categories/components/filters/ShopByPrice.vue";
</script>

