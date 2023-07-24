import { defineStore } from "pinia";

export const useChat = defineStore("chat", {
  state: () => ({
    currentChat: null,
    chats: [],
    chatHistory: [],
    unreadMessages: 0,
  }),
  getters: {},
  actions: {
    setCurrentChat(chat) {
      this.currentChat = chat;
    },
    setChats(chats) {
      let leng = this.chats.filter((c) => c.user.id == chats.user.id).length;
      if (leng == 0) {
        this.chats = [...this.chats, chats];
      }
    },
    setChatHistory(chatsHistory) {
      this.chatHistory = [...this.chatHistory, chatsHistory];
    },
    setUnreadMessages(count) {
      this.unreadMessages = count;
    },
    clearChats() {
      this.chats = [];
    },
  },
  persist: true,
});
