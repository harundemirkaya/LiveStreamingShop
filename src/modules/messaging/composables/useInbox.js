import { reactive, toRefs } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { useChat } from "@/store/chat";
import { fireStore} from "@/shared/http/firebase-config.js";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useFetch } from "@/shared/composables/Fetch";
const chatStore = useChat();
const authStore = useAuthStore();
export const useInbox = () => {
  const state = reactive({
    msg: "",
    chatHistory: [],
    avatar: authStore.authUser?.profilePhoto,
    name: authStore.authUser?.firstName,
    loading: false,
    users: [],
  });

  const getChatsHistory = async () => {
    state.loading = true;
    let path = `chats/${chatStore.currentChat.id}/messages`;
    const q = await query(collection(fireStore, path), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      chatStore.chatHistory = [];
      querySnapshot.forEach((doc) => {
        chatStore.setChatHistory(doc.data());
      });
    });
    const msgDiv = document.getElementById("msgDIV");
    msgDiv.scrollTop = msgDiv.scrollHeight;
    state.loading = false;
  };

  const getUnreadMessages = () => {
    let path = `chats`;
    const q = query(
      collection(fireStore, path),
      orderBy("lastMessageTime", "asc"),
      where("unread_users", "array-contains-any", [authStore.authUser?._id])
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let count = 0;
      querySnapshot.forEach((doc) => {
        count++;
      });
      chatStore.setUnreadMessages(count);
    });
  };

  const getInboxes = () => {
    let path = `chats`;

    const q = query(
      collection(fireStore, path),
      orderBy("lastMessageTime", "asc"),
      where("userIds", "array-contains-any", [authStore.authUser?._id])
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      chatStore.clearChats();
      state.loading = true;
      querySnapshot.forEach((doc) => {
        if (doc.data().users) {
          let user = {
            user: doc
              .data()
              .users.filter((user) => user.id !== authStore.authUser?._id)[0],
            message: doc.data()["lastMessage"],
            unread_users: doc.data()["unread_users"],
            lastMessageTime: doc.data()["lastMessageTime"],
            id: doc.data()["id"],
          };
          chatStore.setChats(user);
        }
      });

      
    });
  };

  const searchUser = async (name) => {
    state.loading = true;
    let { data, status } = await useFetch("/users/allusers?title=" + name);
    state.users = data.value.users;
    state.loading = false;
  };
  return {
    ...toRefs(state),
    getChatsHistory,
    getUnreadMessages,
    getInboxes,
    searchUser,
  };
};
