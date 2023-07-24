<template>
  <div class="flex flex-col gap-5 w-full p-4">
    <div class="flex flex-col gap-5 w-full">
      <!-- accordion head -->
      <div
        @click="emit('toggle', props.category.id)"
        class="flex items-center justify-between w-full cursor-pointer"
      >
        <p class="text-xl font-semibold">{{ props.category.header }}</p>
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            :d="[
              props.isOpen
                ? 'M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                : 'M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z',
            ]"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <!-- accordion body -->
      <div
        class="transition-all duration-300 accordion-content"
        :class="[props.isOpen ? 'flex' : 'hidden']"
      >
        <ul class="flex flex-col gap-2 pl-4">
          <li
            v-for="sub in props.category.subs"
            :key="sub"
            @click="emit('close')"
            class="cat-item"
          >
            {{ sub }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close", 'toggle']);
const props = defineProps(["category", "isOpen"]);

</script>

<style scoped>
.accordion-content {
  transition: max-height 0.3s ease-out, padding 0.3s ease;
}
</style>
