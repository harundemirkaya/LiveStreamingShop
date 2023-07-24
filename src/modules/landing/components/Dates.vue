<template>
  <div
      class="absolute  w-full top-0  z-20 left-0 bottom-0 bg-[rgba(0,0,0,.3)] rounded-lg
         px-4 pt-2 rounded-b-md">
    <p class=" font-black text-blue-20 " v-if="props.event.event">
      <span class="text-lg text-white">{{ date > 0 && formatted }}</span>
      <br />
      <span class="text-3xl text-white">
					&nbsp;{{ date > 0 && formattedTime }}
				</span>
    </p>

    <img
        v-else
        alt=""
        class="absolute  w-full top-0  z-20 left-4 bottom-0 h-12 w-8"
        src="/imgs/live.svg"
    >
    <p>{{ props.event.users && props.event.userId.length }}</p>
  </div>
</template>

<script setup>
import {computed} from "vue";
import moment from "moment";

const props = defineProps(['date','event'])

const formatted = computed(()=> moment(props.date).calendar().split("at").length > 1 ?
moment(props.date).calendar().split(" at")[0] + " at" :
    moment(props.date).format("MMM Do, YYYY") + " at"
)

const formattedTime = computed(() => moment(props.date).format("LT"))
</script>
