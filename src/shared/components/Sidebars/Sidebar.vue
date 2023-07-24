<template>
  <div class="sidebar-wrapper" @click="emit('close')">
    <div class="sidebar pt-20" @click.stop="">
      <svg
          class="w-8 h-8 absolute top-8 left-4 text-black-500 text-3xl"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          @click="handleClose"
      >
        <path
            d="M9 5l7 7-7 7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
        ></path>
      </svg>

      <div class="flex w-full items-center gap-3 mt-4">
        <div class="relative flex">
          <svg
              class="w-6 text-info cursor-pointer"
              fill="currentColor"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              @click="handleFavorites"
          >
            <path
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                fill-rule="evenodd"
            />
          </svg>
          <div
              class="text-sm font-bold flex justify-center items-center z-10 absolute -top-2 -right-2 w-4 h-4 bg-white text-primary rounded-full"
          >
            {{ useFavorite().productIds.length }}
          </div>
        </div>

        <button
            v-if="authStore.authUser?._id"
            @click="gotoChats"
            type="button"
            class="relative flex items-center text-sm font-medium text-center text-white bg-white-700 rounded-lg
         focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
              class="w-6 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                fill-rule="evenodd"
                d="m5.705 3.71-1.41-1.42C1 5.563 1 7.935 1 11h1l1-.063C3 8.009 3 6.396 5.705 3.71zm13.999-1.42-1.408 1.42C21 6.396 21 8.009 21 11l2-.063c0-3.002 0-5.374-3.296-8.647zM12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.184 4.073 5 6.783 5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a.996.996 0 0 0-.293-.707L19 14.586z"
            />
          </svg>
          <span class="sr-only">Notifications</span>
          <div
              class="absolute inline-flex items-center justify-center w-6 h-6 text-white bg-red-500 border-1 border-white rounded-full -top-2 -right-2 dark:border-gray-900"
          >
            <p class="text-10">{{ chatStore.unreadMessages }}</p>
          </div>
        </button>


      </div>

      <button
          class="primary-btn flex items-center text-white text-xl font-semibold py-0 w-full px-2 h-12 gap-4 text-center justify-center"
          @click="handleCart"
      >
        Cart
        <svg
            class="w-4 cursor-pointer"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
          />
        </svg>
      </button>

      <button
          v-if="authStore.authUser?._id"
          class="bg-[#FF2323] primary-btn px-2 py-0 w-full h-12"
          @click="handleGoLive"
      >
        Go Live
      </button>

      <button v-if="!authStore.authUser?._id" class="primary-btn flex items-center text-white text-xl font-semibold
      py-0 w-full px-2 h-12 gap-4 text-center justify-center" @click="handleSignUp">Join</button>

    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/auth.js";
import {useFavorite} from "../../../store/favoriteStore.js";
import {useChat} from "@/store/chat.js";

const router = useRouter()
const emit = defineEmits(["close", "openCart"]);
const authStore = useAuthStore()
const chatStore = useChat();


const gotoChats = () => {
  chatStore.setCurrentChat(null);
  router.push("/messaging");
  emit("close");

};

const handleFavorites = () =>{
  emit("close");
  router.push('/favorites')
}

function handleClose() {
  emit("close");
}

const handleSignUp = () => {
  emit("close");
  router.push('/login')
};

const handleCart = () => {
  emit("close");
  emit("openCart");
};

const handleGoLive = () => {
  emit('close')
  router.push('/createtokshow')
}
</script>
