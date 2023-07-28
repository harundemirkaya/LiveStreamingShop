<template>
  <div class="flex flex-col gap-8 min-h-full">
    <p class="text-xl text-primary font-semibold tracking-wider">
      Bağlı Hesaplar
    </p>
    <spinner-v2 :load="state.loading" />

    <ul
      class="border-solid border-2 border-black-600 p-2 rounded"
      v-if="state.banks.length"
    >
      <bank :banks="state.banks" :loading="state.loading2" :status="state.bankStatus" />
    </ul>
    <button
      v-if="!state.loading && state.banks.length === 0"
      @click="router.push('/bankdetails')"
      class="outline-btn"
    >
      Banka Hesabı Bağla
    </button>
  </div>
</template>
<script setup>
import { useAuthStore } from "@/store/auth";
import {defineAsyncComponent, onMounted, reactive} from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useFetch } from "@/shared/composables/Fetch";
import router from "@/shared/routes/routes";
const  Bank = defineAsyncComponent({
  loader:() => import("@/modules/settings/components/Bank.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const authStore = useAuthStore();
const state = reactive({
  withdrawoption: "",
  loading: false,
  loading2: false,
  banks: [],
  bankStatus: "",
});
onMounted(() => {
  if (authStore?.authUser?.userType == 'customer') {
    router.push('/');
  }
  getWithdrawOption();
  if (authStore?.authUser?.payoutmethod) {
    getAccountStatus();
  }
});
const getWithdrawOption = async (option) => {
  state.loading = true;
  state.withdrawoption = option;
  const { data} = await useFetch(
    `/stripe/accounts/${authStore?.authUser?._id}`
  );
  if (data.value.status === true) {
    state.banks = data.value.banks;
  }
  await authStore.getUser();
  state.loading = false;
};
const getAccountStatus = async () => {
  state.loading2 = true;
  const { data } = await useFetch(
    `/stripe/accountstatus/${authStore?.authUser?._id}`
  );
  if (data.value) {
    state.bankStatus = data.value.status;
  }
  state.loading2 = false;
};
const handDelete = async () => {
  state.loading = true;
  const { data } = await useFetch(
    `/stripe/deleteaccount/${authStore?.authUser?._id}`
  );
  if (data.value) {
    state.banks = [];
  }
  await authStore.getUser();
  state.loading = false;
};
</script>
