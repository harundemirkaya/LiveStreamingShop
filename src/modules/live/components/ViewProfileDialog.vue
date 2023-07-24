<template>

  <div
      class="flex flex-col rounded-t-xl bg-black p-4 text-white w-full md:w-[99.8%] gap-3 absolute  inset-x-0 bottom-0
       z-50 border-white border-[1px]">
    <div class="flex w-full items-center gap-2 relative">
      <img :src="senderProfileUrl || '/imgs/profile.svg' " alt="" class="w-8 h-8 rounded-full border-[1px] border-primary">
      <p class="text-lg font-semibold">{{ senderName }}</p>
      <svg
          aria-hidden="true"
          class="absolute w-6 top-0 right-0 text-white z-50"
          fill="none" stroke="#ffffff" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          @click="emits('close')">
        <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </div>

    <div class="flex w-full items-center gap-4" @click="emits('view', senderId)">
      <svg
          class="w-5"
          fill="none" stroke="#ffffff" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <p class="text-xl">View Profile</p>
    </div>

    <div class="flex w-full items-center gap-4">
      <svg
          aria-hidden="true"
          class="w-5"
          fill="none" stroke="#ffffff" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          @click="emits('close')">
        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
      </svg>
      <p class="text-xl">Block</p>
    </div>
  </div>
</template>

<script setup>

import {useRouter} from "vue-router";

const props = defineProps(['senderName', 'senderProfileUrl', 'senderId', 'route'])
const emits = defineEmits(['close', 'view'])
const router = useRouter()

</script>
