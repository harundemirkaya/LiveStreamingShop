<template>
  <div
      :class="[event?.shopId?.image ? 'bg-contain' : '']"
      :style="{backgroundImage: `url(${event?.event ? event?.productIds[0]?.images[0] || dummyImageUrl :event.shopId.image || dummyImageUrl })`}"
      class="flex flex-col bg-white card-border flex-shrink-0 bg-center bg-no-repeat
      rounded-lg hover:shadow-2xl relative h-[30vh] xl:h-[25vh] cursor-pointer"
      @click="handleClick"
  >
    <div v-if="!isLive">
      <Dates :date="event.eventDate" :event="event"/>
    </div>

    <div
        class="flex flex-row gap-x-[1rem] absolute left-0 bottom-0 z-20
         w-full px-4 pt-2 rounded-lg" 
    >
      <div
          class="flex gradient rounded-full h-8 w-8 border-[.1rem] border-gray-300
             self-center"
      >
        <img
            :src="event?.ownerId?.profilePhoto || dummyImageUrl"
            alt=""
            class="w-8 h-8 rounded-full self-center object-cover"
        />
      </div>

      <div class="flex flex-col w-[16rem]">
        <p class="font-[500] text-[1rem] mb-[1rem]  text-white">
          {{ event.ownerId.firstName }}{{ event.ownerId.lastName }}
          <br/>
          <span class="font-[500]  text-white">{{ event.ownerId.followers.length }} &nbsp;&nbsp; followers</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Dates from "@/modules/landing/components/Dates.vue";
import {useRouter} from "vue-router";
import { useAuthStore } from "@/store/auth.js";

const props = defineProps(['event', 'isLive'])
const dummyImageUrl = "/imgs/airplayvideo.svg"
const router = useRouter();
const authStore = useAuthStore();


const handleClick = () => {
  if (!authStore.token){
    router.push(`/login`);
  } else{
    router.push(`/live/${props.event._id}`);
  }
};

</script>

