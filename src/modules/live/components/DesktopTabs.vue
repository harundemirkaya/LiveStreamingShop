<template>
  <div class="hidden lg:flex flex-col w-full h-full gap-4 text-white">
    <div class="flex w-full justify-center p-4">
      <div class="tabs items-start w-full gap-4">
        <a
            :class="[state.tab === 'shop' ? 'tab-active' : 'text-white']"
            class="tab tab-lifted tab-lg text-left "
            @click="state.tab = 'shop'"
        >Buy Now</a
        >
        <a
            :class="[state.tab === 'hands' ? 'tab-active ' : 'text-white']"
            class="tab tab-lifted tab-lg"
            @click="state.tab = 'hands'"
        >Raised Hands</a
        >
        <a
            :class="[state.tab === 'auctions' ? 'tab-active ' : 'text-white']"
            class="tab tab-lifted tab-lg"
            @click="state.tab = 'auctions'"
        >Auctions</a
        >
      </div>
    </div>
    <div class="flex w-full text-white p-4">
      <shop-tab v-if="state.tab === 'shop'" :event="event"/>
      <raised-hands @toggle-sound="user =>emits('toggleSound', user)" v-if="state.tab === 'hands'" :is-owner="isOwner"/>
      <auctions-tab v-if="state.tab === 'auctions' && auctionStore().auction" />
    </div>
  </div>
</template>

<script setup>
import {defineAsyncComponent, reactive} from "vue";
const  ShopTab = defineAsyncComponent({
  loader:() => import("./shop/ShopTab.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  RaisedHands = defineAsyncComponent({
  loader:() => import("@/modules/live/components/shop/RaisedHands.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  AuctionsTab = defineAsyncComponent({
  loader:() => import("@/modules/live/components/shop/AuctionsTab.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import useTokshow from "@/store/useTokshow.js";
import {useAuthStore} from "@/store/auth.js";
import {useRoute} from "vue-router";
import {useFetch} from "@/shared/composables/Fetch";
import auctionStore from "@/modules/live/store/AuctionStore.js";

const props = defineProps([
  "event",
  "sendRTMMessage",
  "isOwner",
]);
const emits = defineEmits(["toggleSound"]);
const authStore = useAuthStore();
const state = reactive({
  tab: "shop",
  on: true,
});
const route = useRoute();
const roomId = route.params.roomId;

const tokShowStore = useTokshow();
const {addSpeaker, removeSpeakerRaisedHand} = tokShowStore;

const inviteToSpeak = async (user) => {
  addSpeaker(user._id);

  await props.sendRTMMessage({
    message: {
      action: "add_speaker",
      userData: user,
      roomId: roomId,
    },
  });
};
const removeSpeakorRaisedHand = async (user) => {
  removeSpeakerRaisedHand(user._id);
  await props.sendRTMMessage({
    message: {
      action: "remove_invited_speaker",
      userData: user,
      roomId: roomId,
    },
  });
  await props.sendRTMMessage({
    message: {
      action: "remote_muted",
      userData: user,
      roomId: roomId,
      extra: true,
    },
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
