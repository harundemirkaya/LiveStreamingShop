<template>
  <div class="flex flex-col w-9/12 absolute z-40 gap-2 text-white bottom-4 p-4">
    <p
      v-if="
        auctionStore.auction?.bids?.length > 0 && !auctionStore.auction?.ended
      "
      class="font-semibold"
    >
      {{ auctionStore.getHighestBidder?.user?.firstName }} is winning
    </p>
    <p
      v-if="auctionStore?.getHighestBidder?.user && auctionStore.auction?.ended"
      class="font-semibold"
    >
      {{ auctionStore?.getHighestBidder?.user.firstName }} won!!
    </p>
    <div class="flex w-full justify-between items-center">
      <div
        v-if="auctionStore.auction"
        class="text-white font-semibold py-1 px-4 rounded-lg text-center"
      >
        {{ auctionStore.auction?.product?.name }}
      </div>
      <auction-timer
        v-if="auctionStore.auction && !auctionStore.auction?.ended"
        :duration="auctionStore.auction?.duration"
        :start-time="auctionStore.auction?.startTime"
        :started="auctionStore.auction?.started"
      />
    </div>

    <div
      v-if="
        !isOwner &&
        auctionStore.auction &&
        auctionStore.auction.started &&
        !auctionStore.auction.ended
      "
      class="flex w-full justify-center gap-4 lg:gap-6 items-center cursor-pointer px-1"
    >
      <p
        class="text-lg text-primary font-semibold tracking-wide px-4 py-1 rounded-[20px] bg-white w-44 text-center"
        @click="state.openCustomBidsModal = true"
      >
        Custom Bid
      </p>
      <button
        class="bg-info text-white rounded-[20px] px-4 py-1 tracking-wide font-semibold w-44 text-lg"
        @click="handleBid"
      >
        Bid ${{ auctionStore.getNextBid }}
      </button>
    </div>

    <div
      class="w-full flex justify-center items-center gap-2 text-white font-semibold rounded-3xl"
    >
      <button
        v-if="isOwner && auctionStore.auction?.started"
        class="primary-btn w-full"
        @click="state.openBidsModal = true"
      >
        {{ auctionStore.auction?.bids.length }} Bids, (Highest bid ${{
          auctionStore?.getHighestBid
        }})
      </button>

      <button
        v-else-if="
          isOwner &&
          auctionStore.auction &&
          !auctionStore.auction?.started &&
          !auctionStore.auction?.ended &&
          !tokshowStore.tokshow.ended
        "
        class="primary-btn w-full"
        @click="handleStartAuctionTimer"
      >
        Start Auction
      </button>
      <button
        v-else-if="
          !isOwner &&
          auctionStore.auction &&
          !auctionStore.auction?.started &&
          !auctionStore.auction?.ended
        "
        class="primary-btn w-full bg-gray-500"
      >
        Waiting auction to start
      </button>
      <button
        v-else-if="
          (!isOwner && auctionStore.auction && auctionStore.auction?.ended) ||
          tokshowStore.tokshow.ended
        "
        class="primary-btn w-full bg-gray-500"
      >
        Auction has ended
      </button>
    </div>
  </div>
  <BidsModal v-if="state.openBidsModal" @close="state.openBidsModal = false" />
  <CustomBidModal
    v-if="state.openCustomBidsModal"
    @handleBid="handleBid"
    @close="state.openCustomBidsModal = false"
  />

  <div v-if="state.roomAlertOpen">
    <room-alert-dialog
      @close="roomAlertToggle"
      title="To participate in live tokshows auctions we need your payment and shipping info"
      buttonText="Setup"
      message="Welcome to tokshow! in order to bid on auctions you need to add a payment method and shipping address. All bids and purchases are final"
    />
  </div>
  <div v-if="state.isOpen">
    <credit-card-token-dialog @close="roomAlertToggle" />
  </div>
</template>

<script setup>
import AuctionTimer from "@/modules/live/components/auction/AuctionTimer.vue";
import BidsModal from "@/modules/live/components/auction/BidsModal.vue";
import CustomBidModal from "@/modules/live/components/auction/CustomBidModal.vue";
import useAuction from "@/modules/live/store/AuctionStore.js";
import { reactive, toRaw} from "vue";
import { useAuthStore } from "@/store/auth.js";
import { useAgora } from "../../composables/Agora";
import useAgoraStore from "@/store/agoraStore.js";
import { useFetch } from "@/shared/composables/Fetch";
import useTokshow from "@/store/useTokshow";
import RoomAlertDialog from "@/shared/components/Dialogs/RoomAlertDialog.vue";
import CreditCardTokenDialog from "@/shared/components/Dialogs/CreditCardTokenDialog.vue";

const tokshowStore = useTokshow();

const { sendRTMMessage } = useAgora();
const agoraStore = useAgoraStore();

const authStore = useAuthStore();
const auctionStore = useAuction();
const state = reactive({
  openBidsModal: false,
  openCustomBidsModal: false,
  roomAlertOpen: authStore.authUser?.defaultpaymentmethod == null,
  isOpen: false,
});

const props = defineProps(["isOwner"]);

const roomAlertToggle = (close) => {
  if (close === true) {
    state.roomAlertOpen = false;
    state.isOpen = false;
  } else {
    state.roomAlertOpen = !state.roomAlertOpen;
    state.isOpen = !state.isOpen;
  }
};

const handleBid = ({ amount = auctionStore.getNextBid }) => {
  if (authStore.authUser?.defaultpaymentmethod == null) {
    dialogState.roomAlertOpen = !dialogState.roomAlertOpen;
    return;
  }
  const channel = toRaw(agoraStore.RTMChannel);
  let rawObj = toRaw(authStore.authUser);
  bid({ amount: amount, userObj: rawObj });
  rawObj["followers"] = null;
  rawObj["following"] = null;
  if (auctionStore.getUserBid(rawObj._id) === undefined) return;
  sendRTMMessage({
    message: {
      action: "bid",
      userData: rawObj,
      roomId: auctionStore.auction?.tokshow,
      otherdata: toRaw(auctionStore.getUserBid(rawObj._id)),
      extra: true,
    },
    channel: channel,
  });

  useFetch(`/auction/bid`, {
    method: "POST",
    data: {
      user: rawObj._id,
      amount: amount,
      auction: auctionStore.auction?._id,
    },
  });
};

const handleStartAuctionTimer = () => {
  const channel = toRaw(agoraStore.RTMChannel);
  if (agoraStore.RTMChannel === null) return;
  let rawObj = toRaw(authStore.authUser);
  rawObj["followers"] = null;
  rawObj["following"] = null;
  startAuction();
  sendRTMMessage({
    message: {
      action: "start_auction",
      userData: rawObj,
      roomId: auctionStore.auction?.tokshow,
      otherdata: {
        started: true,
        startedTime: auctionStore.auction?.startedTime,
      },
      extra: true,
    },
    channel: channel,
  });

  useFetch(`/auction/${auctionStore.auction?._id}`, {
    method: "PUT",
    data: {
      started: true,
      startedTime: Date.now(),
    },
  });
};

const { bid, startAuction, addAuction } = auctionStore;
</script>
