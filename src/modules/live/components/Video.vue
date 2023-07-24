<template>
  <!-- video div -->
  <div class="flex flex-col w-full relative rounded-lg gap-6">
    <!--    spinner div-->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <spinner-v2 :load="loading"/>
    </div>

    <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-4
        rounded-lg  text-white">
<!--      {{state.diffTime}}-->
      <button
          v-if="event?.ownerId?._id === authStore.authUser?._id"
          class="primary-btn rounded-md  bg-red-500 px-10 py-4 text-lg tracking-wide font-semibold"
          @click="handleFollow">
        Go live
      </button>
    </div>
    <!-- chevron -->
    <div
        v-if="!state.loading"
        class="hidden xl:flex bg-white absolute -left-[52px] p-2 border-2 shadow-2xl
        cursor-pointer z-20"
        @click="emit('goFullScreen')"
    >
      <svg
          class="w-8 h-8 text-info"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            :d="[
            isFullScreen
              ? 'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              : 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
          ]"
            clip-rule="evenodd"
            fill-rule="evenodd"
        ></path>
      </svg>
    </div>

    <img
        alt="vid"
        class="h-96 xl:h-[60vh] rounded-lg bg-secondary" src="/imgs/airplayvideo.svg"
    >
    <div class="flex items-center gap-4 absolute z-50 top-5 left-5 text-white">
      <img
          :src="event?.ownerId?.profilePhoto || '/imgs/airplayvideo.svg'"
          alt="profile"
          class="rounded-full h-8 w-8 border-[0.1rem] p-1 object-contain"
      />
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium whitespace-nowrap">
          {{ event?.ownerId?.firstName }} {{ event?.ownerId?.lastName }}
        </p>
        <p class="text-sm font-semibold whitespace-nowrap">
          {{ event?.ownerId?.followers?.length }} followers
        </p>
      </div>
    </div>
    <div
        class="absolute flex flex-col md:flex-row gap-2 md:gap-4 right-5 top-5 items-center"
    >
      <button
          class="primary-btn px-6 py-1 text-xs md:text-sm"
          @click="handleFollow">
        {{ state.stateFollowing ? '+Follow' : '- Following' }}
      </button>

      <div
          class="rounded-[68px] bg-cream/80 justify-center flex items-center w-20 text-xs
          md:text-sm py-1 gap-2 hidden"
      >
        <svg
            class="h-4 text-secondary"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
          <path
              d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
          />
        </svg>
        1.2k
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-xl font-semibold tracking-wide">Description</p>
      <p class="font-medium tracking-wide leading-relaxed">
        {{ event?.description }}
      </p>
    </div>
  </div>
  <!-- ........ -->
</template>


<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed,reactive, watch} from "vue";
import {useAuthStore} from "@/store/auth.js";
import useFetch from "@/shared/composables/Fetch"
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";



const emit = defineEmits(["goFullScreen", "follow"]);
const props = defineProps(["isFullScreen", "event", "loading"]);

const authStore = useAuthStore()

const router = useRouter();
const route = useRoute()
const state = reactive({
  loading: false,
  stateFollowing: false,
  diffTime: ""
})

watch(props.event, () => {
  if (isFollowing.value === -1)
    state.stateFollowing = false
  if (isFollowing.value > -1) state.stateFollowing = true
})

const isFollowing = computed(() => props?.event?.ownerId?.followers?.findIndex(item => item === authStore?.authUser?._id))



const handleFollow = async () => {
  await useFetch(`/users/${isFollowing.value === -1 ? 'follow' : 'unfollow'}/${authStore.authUser._id}/${props.event.ownerId._id}`, {
    'method': 'PUT'
  })
  state.stateFollowing = !state.stateFollowing
  emit("follow")

}

// const getTimeDifference = () => {
//   const currentTime = Date.now();
//   const eventTime = props.event.eventDate
//   const diffTime = eventTime - currentTime
//   let duration = moment.duration(diffTime * 1000, 'milliseconds')
//   duration =  moment.duration(duration - 1000, 'milliseconds');
//   state.diffTime =  duration.hours() + ":" + duration.minutes() + ":" + duration.seconds()
// }
//
// setInterval(() => {
//   getTimeDifference()
// }, 1000)



// console.log("curr", Date.now())



    //
    // var eventTime= props.event.eventDate; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
    // var currentTime = Date.now(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
    // var diffTime = eventTime - currentTime;
    // var duration = moment.duration(diffTime *1, 'milliseconds');
    // var interval = 1000;
    //
    // setInterval(function(){
    //   duration = moment.duration(duration - interval, 'milliseconds');
    //   state.diffTime =  duration.hours() + ":" + duration.minutes() + ":" + duration.seconds()
    //
    // }, interval);







</script>
