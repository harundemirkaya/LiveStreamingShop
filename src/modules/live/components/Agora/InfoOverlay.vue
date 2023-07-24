<template>
  <div

      :class="[state.isProfileDiagOpen ? 'z-50 h-full': 'z-20 h-fit']"
      class="flex flex-col w-full text-white h-full p-4 gap-3 absolute top-0 left-0"
  >
    <div class="flex gap-2 items-center w-full " @click="state.isProfileDiagOpen =!state.isProfileDiagOpen">
      <img
          :src="profilePhoto || '/imgs/profile.svg'"
          alt="/imgs/airplayvideo.svg"
          class="w-[32px] h-[32px] rounded-full object-contain"

      />
      <div class="flex gap-2 flex-col w-full">
        <p class="text-sm font-semibold tracking-wide">{{ firstName }} {{ lastName }}</p>
        <p class="text-xs font-medium">{{ followers }} Followers</p>
      </div>
      <svg
          v-if="!tokshowStore.tokshow.ended"
          class="justify-self-end cursor-pointer mr-6"
          fill="currentColor"
          height="16"
          stroke-width="2"
          viewBox="0 0 16 16"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          @click="emits('leave')"
          @click.stop=""
      >
        <path
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0
            0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            fill-rule="evenodd"
        />
      </svg>
        <view-profile-dialog
            v-if="state.isProfileDiagOpen && !useProfileDialog().isOpenInChat"
            :sender-name="firstName"
            :sender-profile-url="profilePhoto"
            sender-id=""
            @close="state.isProfileDiagOpen = false"
            @view="handleViewProfile"
            @click.stop=""/>
    </div>

    <div class="flex gap-2 items-center">
      <button
          v-if="!isOwner"
          class="primary-btn px-6 py-1 text-xs md:text-sm"
          @click="emits('follow')"
      >
        {{ isFollowing ? "  Unfollow" : "Follow" }}
      </button>
      <div
          class="rounded-[68px] bg-info justify-center flex items-center w-20 text-xs md:text-sm py-1 gap-2"
      >
        <svg
            class="h-4"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
          <path
              d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
          />
        </svg>
        {{ tokshowStore.tokshow?.userIds?.length }}
      </div>
      <ratings :rating="4"/>
    </div>
  </div>
</template>

<script setup>
import useTokshow from "@/store/useTokshow";
import Ratings from "@/modules/live/components/Ratings.vue";
import {useRouter} from "vue-router";
import {reactive} from "vue";
import ViewProfileDialog from "@/modules/live/components/ViewProfileDialog.vue";
import {useProfileDialog} from "@/modules/live/store/profileDialogStore.js";

const state = reactive({
  isProfileDiagOpen: false
})

const tokshowStore = useTokshow();
const {tokshow} = tokshowStore;

const props = defineProps([
  "followers",
  "firstName",
  "lastName",
  "isOwner",
  "profilePhoto",
  "isFollowing",
  "shopId"
]);
const emits = defineEmits(["follow", "leave"]);

const router = useRouter()

const handleViewProfile = () => {
  const routeData = router.resolve({name: "shop", params: {shopId: props.shopId}})
  window.open(routeData.href, '_blank')
  state.isProfileDiagOpen = false
}
</script>
