<template>
  <div v-if="events.length > 0" class="content-container mx-auto flex flex-col py-16 w-full gap-6">

    <p class="h3 font-semibold text-primary">
     <span class="text-info">Live</span> Tokshows
    </p>
    <spinner-v2 :load="loading"/>
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-4 lg:gap-y-12">
      <tok-show-card v-for="event in events" :key="event._id" :event="event" :isLive="event.event"/>
    </div>
  </div>


  <div v-if="futureEvents.length > 0" class="content-container mx-auto flex flex-col py-16 w-full gap-6">
    <p  class="h3 font-semibold text-primary">
      New and Upcoming <span class="text-info"> Tokshows</span>
    </p>
    <spinner-v2 :load="loading" />
    <div v-if="futureEvents.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-4 lg:gap-y-12">
      <tok-show-card v-for="event in futureEvents" :event="event" :key="event._id" />
    </div>
  </div>
</template>


<script setup>
const  TokShowCard = defineAsyncComponent({
  loader:() => import("@/shared/components/Cards/TokShowCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import {defineAsyncComponent, onMounted} from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import {useShopShows} from "@/modules/shops/composables/useShopShows.js";


const props = defineProps(['userId'])

const {getAllLiveEvents,getAllEvents,loading, events, futureEvents} = useShopShows()


onMounted(() => {
  getAllLiveEvents(props.userId)
  getAllEvents(props.userId)
})


</script>
