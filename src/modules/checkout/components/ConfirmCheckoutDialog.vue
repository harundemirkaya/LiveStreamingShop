<template>
  <div class="dialog-wrapper">
    <div class="dialog gap-6 border-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="text-info h-16"
        viewBox="0 0 16 16">
        <path
          d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
      </svg>
      <p class="text-primary text-2xl font-semibold tracking-wide">Thank You</p>
      <p class="font-medium">Your order has been placed!</p>
      <p class="font-medium -mt-4">Order no: 1234384783</p>
      <button @click="handleClose" class="outline-btn mt-6">
        Continue Shipping
      </button>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['close']);
const handleClose = () => emits('close');
</script>
