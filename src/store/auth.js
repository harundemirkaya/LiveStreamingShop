import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: {
      defaultpaymentmethod: null,
    },
    appSettings: {},
    token: "",
    myShop: false,
    authStoreLoading: false,
  }),

  getters: {
    // user: (state) => state.authUser,
    // getToken: state => state.token,
  },

  actions: {
    setMuted(muted) {
      this.authUser.muted = muted;
    },
    saveToken(token) {
      this.token = token;
    },
    saveUser(data) {
      this.authUser = data;
    },
    saveUserDefaultPayment(data) {
      this.authUser.defaultpaymentmethod = data;
    },
    async getUser() {
      if (this.authUser._id == null) return;
      const { data } = await axios.get(`/users/${this.authUser._id}`);
      this.authUser = data;
      return data;
    },
    async getAppSettings() {
      const { data, status } = await axios.get(`/admin/app/settings`);
      this.appSettings = data;
      return data;
    },

    logout() {
      this.authUser = {};
      this.token = "";
    },
    checkMyShop(shopId) {
      return this.authUser.shopId._id === shopId;
    },
  },
  persist: true,
});
