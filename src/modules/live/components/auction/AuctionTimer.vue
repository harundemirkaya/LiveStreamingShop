<template>
  <div class="flex items-center text-info text-2xl">
    {{ minutes }} : {{ seconds }}
  </div>
</template>

<script setup>
import { useCountDown } from "@/modules/live/composables/CountDown.js";
import { watch } from "vue";
import useAuction from "@/modules/live/store/AuctionStore.js";
import { useAuthStore } from "@/store/auth";
import { useAgora } from "../../composables/Agora";
import useAgoraStore from "@/store/agoraStore";
import { useFetch } from "@/shared/composables/Fetch";

const { startMinSecTimer, finished, minutes, seconds } = useCountDown();
const auctionStore = useAuction();
const { endAuction } = auctionStore;
const authStore = useAuthStore();
const { sendRTMMessage } = useAgora();
const agoraStore = useAgoraStore();

const props = defineProps(["duration", "startTime", "started"]);

watch(props, (value) => {
  if (value.started) startMinSecTimer({ seconds: props.duration });
});
const awardWinner = async () => {
  if (auctionStore.getHighestBidder) {
    sendRTMMessage({
      message: {
        action: "wonalert",
        userData: authStore.authUser,
        roomId: auctionStore.auction?.tokshow,
      },
      channel: agoraStore.RTMChannel,
    });

    let { data, status } = await useFetch(`/stripe/createIntent`, {
      method: "POST",
      data: {
        amount: auctionStore.getHighestBidder?.amount,
        confirm: "true",
        winnerId: auctionStore.getHighestBidder?.user._id,
        productOwner: authStore.authUser?._id,
      },
    });
    console.log(data);
    if (data.value.response === true) {
      createAuctionOrder();
    }
  } else {
    console.log("no winnder");
  }
};

const createAuctionOrder = async () => {
  let serviceFee =
    auctionStore.getHighestBidder?.amount *
    authStore.appSettings[0]?.commission;
  let orderDetails = {
    shippingId: authStore.authUser?.address?._id,
    paymentMethod: authStore.authUser?.defaultpaymentmethod?.name,
    productId: auctionStore?.auction?.product._id,
    shopId: authStore.authUser?.shopId._id,
    servicefee: parseInt(serviceFee),
    ordertype: "auction",
    auctionid: auctionStore?.auction?._id,
    subTotal: auctionStore.getHighestBidder?.amount - parseInt(serviceFee),
    tax: "0",
    shippingFee: authStore.authUser?.shopId?.shippingMethods[0]?.amount,
    shippingMethd: String(authStore.authUser?.shopId?.shippingMethods[0]),
    quantity: 1,
    productOwnerId: authStore.authUser?._id,
    variation: "",
  };
  console.log("orderDetails", orderDetails);
  let { data, status } = await useFetch(
    `/orders/${auctionStore.getHighestBidder?.user._id}`,
    {
      method: "POST",
      data: { order: [orderDetails] },
    }
  );
  console.log("order response", data.value);
};
watch([minutes, seconds], (values) => {
  if (values[0] === "00" && values[1] === "01") {
    endAuction();
    if (
      auctionStore.auction?.product?.ownerId?._id == authStore.authUser?._id
    ) {
      console.log("removing auction");
      sendRTMMessage({
        message: {
          action: "removeauction",
          userData: authStore.authUser,
          roomId: auctionStore.auction?.tokshow,
        },
        channel: agoraStore.RTMChannel,
      });
      useFetch(`/auction/${auctionStore.auction?._id}`, {
        method: "PUT",
        data: {
          winner: auctionStore.getHighestBidder?.user?._id,
          ended: true,
        },
      });

      awardWinner();

      // useFetch(`/rooms/rooms/${auctionStore.auction?.tokshow}`, {
      //   method: "PUT",
      //   data: { auctions: [auctionStore.auction?._id], activeauction: null },
      // });
    }
  }
});
</script>
