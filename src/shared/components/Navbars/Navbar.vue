<template>
  <nav
    class="flex w-full content-container justify-between items-center min-h-[5rem] relative"
  >
    <img
      alt="logo"
      class="logo hidden lg:block"
      src="/imgs/logo.png"
      @click="handleLogoClick"
    />
    <div class="flex gap-5 lg:gap-8 items-center w-full lg:justify-end">
      <!--      search input-->
      <div
        v-if="searchState.isOpen"
        class="flex absolute lg:relative left-1/2 lg: left-0 top-1/2 -translate-x-1/2 lg:-translate-x-full z-20 -translate-y-1/2 lg:translate-y-0 px-4 w-full md:w-1/2"
      >
        <div class="relative w-full">
          <input
            v-model="searchState.searchValue"
            class="input w-full"
            placeholder="Type here"
            type="text"
          />
          <!-- cancel icon -->
          <svg
            class="absolute w-6 z-10 right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            @click="cancelSearch"
          >
            <path
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5
                 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>
      </div>

      <!-- SEARCH ICON
         <svg
        class="text-white w-5 h-5 cursor-pointer"
        fill="currentColor"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        @click="handleSearchClick"
      >
        <path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0
             1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
        />
      </svg>
      -->

      <img
        alt="logo"
        class="logo mx-auto lg:hidden"
        src="/imgs/tok_logo.svg"
        @click="handleLogoClick"
      />
      
      <button
        v-if="authStore.authUser.userType != 'customer'"
        class="bg-[#FF2323] primary-btn px-6 py-[6px] hidden lg:flex"
        @click="router.push('/createtokshow')"
      >
        Yayın Başlat
      </button>

      <!-- FAVORITES
        <div class="relative hidden lg:flex">
        <svg
          class="w-6 text-info cursor-pointer"
          fill="currentColor"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          @click="router.push('/favorites')"
        >
          <path
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            fill-rule="evenodd"
          />
        </svg>
        <div
          class="text-sm font-bold flex justify-center items-center z-10 absolute -top-2 -right-2 w-4 h-4 bg-white text-primary rounded-full"
        >
          {{ favoriteStore.productIds.length }}
        </div>
      </div>
      -->

      <!-- MESSAGES AND NOTIFICATION
        <button
        v-if="authStore.authUser?._id"
        @click="gotoChats"
        type="button"
        class="relative hidden lg:flex items-center text-sm font-medium text-center text-white bg-white-700 rounded-lg focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          height="24"
          viewBox="0 0 24 24"
          width="24"
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
      -->

      <button
        v-if="!authStore.token"
        class="py-2 px-8 primary-btn hidden lg:block"
        @click="router.push('/login')"
      >
        Giriş Yap
      </button>

      <!-- user initials -->
      <div
        v-else-if="authStore.token"
        :style="{
          backgroundImage: `url(${
            '/imgs/profile.svg'
          })`,
        }"
        class="flex w-8 h-8 rounded-full items-center justify-center relative cursor-pointer bg-contain"
        @click="emit('openUserDiag')"
      >
      </div>

      

      <!--ham icon-->
      <svg
        class="w-5 text-white lg:hidden"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        @click="emit('openSidebar')"
      >
        <path
          d="M4 6h16M4 12h16M4 18h16"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        ></path>
      </svg>

      <!-- cart icon -->
      <svg
        class="w-8 hidden lg:flex text-black cursor-pointer"
        fill="currentColor"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        @click="emit('openCart')"
      >
        <path
          d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13
            11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3
            0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0
            5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2
            2 0 1 1 4 0 2 2 0 0 1-4 0z"
        />
      </svg>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChat } from "@/store/chat";
import { useAuthStore } from "@/store/auth";
import { useFavorite } from "@/store/favoriteStore.js";
import { useInbox } from "@/modules/messaging/composables/useInbox";
const favoriteStore = useFavorite();
const authStore = useAuthStore();
const chatStore = useChat();
const emit = defineEmits([
  "openSidebar",
  "openUserDiag",
  "openCart",
  "openSignUpDiag",
]);

const searchState = reactive({
  isOpen: false,
  searchValue: "",
});

const gotoChats = () => {
  chatStore.setCurrentChat(null);
  router.push("/messaging");
};

const router = useRouter();
const route = useRoute();

const handleLogoClick = () => router.push("/");

const cancelSearch = () => {
  // router.back()
  searchState.isOpen = false;
  searchState.searchValue = "";
};

onMounted(() => {
  if (authStore.authUser._id) getUnreadMessages();
});

const handleSearchClick = () => (searchState.isOpen = !searchState.isOpen);

watch(searchState, (value) => {
  if (value.searchValue) {
    router.push(`/search/${value.searchValue}`);
  }
});

watch(route, (value) => {
  if (value.path.search("search") === -1) {
    searchState.searchValue = "";
    searchState.isOpen = false;
  }
});
const { getUnreadMessages } = useInbox();
</script>
