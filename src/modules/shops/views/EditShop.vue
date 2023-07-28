<template>
  <div class="flex flex-col content-container py-10 lg:py-16 gap-12">
    <p class="text-2xl text-primary font-semibold tracking-wide">
      Marka Bilgileri
    </p>
    <div class="form-control w-full">
      <label class="labels">Marka İsmi</label>
      <input v-model="name" class="inputs" type="text" />
    </div>

    <div class="flex w-full justify-between pr-20 lg:pr-40">
      <div class="flex flex-col gap-4">
        <p class="labels">Marka İkonu</p>
        <input ref="fileInput" style="display: none" type="file" @change="onFileSelected($event.target.files[0])" />
        <div :style="{ backgroundImage: `url(${avatar})` }"
          class="flex w-24 h-24 lg:w-60 lg:h-60 border-[0.1rem] border-primary rounded-full relative bg-gray-300 bg-center bg-no-repeat bg-cover"
          @click="$refs.fileInput.click()">
          <spinner-v2 :load="loading" />
          <!--plus icon-->
          <svg class="text-info bottom-[10%] right-0 absolute w-6 h-6 lg:w-12 lg:h-12 translate-x-1/2 cursor-pointer"
            fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0
                  0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="labels">Durum</p>
        <div
          class="flex flex-col w-full  lg:w-44 lg:items-start gap-[38px] lg:gap-[22px] justify-center mt-[12px] lg:mt-[39px]">
          <div @click="shopStatus = !shopStatus" class="flex items-center gap-[5px] lg:gap-[20px] cursor-pointer">
            <div :class="[shopStatus ? 'checked-radio' : 'unchecked-radio']" />
            <p class="text-dark-blue lg:text-dark-blue dark:text-teal h4">Açık</p>
          </div>

          <div @click="shopStatus = !shopStatus" class="flex items-center gap-[5px] lg:gap-[20px] cursor-pointer">
            <div :class="[!shopStatus ? 'checked-radio' : 'unchecked-radio']" />
            <p class="text-dark-blue lg:text-dark-blue dark:text-teal h4">Kapalı</p>
          </div>
        </div>
      </div>
    </div>

    <div class="form-control w-full">
      <label class="labels">Marka Açıklaması</label>
      <textarea v-model="description" class="inputs" rows="5" />
    </div>
    <div class="flex w-full justify-end gap-6 items-center">
      <button v-if="!loading" class="primary-btn" @click="editShop">
        Güncelle
      </button>
      <spinner-v2 :load="loading" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useRoute, useRouter } from "vue-router";
import { useEditShop } from "@/modules/shops/composables/useEditShop.js";
import { useAuthStore } from "@/store/auth.js";

const router = useRouter();
const route = useRoute();
const {
  editShop,
  getShop,
  name,
  loading,
  onFileSelected,
  avatar,
  shopStatus,
  description
} = useEditShop()
const authStore = useAuthStore();


onMounted(() => {
  if (authStore.authUser?.userType == 'customer') {
    router.push(`/`);
  } else {
    if (authStore.authUser?.shopId != null) {
      getShop();
    } else {
      router.push(`/shop/new`);
    }
  }
});


</script>
