<template>
  <hero />
  <live-tokshows />
  <upcoming-tokshows />
  <new-collections />
  <popular-shops />
</template>

<script setup>
import {defineAsyncComponent} from "vue";
import Hero from '../components/Hero.vue';
const  NewCollections = defineAsyncComponent({
  loader:() => import("@/modules/landing/components/NewCollections.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  PopularShops = defineAsyncComponent({
  loader:() => import("@/modules/landing/components/PopularShops.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  UpcomingTokshows = defineAsyncComponent({
  loader:() => import("@/modules/landing/components/UpcomingTokshows.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
const  LiveTokshows = defineAsyncComponent({
  loader:() => import("@/modules/landing/components/cards/LiveTokshows.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

</script>
