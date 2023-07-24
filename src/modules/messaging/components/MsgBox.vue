<template>
  <div
    :class="[
      chat?.senderId === useAuthStore().authUser?._id
        ? ' justify-end'
        : 'justify-start',
    ]"
    class="flex gap-1 w-full"
  >
    <img
      v-if="chat?.senderId !== useAuthStore().authUser?._id"
      :class="[
        chat?.senderId === useAuthStore().authUser?._id ? 'order-2' : 'order-1',
      ]"
      alt=""
      class="w-4 h-4 rounded-full self-end"
      src="/imgs/profile.svg"
    />
    <div
      :class="[
        chat?.senderId === useAuthStore().authUser?._id
          ? ' bg-info rounded-bl-md order-1'
          : 'order-2  bg-primary rounded-br-md',
      ]"
      class="shadow-lg rounded-t-md px-4 py-1 text-white font-light break-all max-w-md"
    >
      <p class="text-sm lg:text-lg tracking-wide">{{ chat.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth.js";

const props = defineProps(["chat"]);
</script>
