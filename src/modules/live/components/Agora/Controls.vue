<template>
  <div
    class="flex flex-col gap-6 justify-center items-center absolute z-20 bottom-10 right-6"
  >
    <button
      id="leave"
      class="hidden border-2 px-6 py-1 border-info rounded-md text-info text-xl bg-white"
      @click="emits('leave')"
    >
      Leave
    </button>
    <img
      v-if="isOwner || isSpeaker(authStore.authUser._id)"
      :src="
        authStore.authUser?.muted ? '/imgs/mic_off.svg' : '/imgs/mic_on.svg'
      "
      alt=""
      class="lg:p-3 rounded-full w-7 h-7 lg:w-12 lg:h-12"
      @click="emits('toggleSound', authStore.authUser)"
    />
    <img
      v-if="isOwner"
      :src="isVideoHidden ? '/imgs/video_off.svg' : '/imgs/video_on.svg'"
      alt=""
      class="lg:p-3 rounded-full w-7 h-7 lg:w-12 lg:h-12"
      @click="emits('toggleVideo')"
    />

    <div
      :class="[
        tokshowStore.tokshow?.raisedHands?.length > 0
          ? 'text-red-600'
          : 'text-white',
        isOwner ? 'lg:hidden' : '',
      ]"
      class="flex flex-col gap-1 items-center cursor-pointer cursor-pointer relative"
    >
      <svg
        aria-hidden="true"
        class="lg:p-3 rounded-full w-6 h-6 lg:w-12 lg:h-12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        @click="handleRaiseHand"
      >
        <path
          d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075
                 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75
                  6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <p class="text-xs">{{ isOwner ? "Raised Hands" : "Raise Hand" }}</p>
      <div
        v-if="tokshowStore.tokshow?.raisedHands?.length > 0"
        class="w-5 h-5 rounded-full absolute -top-[10%] text-xs flex items-center justify-center font-semibold -right-1 -translate-x-1/2 border-[1px] border-white bg-white text-red-500"
      >
        {{ tokshowStore.tokshow?.raisedHands?.length }}
      </div>
    </div>

    <div
      v-if="!hasEnded"
      class="xl:hidden flex flex-col justify-center items-center relative"
    >
      <svg
        class="h-8 w-8 text-white cursor-pointer border-[1px] border-info p-2 rounded-full"
        fill="currentColor"
        stroke="#0000"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        @click="emits('openShop')"
      >
        <path
          d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        />
      </svg>

      <p class="text-white">store</p>
      <div
        v-if="tokshowStore.tokshow?.productIds?.length > 0"
        class="w-5 h-5 rounded-full absolute -top-1/4 text-xs flex items-center justify-center font-semibold -right-5 -translate-x-1/2 border-[1px] border-white bg-white text-red-500"
      >
        {{ tokshowStore.tokshow?.productIds?.length }}
      </div>
    </div>

    <div
      @click="emits('toggleShareModal')"
      v-if="!hasEnded"
      class="flex flex-col justify-center items-center relative w-6 text-white gap-1 cursor-pointer"
    >
      <svg
        @click="emits('toggleShareModal')"
        class=""
        fill="currentColor"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499
             0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0
              1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
        />
      </svg>
      <p class="text-xs">Share</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth.js";
import { useFetch } from "@/shared/composables/Fetch.js";
import { useRoute } from "vue-router";
import useTokshow from "@/store/useTokshow.js";

const props = defineProps([
  "isVideoHidden",
  "isOwner",
  "hasJoined",
  "sendRTMMessage",
  "hasEnded",
]);
const emits = defineEmits([
  "toggleVideo",
  "toggleSound",
  "leave",
  "openShop",
  "toggleHandModal",
  "toggleShareModal",
]);

const authStore = useAuthStore();
const route = useRoute();
const roomId = route.params.roomId;
const tokshowStore = useTokshow();
const { addraisedHands, addSpeaker, isSpeaker } = tokshowStore;
const { setMuted } = authStore;

const handleRaiseHand = async () => {
  if (props.isOwner) {
    emits("toggleHandModal");
  } else {
    authStore.authUser["followers"] = null;
    authStore.authUser["following"] = null;

    addraisedHands(authStore.authUser);
    setMuted(true);
    await props.sendRTMMessage({
      message: {
        action: "added_raised_hands",
        userData: authStore.authUser,
        roomId: roomId,
      },
    });
  }

  await useFetch(`/rooms/rooms/${roomId}`, {
    method: "PUT",
    data: {
      raisedHands: [authStore.authUser],
      muted: true,
    },
  });
};
</script>
