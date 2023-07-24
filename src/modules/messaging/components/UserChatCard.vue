<template>
  <div
    @click="gotoChat(chat)"
    class="flex flex-col gap-2 rounded-md px-4 py-2 cursor-pointer"
    :class="
      chatStore.currentChat?.id == chat.id
        ? 'bg-primary text-white '
        : 'text-primary '
    "
  >
    <div class="flex w-full gap-2 items-center">
      <img
        class="w-8 h-8 rounded-full border-[1px]"
        :src="chat?.user.profilePhoto || '/imgs/profile.svg'"
        alt=""
      />
      <div>
        <p class="text-xs font-semibold">{{ chat?.user.firstName }}</p>
        <p
          class="text-xs"
          :class="
            chat.unread_users != null &&
            chat.unread_users.filter((u) => u == authStore.authUser._id)
              .length > 0
              ? 'font-semibold text-orange-600'
              : ''
          "
        >
          {{ chat?.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSendMsg } from "@/modules/live/composables/SendMsg";
import { useAuthStore } from "@/store/auth";
import { useChat } from "@/store/chat";
import { useRouter } from "vue-router";


const { updateMsg } = useSendMsg();
const authStore = useAuthStore();
const props = defineProps(["chat"]);
const router = useRouter();
const chatStore = useChat();

const gotoChat = (chat) => {
  chatStore.currentChat = chat;

  router.push(`/messaging/${chat?.id}`);
  if (
    props.chat.unread_users != null &&
    props.chat.unread_users.filter((u) => u === authStore.authUser._id).length >
      0
  ) {
    updateMsg({
      path: "chats/" + chatStore.currentChat.id,
      data: {
        unread_users:
          props.chat.unread_users == null
            ? []
            : props.chat.unread_users.filter(
                (u) => u !== authStore.authUser._id
              ),
      },
    });
  }
};
</script>
