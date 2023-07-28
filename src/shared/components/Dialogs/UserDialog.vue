<template>
  <div class="dialog-wrapper bg-transparent" @click="emit('close')">
    <div
      class="border-[0.1rem] rounded-lg p-6 flex flex-col gap-4 w-full fixed top-10 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-[10%] max-w-xs md:max-w-md z-50 bg-white shadow-2xl mt-10"
      @click.stop=""
    >
      <!-- Channel details -->
      <div
        class="flex items-center gap-2 pb-4 cursor-pointer"
        @click="handleProfileClick"
      >
        <div class="flex items-center gap-2 pb-2">
          <div
            class="flex w-16 h-16 rounded-full bg-gray-300 items-center justify-center"
          >
            <img
              src='/imgs/profile.svg'
              alt="..."
              class="shadow rounded-full max-w-full h-auto align-middle border-none"
            />
          </div>
        </div>
        <!--  -->
        <div class="flex flex-col">
          <!-- user's name -->
          <p class="text-2xl font-semibold text-gray-700">
            {{ user?.userName }}
          </p>
          <p class="text-sm text-gray-600 tracking-wide">Profili Düzenle</p>
        </div>
        <!--  -->
        <svg
          class="w-8 h-8 text-gray-500 ml-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            fill-rule="evenodd"
          ></path>
        </svg>
      </div>
      <hr class="bg-gray-300" />
      <!-- -->
      <div class="flex flex-col gap-4">
        <!-- channel logo -->
        <div 
          v-if="user?.shopId && authStore.authUser?.userType != 'customer'"
          class="flex items-center gap-4 pb-4 cursor-pointer"
          @click="handleShopClick(user?.shopId._id)"
        >
          <img
            v-if="!user.shopId.image"
            alt="logo"
            class="h-8 w-8 rounded-full"
            src="https://cdn.pixabay.com/photo/2016/12/26/18/33/logo-1932539__480.png"
          />
          <img
            v-else
            :src="user?.shopId.image"
            alt="logo"
            class="h-8 w-8 rounded-full"
          />
          <!--  -->
          <div 
          class="flex flex-col gap-1">
            <!--Channel details name -->
            <p class="text-sm font-semibold text-gray-700">Mağazam</p>
            <p class="text-gray-600 tracking-wide">
              {{ user?.userName }}
            </p>
          </div>
          <!--  -->
          <svg
            class="w-8 h-8 text-gray-300 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div
          v-if="!user?.shopId"
          class="flex items-center gap-4 pb-4 cursor-pointer"
        >
          <img
            v-if="!user?.shopId?.image"
            alt="logo"
            class="h-8 w-8 rounded-full"
            src="https://cdn.pixabay.com/photo/2016/12/26/18/33/logo-1932539__480.png"
          />
          <img
            v-if="user?.shopId?.image"
            :src="user?.shopId?.image"
            alt="logo"
            class="h-8 w-8 rounded-full"
          />
          <!--  -->
          <div class="flex flex-col gap-1" @click="handleShopClick">
            <!--Channel details name -->
            <p class="text-sm font-semibold text-gray-700">Satışa Başla</p>
          </div>
          <!--  -->
          <svg
            class="w-8 h-8 text-gray-300 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <!-- orders and purchases -->
        <div
          class="flex items-center gap-4 pb-4 cursor-pointer"
          @click="router.push('/myorders')"
        >
          <div
            class="flex w-8 h-8 rounded-full bg-gray-300 items-center justify-center"
          >
            <svg
              class="w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"
              />
            </svg>
          </div>
          <p
           v-if="authStore.authUser?.userType == 'customer'"
           class="text-sm font-semibold text-gray-700">
            Siparişlerim
          </p>
          <p
           v-else
           class="text-sm font-semibold text-gray-700">
            Satın
          </p>
          <svg
            class="w-8 h-8 text-gray-300 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <!-- wallet -->
       

        
        <div
          class="flex items-center gap-4 pb-4 cursor-pointer"
          @click="handleSettings"
        >
          <div
            class="flex w-8 h-8 rounded-full bg-gray-300 items-center justify-center"
          >
            <svg
              class="w-5 text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-700">Ayarlar</p>
          <svg
            class="w-8 h-8 text-gray-300 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>

        <!-- logout -->
        <div class="flex items-center gap-4 pb-4 cursor-pointer">
          <div
            class="flex w-8 h-8 rounded-full bg-gray-300 items-center justify-center"
          >
            <svg
              class="w-5 text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <!--  -->
          <p class="text-sm font-semibold text-gray-700" @click="handleLogout">
            Çıkış Yap
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { useChat } from "@/store/chat";

const emit = defineEmits(["close"]);
const router = useRouter();

const authStore = useAuthStore();
const chatStore = useChat();

// to ignore all methods and non-reactive props of the state we use storeToRefs

const { authUser: user } = storeToRefs(authStore);

const handleMessages = () => {
  router.push("/messaging");
  chatStore.setCurrentChat(null);
  router.push("/messaging");

  emit("close");
};

const handleWallet = () => {
  router.push("/wallet");
  emit("close");
};
const handleSettings = () => {
  router.push("/settings");
  emit("close");
};

const handleLogout = () => {
  authStore.$reset();
  emit("close");
};
const handleShopClick = (shopid) => {
  if (authStore.authUser?.shopId == null) {
    router.push(`/shop/new`);
  } else {
    router.push(`/shop/${shopid}`);
  }

  emit("close");
};

const handleProfileClick = () => {
  router.push(`/profile/${authStore.authUser?._id}`);
  emit("close");
};

const handleFavorites = () => {
  router.push("/favorites");
  emit("close");
};
</script>
