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
        <div
          v-if="!user?.profilePhoto"
          class="flex w-16 h-16 rounded-full bg-gray-300 items-center justify-center"
        >
          <svg
            class="w-8 text-gray-900"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              fill-rule="evenodd"
            />
          </svg>
        </div>
        <div v-else class="flex items-center gap-2 pb-2">
          <div
            class="flex w-16 h-16 rounded-full bg-gray-300 items-center justify-center"
          >
            <img
              :src="user.profilePhoto"
              alt="..."
              class="shadow rounded-full max-w-full h-auto align-middle border-none"
            />
          </div>
        </div>
        <!--  -->
        <div class="flex flex-col">
          <!-- user's name -->
          <p class="text-2xl font-semibold text-gray-700">
            {{ user?.firstName }}
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
          v-if="user?.shopId"
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
          <div class="flex flex-col gap-1">
            <!--Channel details name -->
            <p class="text-sm font-semibold text-gray-700">My Shop</p>
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
          <p class="text-sm font-semibold text-gray-700">
            Siparişlerim
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
          @click="handleWallet"
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
          <p class="text-sm font-semibold text-gray-700">Ödeme</p>
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

        <!-- settings -->
        <div
          class="flex items-center gap-4 pb-4 cursor-pointer"
          @click="handleMessages"
        >
          <div
            class="flex w-8 h-8 rounded-full bg-gray-300 items-center justify-center"
          >
            <svg
              class="w-5 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M6.84572 18.6204C6.74782 18.0072 6.4668 17.4522 6.05816 17.0088C4.18319 15.5427 3 13.3942 3 11C3 6.58173 7.02944 3 12 3C16.9706 3 21 6.58173 21 11C21 15.4183 16.9706 19 12 19C11.1546 19 10.3365 18.8964 9.56074 18.7027C9.45389 18.676 9.34187 18.72 9.28125 18.8119C9.15858 18.998 9.02331 19.1851 8.87719 19.3674C8.64734 19.6542 8.39065 19.9289 8.11392 20.1685C7.59543 20.6174 7.00662 20.943 6.39232 20.9932C6.37166 20.9949 6.35097 20.9963 6.33025 20.9974C6.28866 20.9995 6.26498 20.9519 6.28953 20.9182C6.30109 20.9024 6.3125 20.8865 6.32376 20.8704C6.67743 20.3664 6.88397 19.7586 6.88397 19.1044C6.88397 19.0915 6.88389 19.0786 6.88373 19.0658C6.88185 18.9146 6.86893 18.7659 6.84572 18.6204ZM4.66223 18.4535C2.45613 16.6579 1 14.0103 1 11C1 5.26221 6.15283 1 12 1C17.8472 1 23 5.26221 23 11C23 16.7378 17.8472 21 12 21C11.3978 21 10.8057 20.9559 10.2276 20.8709C9.93606 21.2084 9.60764 21.5363 9.24519 21.8294C8.55521 22.3873 7.59485 22.9353 6.43241 22.9948L6.43238 22.9948C4.55136 23.0909 3.75168 21.003 4.67402 19.7392C4.81033 19.5524 4.88397 19.3363 4.88397 19.1044C4.88397 18.8684 4.80711 18.6449 4.66223 18.4535Z"
                fill="#0F1729"
                fill-rule="evenodd"
              />
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-700">Mesajlar</p>
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
        <!-- settings -->
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
