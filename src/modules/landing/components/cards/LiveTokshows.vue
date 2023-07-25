<template>
  <div v-if="state.events.length > 0" class="content-container mx-auto flex flex-col py-16 w-full gap-6">
    <p class="h3 font-semibold text-primary">
   <span class="text-info">Canlı</span> Yayınlar
    </p>
    <spinner-v2 :load="state.loading"/>
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-4 lg:gap-y-12">
      <tok-show-card v-for="event in state.events" :key="event._id" :event="event" :isLive="event.event"/>
    </div>
  </div>
</template>


<script setup>
import TokShowCard from "@/shared/components/Cards/TokShowCard.vue";
import useFetch from "@/shared/composables/Fetch"
import {onMounted, reactive} from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const state = reactive({
  loading: false,
  events: []
})


const getAllEvents = async () => {
  state.loading = true
  const { data, status } = await useFetch("/rooms/activetokshows")

  if (status.value === 200)
    state.events = data.value.rooms

  state.loading = false
}


onMounted(() => {
  getAllEvents()
})


</script>
