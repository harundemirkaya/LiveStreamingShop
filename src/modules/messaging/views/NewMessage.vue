<template>
  <div class="w-full h-full flex flex-col justify-center items-center px-4 text-center">
    <p class=" text-xl font-semibold">Your messages</p>
    <p class="text-secondary text-lg tracking-wide">Send private messaged, photos and videos to a friend or
      seller</p>
    <button class="primary-btn bg-black text-white mt-8 flex items-center gap-2 text-sm"
            @click="state.isNewMessageDialogOpen = true ">
      <svg
          aria-hidden="true"
          class="w-4" fill="#ffffff" stroke="currentColor" stroke-width="1.5"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            stroke-linecap="round"
            stroke-linejoin="round"></path>
      </svg>
      New Message
    </button>
  </div>
  <new-message-dialog @close="state.isNewMessageDialogOpen = false" v-if="state.isNewMessageDialogOpen" />

</template>

<script setup>
import {defineAsyncComponent, reactive} from "vue";
const  NewMessageDialog  = defineAsyncComponent({
  loader:() => import("@/modules/messaging/components/NewMessageDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})


const state = reactive({
  isNewMessageDialogOpen: false
})

</script>

