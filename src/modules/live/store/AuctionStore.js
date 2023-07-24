import { defineStore } from "pinia";

const useAuction = defineStore("auction-states", {
  state: () => ({
    auction: {
      bids: null,
    },
  }),
  getters: {
    getHighestBid: (state) =>
      state.auction.bids.length < 1
        ? 0
        : Math.max(...state.auction?.bids?.map((bid) => bid.amount)),
    getNextBid: (state) =>
      state.auction.bids.length < 1
        ? state.auction.baseprice
        : Math.max(
            ...state.auction?.bids?.map(
              (bid) => bid.amount + (state.auction.increaseBidBy ?? 0)
            )
          ),
    getHighestBidder: (state) =>
      state.auction?.bids?.length > 0
        ? state.auction?.bids?.reduce((max, curr) =>
            max.amount > curr.amount ? max : curr
          )
        : null,

    getUserBid: (state) => (userId) =>
      state.auction?.bids?.length > 0
        ? state.auction?.bids[
            state.auction?.bids?.findIndex((bid) => bid.user._id == userId)
          ]
        : null,
  },
  actions: {
    addAuction(newAuction) {
      this.auction = newAuction;
    },
    bid({ amount, userObj }) {
      if (this.auction.bids.length == 0 && amount >= this.auction.baseprice) {
        this.auction = {
          ...this.auction,
          bids: [...this.auction?.bids, { amount, user: userObj }],
        };
      } else {
        if (amount > this.getHighestBid) {
          let index = this.auction?.bids.findIndex(
            (bid) => bid.user._id == userObj._id
          );
          if (index > -1) {
            this.auction.bids[index].amount = amount;
          } else {
            this.auction = {
              ...this.auction,
              bids: [...this.auction?.bids, { amount, user: userObj }],
            };
          }
        }
      }
      console.log(this.auction?.bids);
    },
    startAuction() {
      var startDate = this.auction?.startedTime;
      var timeNow = Date.now();
      console.log(this.auction);
      var milliSeconds =
        startDate == 0
          ? this.auction?.duration
          : this.auction?.duration - (timeNow - startDate) / 1000.0;
      console.log("milliSeconds", milliSeconds);

      console.log("startAuction", parseInt(milliSeconds));
      this.auction = {
        ...this.auction,
        started: true,
        startedTime: Date.now(),
        duration: parseInt(milliSeconds) < 0 ? 0 : parseInt(milliSeconds),
      };
    },
    endAuction() {
      this.auction = {
        ...this.auction,
        ended: true,
      };
    },
  },
  persist: true,
});

export default useAuction;
