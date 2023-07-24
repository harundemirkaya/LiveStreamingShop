<template>
  <div class="w-full h-full flex flex-col py-2">
    <div
      id="msgDIV"
      class="flex flex-col h-full w-full gap-3 lg:gap-8 overflow-y-scroll parent px-4 lg:px-20 mb-2 lg:mb-4 pb-16 lg:pb-20"
    >
      <msg-box
        v-if="!loading"
        v-for="chat in chatStore.chatHistory"
        :key="chat"
        :chat="chat"
      />
      <spinner-v2 :load="loading" />
    </div>

    <hr />
    <div class="flex w-full h-14 gap-3 mt-4 px-4 lg:px-20 items-center">
      <form @submit="handleSubmit" class="w-full">
        <input
          v-model="state.msg"
          class="rounded-[20px] h-8 border-[1px] border-primary placeholder:text-primary py-[10px] px-4 w-full"
          placeholder="Message"
          type="text"
        />
      </form>
      <img alt="" class="w-5" src="/imgs/placeholder.svg" />
      <svg
        class="w-6 text-blue-500"
        fill="currentColor"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        @click="handleSubmit"
      >
        <path
          d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useInbox } from "@/modules/messaging/composables/useInbox.js";
import { useAuthStore } from "@/store/auth.js";

const  MsgBox = defineAsyncComponent({
  loader:() => import("@/modules/messaging/components/MsgBox.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import { useRoute } from "vue-router";
import {defineAsyncComponent, onMounted, reactive} from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useSendMsg } from "@/modules/live/composables/SendMsg";
import { useChat } from "@/store/chat";


const { sendMsg, updateMsg, addInbox } = useSendMsg();
const authStore = useAuthStore();
const chatStore = useChat();
const route = useRoute();
const state = reactive({
  msg: "",
  chatHistory: [],
});

onMounted(() => {
  window.scrollTo(0, 0);
  getChatsHistory();
});

const handleSubmit = (evt) => {
  let chatWith = chatStore.currentChat;
  evt.preventDefault();
  if (state.msg) {
    if (chatStore.chatHistory.length > 0) {
      updateMsg({
        path: "chats/" + chatStore.currentChat.id,
        data: {
          lastMessage: state.msg,
          lastMessageTime: Date.now(),
          lastSender: authStore?.authUser?._id,
        },
      });
    } else {
      addInbox({
        path: "chats/" + chatStore.currentChat.id,
        data: {
          lastMessage: state.msg,
          lastMessageTime: Date.now(),
          id: chatStore.currentChat.id,
          lastSender: authStore?.authUser?._id,
          userIds: [authStore?.authUser?._id, chatWith.user.id],
          [authStore?.authUser?._id]: 0,
          [chatWith.user.id]: 0,
          unread_users: [chatWith.user.id, authStore?.authUser?._id],
          users: [
            {
              firstName: authStore?.authUser?.firstName,
              id: authStore?.authUser?._id,
              lastName: authStore?.authUser?.lastName,
              profilePhoto: authStore?.authUser?.profilePhoto,
              userName: authStore?.authUser?.userName,
            },
            {
              firstName: chatWith.user.firstName,
              id: chatWith.user.id,
              lastName: chatWith.user.lastName,
              profilePhoto: chatWith.user.profilePhoto,
              userName: chatWith.user.userName,
            },
          ],
        },
      });
    }
    let path = `chats/${chatStore.currentChat.id}/messages`;
    sendMsg({
      path: path,
      data: {
        date: Date.now().toString(),
        id: chatStore.currentChat.id,
        message: state.msg,
        seen: true,
        sender: authStore.authUser.firstName,
        senderName: authStore.authUser.firstName ?? "",
        senderProfileUrl: authStore.authUser.profilePhoto ?? "",
        senderId: authStore.authUser?._id,
      },
    });
  }

  state.msg = "";
  const msgDiv = document.getElementById("msgDIV");
  msgDiv.scrollTop = msgDiv.scrollHeight;
};

const { msg, getChatsHistory, loading } = useInbox();
</script>

<style>
.parent {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.parent::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
