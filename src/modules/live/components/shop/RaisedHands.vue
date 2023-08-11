<template>
  <div
      class="flex flex-col inset-0 z-50 bg-black/80 w-screen self-center h-screen fixed px-4
    lg:relative lg:w-full lg:h-full lg:text-primary items-center"
  >
  <div
  @click="refreshRaisedHands">
  <h1 style="color: white;">Yenile</h1>
  </div>
    <svg
        aria-hidden="true"
        class="absolute top-4 z-50 right-8 h-8 w-8 lg:hidden cursor-pointer"
        fill="none"
        stroke="#ffffff"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        @click="emits('close')"
    >
      <path
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke-linecap="round"
          stroke-linejoin="round"
      ></path>
    </svg>
    <div class="flex flex-col w-11/12 gap-3 mt-20 lg:mt-0">
      <div
          v-for="user in tokShowStore.tokshow.raisedHands"
          :id="user._id"
          :key="user._id"
          class="flex gap-5 items-center w-full bg-white p-4 rounded-lg cursor-pointer"
      >
        <img
            :src="user?.profilePhoto || '/imgs/profile.svg'"
            alt="'/imgs/profile.svg'"
            class="rounded-full w-6 h-6 object-contain cursor-pointer"
            @click="router.push(`/profile/${user._id}`)"
        />
        <div class="flex gap-2 items-center w-full">
          <p class="font-semibold text-[1rem] leading-snug w-24 cursor-pointer" @click="router.push(`/profile/${user._id}`)">
            {{ user?.firstName }} {{ user?.lastName }}
          </p>

          <div
              v-if="
              (isSpeaker(user._id) && authStore.authUser._id === user._id) ||
              (isOwner && isSpeaker(user._id))
            "
              class="ml-auto"
              @click="emits('toggleSound', user)"
          >
            <!--                unmuted-->
            <svg
                v-if="!user.muted"
                class="h-8 w-8 cursor-pointer ml-auto"
                fill="#000000"
                height="800px"
                stroke="#ffffff"
                viewBox="0 0 56 56"
                width="800px"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M 35.1016 28.0000 L 35.1016 11.2656 C 35.1016 6.9297 32.1719 3.7187 28 3.7187 C 23.8281 3.7187 20.8984 6.9297 20.8984 11.2656 L 20.8984 28.0000 C 20.8984 32.3125 23.8281 35.5469 28 35.5469 C 32.1719 35.5469 35.1016 32.3125 35.1016 28.0000 Z M 17.0547 48.7422 C 16.1172 48.7422 15.2969 49.5859 15.2969 50.5234 C 15.2969 51.4609 16.1172 52.2813 17.0547 52.2813 L 38.9453 52.2813 C 39.8828 52.2813 40.7031 51.4609 40.7031 50.5234 C 40.7031 49.5859 39.8828 48.7422 38.9453 48.7422 L 29.7578 48.7422 L 29.7578 43.6094 C 38.2890 42.8594 43.9375 36.5547 43.9375 27.9766 L 43.9375 22.4687 C 43.9375 21.5547 43.1172 20.7578 42.2031 20.7578 C 41.2890 20.7578 40.4922 21.5547 40.4922 22.4687 L 40.4922 27.9766 C 40.4922 35.125 35.3359 40.375 28 40.375 C 20.6641 40.375 15.5078 35.125 15.5078 27.9766 L 15.5078 22.4687 C 15.5078 21.5547 14.7110 20.7578 13.7969 20.7578 C 12.8828 20.7578 12.0625 21.5547 12.0625 22.4687 L 12.0625 27.9766 C 12.0625 36.5547 17.7110 42.8594 26.2188 43.6094 L 26.2188 48.7422 Z"
              />
            </svg>
            <!--                muted-->
            <svg
                v-else
                class="h-8 w-8 cursor-pointer ml-auto"
                fill="#000000"
                height="48"
                stroke="#ffffff"
                viewBox="0 0 48 48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h48v48H0zm0 0h48v48H0z" fill="none"/>
              <path
                  d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z"
              />
            </svg>
          </div>

          <div
              v-if="isOwner && !isSpeaker(user._id)"
              class="ml-auto text-info font-semibold cursor-pointer"
              @click="inviteToSpeak(user)"
          >
            Allow
          </div>
          <div
              v-if="isOwner"
              class="ml-auto text-info font-semibold cursor-pointer"
              @click="removeSpeakorRaisedHand(user)"
          >
            {{ isSpeaker(user._id) ? "Remove" : "Reject" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
import useTokshow from "@/store/useTokshow.js";
import {useAuthStore} from "@/store/auth.js";
import {useRoute, useRouter} from "vue-router";
import {useFetch} from "@/shared/composables/Fetch";
import {useAgora} from "@/modules/live/composables/Agora.js";
import useAgoraStore from "@/store/agoraStore.js";

const props = defineProps(["event", "sendRTMMessage", "isOwner"]);
const emits = defineEmits(["toggleSound", "close"]);
const authStore = useAuthStore();
const state = reactive({
  tab: "shop",
  on: true,
});
const route = useRoute();
const router = useRouter()
const roomId = route.params.roomId;

const tokShowStore = useTokshow();
const {addSpeaker, isSpeaker, removeSpeakerRaisedHand} = tokShowStore;
const {sendRTMMessage} = useAgora();
const agoraStore = useAgoraStore();

const inviteToSpeak = async (user) => {
  addSpeaker(user._id);

  await sendRTMMessage({
    message: {
      action: "add_speaker",
      userData: user,
      roomId: roomId,
    },
    channel: agoraStore.RTMChannel,
  });
};

const refreshRaisedHands = async () => {
  try {
    const response = await useFetch(`/rooms/rooms/${roomId}`);
    if(response && response.data) {
      tokShowStore.tokshow.raisedHands = response.data.value.raisedHands;
    }
  } catch(error) {
    console.error("Raised hands bilgilerini yenileme sırasında bir hata oluştu:", error);
  }
};

const removeSpeakorRaisedHand = async (user) => {
  removeSpeakerRaisedHand(user._id);
  await sendRTMMessage({
    message: {
      action: "remove_invited_speaker",
      userData: user,
      roomId: roomId,
    },
    channel: agoraStore.RTMChannel,
  });
  await sendRTMMessage({
    message: {
      action: "remote_muted",
      userData: user,
      roomId: roomId,
      extra: true,
    },
    channel: agoraStore.RTMChannel,
  });

  await useFetch(`/rooms/raisedhans/remove/${roomId}`, {
    method: "PUT",
    data: {
      users: [user._id],
    },
  });
  await useFetch(`/rooms/invitedSpeaker/remove/${roomId}`, {
    method: "PUT",
    data: {
      users: [user._id],
    },
  });
};
</script>
