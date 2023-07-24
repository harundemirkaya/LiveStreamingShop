<template>
  <div
    class="flex divide-x-2 content-container mx-auto max-w-8xl px-0 my-16 h-[80vh] border-[1px] rounded-xl shadow-2xl"
  >
    <div class="flex flex-col w-full w-[150px] md:w-[250px] lg:w-[350px] h-full divide-y-2">
      <div class="flex w-full">
        <div class="flex w-full px-8 mr-3 gap-2 h-[4rem] items-center truncate">
          <img
            :src="avatar || '/imgs/profile.svg'"
            alt=""
            class="w-8 h-8 rounded-full border-[1px] shadow-xl"
          />
          <p class="text-xs font-semibold">{{ name }}</p>
        </div>
        <button
          class="flex  items-center text-right cursor-pointer ml-auto mr-2"
          @click="state.isNewMessageDialogOpen = true"
        >
          <p class="text-sm text-info font-semibold">Add</p>
        </button>
      </div>
      <div class="w-full h-full px-2 py-2 flex flex-col gap-3 overflow-y-scroll">
        <user-chat-card
          v-for="chat in chatsStore.chats"
          :key="chat.id"
          :class="chat.id"
          :chat="chat"
        />
      </div>
    </div>

    <div class="flex flex-col w-full h-full gap-3">
      <div class="flex w-full h-[3rem]"></div>
      <inbox v-if="chatsStore.currentChat"/>
      <router-view v-if="!chatsStore.currentChat"/>
    </div>
  </div>
  <new-message-dialog
    @close="state.isNewMessageDialogOpen = false"
    v-if="state.isNewMessageDialogOpen"
  />
</template>

<script setup>
import {defineAsyncComponent, onMounted, reactive} from "vue";
const  NewMessageDialog = defineAsyncComponent({
  loader:() => import("@/modules/messaging/components/NewMessageDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  Inbox = defineAsyncComponent({
  loader:() => import("@/modules/messaging/views/Inbox.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  UserChatCard = defineAsyncComponent({
  loader:() => import("@/modules/messaging/components/UserChatCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

import { useChat } from "@/store/chat";
import { useInbox } from "../composables/useInbox";


const chatsStore = useChat();
const state = reactive({
  isNewMessageDialogOpen: false,
});
onMounted(() => {
  
})
const { avatar, name } = useInbox();
</script>
