<template>
  <div
      class="absolute flex text-center top-[40%] left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 text-white
      font-black gap-2 text-sm lg:text-2xl tracking-wide"
  >
    <p class="">{{ days }} Days</p>
    <br/>
    <p class="">{{ hours }} Hours</p>
    <p class="">{{ minutes }} Minutes</p>
    <p class="">{{ seconds }} Seconds</p>
  </div>
</template>

<script setup>
import {useCountDown} from "@/modules/live/composables/CountDown.js";
import {onMounted} from "vue";

const props = defineProps(['event'])

const {startTimer, days, hours, minutes, seconds} = useCountDown()

onMounted(async()=>{
  await startTimer({scheduledTime: props.event?.eventDate});

})
</script>
