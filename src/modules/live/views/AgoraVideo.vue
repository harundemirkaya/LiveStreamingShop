<template>
  <div
    class="flex flex-col w-full fixed inset-0 w-screen h-screen lg:h-[90vh] z-50 bg-black lg:relative lg:grid lg:grid-cols-3 xl:divide-x xl:divide-white xl:divide-x-2 xl:divide-gray-500">
    <desktop-tabs :event="state.event" :is-owner="isOwner" :sendRTMMessage="sendRTMMessage"
      @toggle-sound="(user) => toggleSound(user)" />
      <div class="col">
        <div id="videoDiv" :class="[!state.hasJoined ? 'bg-[length:50px_50px] ' : 'bg-center']"
      :style="{ backgroundImage: 'url(/imgs/mic_logo.png)' }"
      class="flex w-full lg:col-span-2 xl:col-span-1 lg:relative place-self-stretch" style="height: 50%;">
      <info-overlay :first-name="state?.event?.ownerId?.firstName" :followers="state?.event?.ownerId?.followers?.length"
        :is-following="state.isFollowing" :is-owner="isOwner" :last-name="state?.event?.ownerId?.lastName"
        :profile-photo="state?.event?.ownerId?.profilePhoto" :shopId="state.event?.shopId?._id"
        @follow="handleFollowClick" @leave="handleLeave" />

      <div class="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <spinner-v2 :load="state.loading || agoraLoading" />
      </div>
      <Controls v-if="!tokshowStore.tokshow.ended" :has-ended="state.event?.ended || hasEnded" :has-joined="hasJoined"
        :is-owner="isOwner" :is-video-hidden="isVideoHidden" :sendRTMMessage="sendRTMMessage" @leave="handleLeave"
        @toggle-sound="(user) => toggleSound(user)" @toggle-video="toggleVideo" @open-shop="state.openTab = 'shop'"
        @toggle-hand-modal="state.raisedHandsModal = !state.raisedHandsModal"
        @toggle-share-modal="state.shareModal = true" />
      <CountDown v-if="hours && !state.hasJoined && !hasArrived" :event="state.event" />

      <VideoActions :has-arrived="hasArrived" :has-ended="state.event?.ended || hasEnded" :has-joined="hasJoined"
        :is-owner="isOwner" :loading="agoraLoading || state.loading" @start-tok-show="handleStartTokShow" />
      <AuctionDisplay v-if="!state.loading && !agoraLoading && auctionStore.auction" :isOwner="isOwner" />
    </div>
    <div id="videoDivTwo" :class="[!state.hasJoined ? 'bg-[length:50px_50px] ' : 'bg-center']"
      :style="{ backgroundImage: 'url(/imgs/mic_logo.png)' }"
      class="flex w-full lg:col-span-2 xl:col-span-1 lg:relative place-self-stretch" style="height: 50%;">
      <info-overlay :first-name="state?.event?.ownerId?.firstName" :followers="state?.event?.ownerId?.followers?.length"
        :is-following="state.isFollowing" :is-owner="isOwner" :last-name="state?.event?.ownerId?.lastName"
        :profile-photo="state?.event?.ownerId?.profilePhoto" :shopId="state.event?.shopId?._id"
        @follow="handleFollowClick" @leave="handleLeave" />

      <div class="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <spinner-v2 :load="state.loading || agoraLoading" />
      </div>
      <Controls v-if="!tokshowStore.tokshow.ended" :has-ended="state.event?.ended || hasEnded" :has-joined="hasJoined"
        :is-owner="isOwner" :is-video-hidden="isVideoHidden" :sendRTMMessage="sendRTMMessage" @leave="handleLeave"
        @toggle-sound="(user) => toggleSound(user)" @toggle-video="toggleVideo" @open-shop="state.openTab = 'shop'"
        @toggle-hand-modal="state.raisedHandsModal = !state.raisedHandsModal"
        @toggle-share-modal="state.shareModal = true" />
      <CountDown v-if="hours && !state.hasJoined && !hasArrived" :event="state.event" />

      <VideoActions :has-arrived="hasArrived" :has-ended="state.event?.ended || hasEnded" :has-joined="hasJoined"
        :is-owner="isOwner" :loading="agoraLoading || state.loading" @start-tok-show="handleStartTokShowTwo" />
      <AuctionDisplay v-if="!state.loading && !agoraLoading && auctionStore.auction" :isOwner="isOwner" />
    </div>
      </div>
    

    <shop-tab v-if="state.openTab === 'shop'" :event="state.event" @close="state.openTab = ''" />

    <raised-hands v-if="state.raisedHandsModal" :event="state.event" :is-owner="isOwner" class="lg:hidden"
      @close="state.raisedHandsModal = false" @toggle-sound="(user) => toggleSound(user)" />
    <share-modal v-if="state.shareModal" facebook-url="https://www.facebook.com/sharer/sharer.php?u=tokshop.live"
      insta-url="https://www.instagram.com/?url=https://www.drdrop.co/" :whatsapp-url="state.whatsAppURL"
      :absolute-url="absoluteURL" @close="state.shareModal = false" />
    <chat-tab :event="state.event" />
  </div>
</template>

<script setup>
import { useFetch } from "@/shared/composables/Fetch.js";
import { useRoute, useRouter } from "vue-router";
import { computed, defineAsyncComponent, onMounted, onUnmounted, reactive, watch } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { useFollow } from "@/shared/composables/follow.js";

