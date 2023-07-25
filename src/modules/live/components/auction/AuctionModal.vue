<template>
  <div class="dialog-wrapper">
    <div class="dialog flex flex-col gap-5 shadow-2xl border-[1px]">
      <p class="text-2xl font-semibold">Müzayede Ayarları</p>
      <p class="text-info text-3xl font-semibold">{{ product.name }}</p>
      <p class="text-info font-medium text-lg">Stok: {{ product.quantity }}</p>

      <form class="flex flex-col gap-5 items-center">
        <tok-input
          min="0"
          id="starting-bid"
          v-model="state.startingBid"
          :required="true"
          class="w-full"
          label="Başlangıç Teklifi"
          placeholder=" "
          type="number"
        />
        <tok-input
          min="0"
          id="increaseBy"
          v-model="state.increaseBidBy"
          :required="true"
          class="w-full"
          label="Teklif Artışı"
          placeholder=" "
          type="number"
        />
        <tok-input
            min="10"
            id="time"
            v-model="state.time"
            :required="true"
            class="w-full"
            label="Zaman"
            placeholder=" "
            type="number"
        />
        <div class="flex w-full gap-3 items-center">
          <div
            v-for="split in state.splits"
            :class="[
              state.time === split
                ? 'border-info shadow-2xl'
                : 'border-primary',
            ]"
            class="px-4 py-1 rounded-md border-[1px] cursor-pointer"
            @click="state.time = split"
          >
            {{ split }} Dakika
          </div>
        </div>
        <spinner-v2 :load="state.loading"/>
        <div v-if="!state.loading" class="w-full flex justify-between mt-20">
          <button class="outline-btn" type="button" @click="emits('close')">
            Vazgeç
          </button>
          <button
            :disabled="
              !state.startingBid || !state.time || !state.increaseBidBy
            "
            class="primary-btn"
            type="button"
            @click="handleSubmit"
          >
            Müzayedeyi Başlat
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import TokInput from "@/shared/components/Fields/TokInput.vue";
import {reactive, toRaw, watch} from "vue";
import { useFetch } from "@/shared/composables/Fetch.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import useAuction from "@/modules/live/store/AuctionStore.js";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth.js";
import {useAgora} from "@/modules/live/composables/Agora.js";
import useAgoraStore from "@/store/agoraStore.js";
const authStore = useAuthStore();
const emits = defineEmits(["close"]);
const props = defineProps(["product",]);
const auctionStore = useAuction();
const route = useRoute();

const { addAuction } = auctionStore;
const agoraStore = useAgoraStore()
const {sendRTMMessage} = useAgora()

const state = reactive({
  startingBid: "",
  time: "",
  increaseBidBy: "",
  splits: [10, 20, 30, 50, 100],
  loading: false,
});

const handleSubmit = async (evt) => {
  evt.preventDefault();

  state.loading = true;

  let { status, data } = await useFetch("/auction", {
    method: "POST",
    data: {
      "baseprice": state.startingBid,
      "product": props.product?._id,
      "duration": state.time,
      "started": false,
      "tokshow": route.params.roomId,
      "increaseBidBy": state.increaseBidBy
    }
  })

  if (status.value === 200) {
    addAuction(data.value);
    console.log({
      action: "activeauction",
      userData: { productid: props.product?._id },
      roomId: route.params.roomId,
      otherdata: data.value,
    });

    const channel = toRaw(agoraStore.RTMChannel)

    sendRTMMessage({
      message: {
        action: "activeauction",
        userData: { productid: props.product?._id },
        roomId: route.params.roomId,
        otherdata: data.value,
      },channel: channel
    });
    Swal.fire({
      icon: "success",
    }).then(() => {
      emits("close");
    });
  }
  state.loading = false;
};

watch(props, (value) => {
  console.log("props", value);
});
</script>
