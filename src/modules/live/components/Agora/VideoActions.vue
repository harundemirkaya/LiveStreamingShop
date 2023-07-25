<template>
  <div
    class="w-60 absolute top-[60%] left-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 z-40 flex flex-col"
  >
    <button
      v-if="!hasJoined && !loading && !hasEnded"
      id="join"
      :class="[
        hasArrived ? 'bg-red-500' : isOwner ? 'bg-red-500' : 'bg-gray-500',
      ]"
      class="primary-btn rounded-md px-10 py-4 text-lg tracking-wide font-semibold disabled:bg-gray-300"
      @click="emits('startTokShow')"
    >
      {{ hasEnded ? "Go Live Now" : isOwner ? "Start Tokshow" : "wait host to start tokshow" }}
    </button>

    <button
      v-if="hasEnded && !loading && !hasJoined"
      id="join"
      class="primary-btn rounded-xl bg-gray-500 px-10 py-4 text-lg tracking-wide font-semibold disabled:bg-gray-300"
    >
      Canlı Yayın Sonlandı
    </button>
  </div>
</template>

<script setup>
const props = defineProps([
  "hasJoined",
  "loading",
  "isOwner",
  "hasArrived",
  "hasEnded",
]);
const emits = defineEmits(["startTokShow"]);
</script>
