<template>
  <div
    class="flex flex-row text-primary gap-4 lg:gap-8 py-2 overflow-x-scroll px-4 parent"
  >
    <p
      v-for="category in state.categories"
      :key="category._id"
      @click="handleClick(category._id)"
      class="top-bar-text"
    >
      {{ category.title }}
    </p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
import { useFetch } from "@/shared/composables/Fetch";

onMounted(() => {
  fetchAllCategories();
});

const state = reactive({
  categories: [],
  isLoading: false,
});

const fetchAllCategories = async () => {
  const result = await useFetch("channels");
  state.categories = result.data.value;
};

const router = useRouter();

const handleClick = (id) => {
  router.push(`/categories/${id}`);
};
</script>

<style scoped>
.parent {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}
.parent::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
