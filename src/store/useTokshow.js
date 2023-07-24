import { defineStore } from "pinia";

const useTokshow = defineStore("tokshow", {
  state: () => ({
    tokshow: {},
  }),
  getters: {
    isSpeaker: (state) => (userId) => {
      let found = state.tokshow?.invitedSpeakerIds?.findIndex(
        (obj) => obj === userId
      );
      return found > -1;
    },
    saveTokshow: (state) => (tokShow) => {
      state.tokshow = tokShow;
    },
  },
  actions: {
    addTokshow(show) {
      this.tokshow = show;
    },
    addraisedHands(userObj) {
      let found = this.tokshow.raisedHands?.findIndex(
        (obj) => obj._id === userObj._id
      );
      if (found === -1)
        this.tokshow = {
          ...this.tokshow,
          raisedHands: [...this.tokshow.raisedHands, userObj],
        };
    },
    addSpeaker(user) {
      this.tokshow = {
        ...this.tokshow,
        invitedSpeakerIds: [...this.tokshow.invitedSpeakerIds, user],
      };
    },
    addUserToRoom(userData) {
      let userIndex = this.tokshow.userIds.findIndex(
        (user) => user._id === userData._id
      );
      if (userIndex < 0) {
        this.tokshow = {
          ...this.tokshow,
          userIds: [...this.tokshow.userIds, userData],
        };
      }
    },
    removeSpeakerRaisedHand(userId) {
      let raisedHandIndex = this.tokshow.raisedHands.findIndex(
        (user) => user._id === userId
      );
      if (raisedHandIndex > -1) {
        this.tokshow.raisedHands.splice(raisedHandIndex, 1);
      }

      let invitedSpeakerIdIndex = this.tokshow.invitedSpeakerIds.findIndex(
        (user) => user === userId
      );
      if (invitedSpeakerIdIndex > -1) {
        this.tokshow.invitedSpeakerIds.splice(invitedSpeakerIdIndex, 1);
      }
      let userIndex = this.tokshow.userIds.findIndex(
        (user) => user._id === userId
      );
      if (userIndex > -1) {
        this.tokshow.userIds.splice(userIndex, 1);
      }
      console.log("userIndex", userIndex);
      console.log("userIndex", this.tokshow.userIds);
    },
    toggleSpeakerSound(id, mutedState) {
      let raisedHandsIndex = this.tokshow.raisedHands.findIndex(
        (user) => user._id === id
      );
      if (raisedHandsIndex !== -1) {
        this.tokshow.raisedHands[raisedHandsIndex].muted = mutedState;
      }
      let invitedSpeakerIdsIndex = this.tokshow.invitedSpeakerIds.findIndex(
        (user) => user._id === id
      );
      if (invitedSpeakerIdsIndex !== -1) {
        this.tokshow.invitedSpeakerIds[invitedSpeakerIdsIndex].muted =
          mutedState;
      }
    },
    endRoom() {
      this.tokshow = {
        ...this.tokshow,
        ended: true,
      };
    },
  },
});

export default useTokshow;