const ShopTab = defineAsyncComponent({
  loader: () => import("@/modules/live/components/shop/ShopTab.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const ChatTab = defineAsyncComponent({
  loader: () => import("@/modules/live/components/ChatTab.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const Controls = defineAsyncComponent({
  loader: () => import("@/modules/live/components/Agora/Controls.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const InfoOverlay = defineAsyncComponent({
  loader: () => import("@/modules/live/components/Agora/InfoOverlay.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const AuctionDisplay = defineAsyncComponent({
  loader: () => import("@/modules/live/components/auction/AuctionDisplay.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const DesktopTabs = defineAsyncComponent({
  loader: () => import("@/modules/live/components/DesktopTabs.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const VideoActions = defineAsyncComponent({
  loader: () => import("@/modules/live/components/Agora/VideoActions.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const CountDown = defineAsyncComponent({
  loader: () => import("@/modules/live/components/CountDown.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const RaisedHands = defineAsyncComponent({
  loader: () => import("@/modules/live/components/shop/RaisedHands.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const ShareModal = defineAsyncComponent({
  loader: () => import("@/modules/live/components/ShareModal.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useCountDown } from "@/modules/live/composables/CountDown.js";
import useAuction from "@/modules/live/store/AuctionStore.js";
import { useAgora } from "@/modules/live/composables/Agora.js";
import useTokshow from "@/store/useTokshow.js";


const auctionStore = useAuction();
const { startAuction } = auctionStore;

const emit = defineEmits(["goFullScreen", "follow"]);
const props = defineProps(["isFullScreen", "loading"]);

const authStore = useAuthStore();
const tokshowStore = useTokshow();
const { addTokshow } = tokshowStore;
const { follow, loading, checkFollowing } = useFollow();
const { startTimer, days, hours, minutes, seconds } = useCountDown();

const isOwner = computed(
  () => {
    return state?.event?.ownerId !== undefined && authStore.authUser?._id === state?.event?.ownerId?._id;
  });

const hasArrived = computed(
  () =>
    state?.event?.event === false ||
    (state?.event?.event && state?.event?.eventDate < Date.now())
);

const route = useRoute();
const router = useRouter();

const { addAuction } = auctionStore;
const absoluteURL = new URL(route.fullPath, window.location.origin).href;

const state = reactive({
  event: null,
  loading: false,
  isFollowing: false,
  openBidsModal: false,
  openCustomBidsModal: false,
  openTab: "",
  raisedHandsModal: false,
  shareModal: false,
  whatsAppURL: `whatsapp://send?text=Here's the link to the TokShow ${absoluteURL}`,
});

const {
  startCall,
  toggleSound,
  toggleVideo,
  leaveRTC,
  hasJoined,
  hasEnded,
  isVideoHidden,
  agoraLoading,
  sendRTMMessage,
  initRTM,
} = useAgora();

const handleStartTokShow = async () => {
  if (!isOwner.value && !hasArrived.value) return false;
  if (state.event?.event === true) {
    await useFetch(`/rooms/rooms/${route.params.roomId}`, {
      method: "PUT",
      data: {
        event: false,
      },
    });
  }
  await _startShow();
};

const handleStartTokShowTwo = async () => {
  if (!isOwner.value && !hasArrived.value) return false;
  if (state.event?.event === true) {
    await useFetch(`/rooms/rooms/${route.params.roomId}`, {
      method: "PUT",
      data: {
        event: false,
      },
    });
  }
  await _startShowTwo();
};

const getRoom = async () => {
  state.loading = true;
  const { data, status } = await useFetch(
    `/rooms/rooms/${route.params.roomId}`
  );
  state.event = data.value;
  addTokshow(data.value);
  state.loading = false;

  if (status.value === 200) addAuction(data.value?.activeauction);

  state.isFollowing = checkFollowing({ followedId: data?.value?.ownerId?._id });
};

const handleFollowClick = async () => {
  await follow({ followedId: state?.event?.ownerId?._id });
};

onMounted(async () => {
  console.log("onMounted");
  await leaveRTC({ isOwner: isOwner.value, roomId: route.params.roomId });
});

const handleLeave = async () => {
  await sendRTMMessage({
    message: {
      action: "leave",
      userData: authStore.authUser,
      roomId: route.params.roomId,
    },
  });
  await leaveRTC({ isOwner: isOwner.value, roomId: route.params.roomId });
  await useFetch(`/rooms/user/remove/${route.params.roomId}`, {
    method: "PUT",
    data: {
      users: [authStore.authUser?._id],
    },
  });
};
const _startShow = async () => {
  await getRoom();
  if (!state.event?.ended && state.event?.event === false) {
    console.log(isOwner.value);
    await startCall({
      isOwner: isOwner.value,
      divId: "videoDiv",
      roomId: route.params.roomId,
    });
    await initRTM({ roomId: route.params.roomId, isOwner: isOwner.value });
  }
};
onMounted(async () => {
  await _startShow();
  if (state.event?.event === true) {
    await startTimer({ scheduledTime: state.event?.eventDate });
  }
  if (state.event?.activeauction?.started) {
    startAuction();
  }
});

const _startShowTwo = async () => {
  await getRoom();
  if (!state.event?.ended && state.event?.event === false) {
    console.log(isOwner.value);
    await startCall({
      isOwner: false,
      divId: "videoDivTwo",
      roomId: route.params.roomId,
    });
    await initRTM({ roomId: route.params.roomId, isOwner: isOwner.value });
  }
};
onMounted(async () => {
  await _startShow();
  if (state.event?.event === true) {
    await startTimer({ scheduledTime: state.event?.eventDate });
  }
  if (state.event?.activeauction?.started) {
    startAuction();
  }
});

onUnmounted(() => {
  if (state.event?.started === true) {
    handleLeave();
  }
});

watch(authStore, () => {
  state.isFollowing = checkFollowing({
    followedId: state?.event?.ownerId?._id,
  });
});
</script>
