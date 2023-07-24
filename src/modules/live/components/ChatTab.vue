<template>
  <div
      @click="state.openChatDiagDate= ''"
      :class="[auctionStore.auction ? 'bottom-36 xl:bottom-0' : 'bottom-0']"
      class="flex flex-col gap-2 h-80 text-white absolute lg:left-[35%] xl:left-0 w-72 z-30 py-4 bg-transparent
      xl:h-[90vh] xl:relative xl:w-full lg:justify-end lg:px-0 "
  >
    <div
        @click.stop=""
        id="chatDiv"
        ref="chatDivRef"
        class="flex flex-col justify-end gap-2 pl-4 w-full h-full overflow-y-scroll parent"
    >
      <div
          v-for="chat in state.chats"
          :id="chat.date"
          :key="chat.date"
          class="flex gap-1 items-center w-11/12 cursor-pointer"
          @click="openProfileDialog(chat.date)"
      >
        <img
            :src="chat.senderProfileUrl"
            alt=""
            class="rounded-full w-3 h-3 object-contain"
        />
        <div class="flex flex-col w-full">
          <p class="font-semibold text-[0.6rem] leading-snug">
            {{ chat.senderName }}
          </p>
          <p class="text-[.6rem] font-medium break-all w-full">
            {{ chat.message }}
          </p>
        </div>
        <view-profile-dialog
            class="w-screen min-[500px]:w-[100vw] md:w-[100vw] lg:w-[65vw] xl:w-[97.5%] fixed lg:-left-4 xl:inset-x-0  h-44 border-white border-[1px]"
            @click.stop=""
            @view="handleViewProfile(chat.id)"
            @close="closeProfileDialog"
            v-if="state.openChatDiagDate === chat.date && useProfileDialog().isOpenInChat"
            :sender-id="chat.senderId"
            :sender-name="chat.senderName"
            :sender-profile-url="chat.senderProfileUrl"/>
      </div>

    </div>

    <form
        :class="[state.focused ? 'mb-40 lg:mb-0': '']"
        class="w-full lg:w-10/12 pl-4 relative" @submit="handleSend">
      <input
          @focus="state.focused = true"
          @blur="state.focused = false"
          v-if="!tokshowStore.tokshow.ended"
          v-model="state.message"
          class="rounded-[20px] border-white border-[1px] w-10/12 xl:w-8/12 px-4 py-1 bg-transparent lg:text-white lg:mt-4 focus:outline-none placeholder:text-sm placeholder:text-white placeholder:tracking-wide"
          placeholder="Say something . . . "
          type="text"
      />
    </form>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {fireStore} from "@/shared/http/firebase-config.js";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {useAuthStore} from "@/store/auth.js";
import {defineAsyncComponent, reactive, ref} from "vue";
import {useSendMsg} from "@/modules/live/composables/SendMsg.js";
import useAuction from "@/modules/live/store/AuctionStore.js";
import useTokshow from "@/store/useTokshow.js";
const  ViewProfileDialog = defineAsyncComponent({
  loader:() => import("@/modules/live/components/ViewProfileDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import {useProfileDialog} from "@/modules/live/store/profileDialogStore.js";

const state = reactive({
  chats: [],
  message: "",
  openChatDiagDate: "",
  focused: false
});

const chatDivRef = ref(null);

const props = defineProps(["event"]);
const authStore = useAuthStore();
const auctionStore = useAuction();
const route = useRoute();
const router = useRouter()
let roomId = route.params.roomId;
const tokshowStore = useTokshow();

let path = `chats/${roomId}/messages`;
const {sendMsg} = useSendMsg();

const handleSend = async (evt) => {
  try {
    evt.preventDefault();
    if (state.message)
      sendMsg({
        path: path,
        data: {
          date: Date.now().toString(),
          id: roomId,
          message: state.message,
          seen: true,
          sender: authStore.authUser.firstName,
          senderName: authStore.authUser.firstName ?? "",
          senderProfileUrl: authStore.authUser.profilePhoto ?? "",
          senderId: authStore.authUser?._id
        },
      });

    state.message = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};


const q = query(collection(fireStore, path), orderBy("date", "asc"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  state.chats = [];
  querySnapshot.forEach((doc) => {
    state.chats.push(doc.data());
  });
});

const handleScroll = () => {
  const chatDiv = document.getElementById("chatDiv");
  chatDiv.scrollBy(0, -200);
};

const handleViewProfile = (senderId)=>{
  console.log('senderId', senderId)
  const routeData = router.resolve({name: "profile", params: {userId: senderId}})
  window.open(routeData.href, '_blank')
  state.openChatDiagDate = ""
}


const openProfileDialog = (date) => {
  state.openChatDiagDate = date
  useProfileDialog().toggleIsOpenInChat()
}


const closeProfileDialog = () =>{
  state.openChatDiagDate = ''
  useProfileDialog().toggleIsOpenInChat()

}

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
