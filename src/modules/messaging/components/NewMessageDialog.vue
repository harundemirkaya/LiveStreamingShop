<template>
  <div class="dialog-wrapper bg-white/10" @click="emits('close')">
    <div class="dialog shadow-2xl gap-6" @click.stop="">
      <div class="flex w-full gap-3 items-center">
        <p class="text-lg">To:</p>
        <form @submit="searchUsers" class="w-full">
          <tok-input v-model="state.to" placeholder=" " />
        </form>
      </div>
      <p class="text-rose-500">{{ state.error }}</p>
      <div class="flex flex-col self-start">
        <p class="text-xl font-semibold">Suggested</p>
      </div>
      <spinner-v2 :load="loading" />
      <div class="divide-y-2 w-full">
        <div
          class="flex w-full gap-2 items-center cursor-pointer py-2"
          v-for="user in users"
          :key="user._id"
          @click="gotoChat(user)"
        >
          <img
            alt=""
            class="w-10 h-10 rounded-full border-primary"
            :src="
              user.profilePhoto !== '' ? user.profilePhoto : '/imgs/profile.svg'
            "
          />
          <p class="text-lg font-semibold">{{ user.firstName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useChat } from "@/store/chat";
import { useInbox } from "../composables/useInbox";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const chatStore = useChat();

const router = useRouter();
const authStore = useAuthStore();
const emits = defineEmits(["close"]);

const state = reactive({
  to: "",
  error: "",
});

const searchUsers = (evn) => {
  evn.preventDefault();
  state.error = "";
  let name = state.to;
  if (name.trim().length > 2) {
    searchUser(name.trim());
  } else {
    state.error = "enter atleast 3 characters to search";
  }
};
const gotoChat = (user) => {
  emits("close");
  chatStore.currentChat = {
    id: authStore.authUser._id + user._id,
    unread_users: [user._id],
    user: {
      firstName: user.firstName,
      id: user._id,
      lastName: user.lastName,
      profilePhoto: user.profilePhoto,
      userName: user.userName,
    },
    lastMessageTime: Date.now(),
  };
  chatStore.setChats(chatStore.currentChat);
  getInboxes();
};
const { getInboxes, searchUser, users, loading } = useInbox();
</script>
