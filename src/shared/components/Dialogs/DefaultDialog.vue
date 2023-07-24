<template>
  <div class="dialog-wrapper">
    <div class="dialog gap-6 border-0">
      <p class="text-primary text-1xl font-semibold tracking-wide text-center">
        {{ title }}
      </p>
      <p class="font-medium">{{ message }}</p>
      <div class="flex flex-row gap-8">
        <button
          v-if="showHandler"
          @click="handleClick"
          class="outline-btn mt-6"
        >
          {{ buttonText ?? "Okay" }}
        </button>
        <button v-if="showCancel" @click="handleClose" class="mt-6">
          {{ cancelButtonText ?? "Cancel" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  "title",
  "message",
  "buttonText",
  "showCancel",
  "cancelButtonText",
  "showHandler",
]);
const emits = defineEmits(["close", "handler"]);
const handleClose = () => emits("close");
const handleClick = () => emits("handler");
</script>
