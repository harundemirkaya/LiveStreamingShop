<template>
  <div class="dialog-wrapper">
    <div class="dialog gap-6 border-0">
      <p class="text-primary text-1xl font-semibold tracking-wide text-center">
        {{ title }}
      </p>
      <p class="font-medium">{{ message }}</p>

      <div class="gap-1 flex flex-col">
        <button
          v-if="authStore.authUser.address == null"
          class="outline-btn mt-6"
          @click="handleClick"
        >
          Gönderim Adresi Ekle
        </button>
        <button
          v-if="authStore.authUser.defaultpaymentmethod == null"
          class="outline-btn mt-6"
          @click="addCreditCard"
        >
          Ödeme Yöntemi Ekle
        </button>
        <button v-if="showCancel" class="mt-6" @click="handleClose">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";

const router = useRouter();
const authStore = useAuthStore();
const emits = defineEmits(["close"]);
const props = defineProps([
  "title",
  "message",
  "buttonText",
  "showCancel",
  "cancelButtonText",
]);

const handleClose = () => emits("close");

const handleClick = () => {
  router.push(`/settings`);
};
const addCreditCard = () => {
  emits("close");
};
</script>
