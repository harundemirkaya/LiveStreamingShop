import { defineStore } from "pinia";

const useAgoraStore = defineStore("agora", {
  state: () => ({
    agoraFollowers: 0,
    RTMChannel: null,
  }),
  actions: {
    incrementFollowers() {
      ++this.agoraFollowers;
    },
    decrementFollowers() {
      --this.agoraFollowers;
    },
    saveRTMChannel(channel) {
      this.RTMChannel = channel;
    },
  },
  persist: true,
});

export default useAgoraStore;
