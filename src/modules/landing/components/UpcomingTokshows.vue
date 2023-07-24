<template>
  <div v-if="state.events.length > 0" class="content-container mx-auto flex flex-col py-0 md:py-16 w-full gap-6">
    <p  class="h3 font-semibold text-primary">
      New and Upcoming <span class="text-info"> Tokshows</span>
    </p>
    <spinner-v2 :load="state.loading" />
    <div v-if="state.events.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-4 lg:gap-y-12">
      <tok-show-card v-for="event in state.events" :event="event" :key="event._id" />
    </div>
  </div>
</template>

<script setup>
const  TokShowCard = defineAsyncComponent({
  loader:() => import("@/shared/components/Cards/TokShowCard.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import useFetch from "@/shared/composables/Fetch"
import {defineAsyncComponent, onMounted, reactive} from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const state = reactive({
  loading: false,
  events: []
})


const getAllEvents = async() => {
  state.loading = true
  const { data } = await useFetch("/rooms/allevents")
  state.events = data.value
  state.loading = false
}


onMounted(()=>{
  getAllEvents()
})
</script>
