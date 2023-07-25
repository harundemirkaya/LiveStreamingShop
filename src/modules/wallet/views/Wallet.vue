<template>
  <div class="flex flex-col xl:flex-row content-container gap-8 pb-16 py-10">
    <div class="pt-16 pb-12 w-96">
      <button class="primary-btn font-medium text-lg tracking-wider">
        Kullanılabilir Bakiye: {{ state.availablebalancecurrency }} ₺
        {{ state.availablebalance }}
      </button>
      <div class="my-5 ml-4">
        Bekleyen Bakiye: {{ state.pendingbalancecurrency }}
        {{ state.pendingbalance }}
      </div>
    </div>
    <!-- <div class="flex flex-col gap-8 w-full">
      <p class="text-lg font-semibold">Add Account Details</p>
      <p class="text-sm font-semibold -mt-6">Credit & Debit Cards</p>
      <div class="input-wrapper flex-row gap-8 items-center">
        <label for="card" class="labels w-1/3">Card number</label>
        <input required type="number" id="card" class="inputs w-full" />
      </div>
      <div class="input-wrapper flex-row gap-8 items-center">
        <label for="exp" class="labels w-1/3">Expiration Date</label>
        <input required type="date" id="exp" class="inputs w-full" />
      </div>
      <div class="input-wrapper flex-row gap-8 items-center">
        <label for="code" class="labels w-1/3">Security Code</label>
        <input required type="number" id="code" class="inputs w-full" />
      </div>
      <button class="primary-btn w-40 ml-auto">Edit</button>
    </div>
    <div class="flex min-h-full w-1 bg-secondary/50" /> -->
    <div class="flex flex-col gap-8 w-full">
      <div class="flex w-full items-center gap-8 max-w-2xl">
        <div class="input-wrapper w-full">
         

          <div class="flex flex-wrap items-center gap-4 py-4">
            <button
              :disabled="!option.enabled"
              :class="[
                state.withdrawoption.name === option.name ||
                option.default === true
                  ? 'border-info text-info'
                  : 'border-primary text-primary',
                option.enabled && state.withdrawoption.name === option.name
                  ? 'font-medium text-lg'
                  : '',
              ]"
              v-for="option in state.options"
              :key="option.name"
              class="border-[1px] px-6 py-2 rounded-md text-xl font-semibold"
              @click="handleWithdrawOption(option)"
            >
              <span class="text-primary text-base"
                >&nbsp;&nbsp;&nbsp; {{ option.name }}</span
              >
            </button>
          </div>

          <ul
            class="border-solid border-2 border-black-600 p-2 rounded"
            v-if="state.banks?.length > 0 && state.withdrawoption"
          >
            <li v-for="bank in state.banks" :key="bank.id">
              <div class="flex items-center">
                <div class="flex-1 w-64">
                  <b>Bank Name</b>: {{ bank.bank_name }}<br />
                  <div v-if="bank.account_holder_name">
                    <b>Account Holder</b>: {{ bank.account_holder_name }}
                  </div>
                </div>
                <p
                  @click="WithdrawAmount"
                  class="text-info cursor-pointer text-red text-lg"
                  v-if="state.withdrawoption && state.amount && !state.loading"
                >
                  Withdaw
                </p>
              </div>
            </li>
          </ul>
          <div
            v-else-if="
              state.withdrawoption && state.banks.length == 0 && !state.loading
            "
          >
            <button class="outline-btn" @click="router.push('/bankdetails')">
              Banka Hesabını Bağla
            </button>
          </div>
          <spinner-v2 :load="state.loading" />
        </div>
      </div>
      <div class="flex flex-col gap-4 w-full">
        <p class="text-2xl font-semibold tracking-wider">İşlem Geçmişi</p>
        <div class="w-full rounded-lg border-[1px] border-primary z-10 p-1">
          <easy-data-table
            table-class-name="customize-table"
            :headers="headers"
            :items="data"
            alternating
            hide-footer
          >
            <template #item-date="item">
              {{ moment(item.date).format("MMMM Do YYYY") }}
            </template>
            <template #item-reason="item"> {{ item.reason }} </template>
            <template #item-amount="item"> $ {{ item.amount }} </template>
          </easy-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import {  reactive } from "vue";
import { useUtils } from "@/shared/composables/utils";
import { useFetch } from "@/shared/composables/Fetch";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const emits = defineEmits(["title"]);
const utils = useUtils();
const { getPriceFormatted } = utils;
const router = useRouter();

const state = reactive({
  options: [
    { name: "Bank Account", enabled: true, default: false }
  ],
  withdrawoption: "",
  message: "",
  amount: "",
  title: "",
  isOpen: false,
  loading: false,
  banks: [],
  pendingbalance: "0",
  availablebalance: "0",
  availablebalancecurrency: "",
  pendingbalancecurrency: "",
});
const dialogToggle = () => {
  state.isOpen = !state.isOpen;
};
const authStore = useAuthStore();
const { authUser: user } = storeToRefs(authStore);
let data = [];
const fetchAllTransactions = async () => {
  const { data: result, status } = await useFetch(
    "/transactions/" + authStore.authUser?._id
  );
  data = result.value;
};

const handleWithdrawOption = async (option) => {
  state.loading = true;
  state.withdrawoption = option;
  const { data, status } = await useFetch(
    `/stripe/accounts/${authStore?.authUser?._id}`
  );
  if (data.value) {
    state.banks = data.value.banks;
  }
  state.loading = false;
};

const WithdrawAmount = async () => {
  if (state.amount <= 0) {
    state.message = "you have to enter the amount to withdraw";
    dialogToggle();
  } else {
    state.loading = true;
    let withdraw = {
      userId: authStore.authUser._id,
      amount: state.amount,
    };
    state.amount = "";
    const { data, status } = await useFetch(
      "/stripe/payout/" + authStore.authUser?._id,
      {
        data: withdraw,
        method: "POST",
      }
    );
    Swal.fire({
      icon: data.value.status ? "sucess" : "error",
      text: "Withdraw failed",
    }).then(() => {});
    console.log(data.value);
    state.loading = false;
  }
};

onMounted(() => {
  fetchAllTransactions();
  getBalance();
});
const getBalance = async () => {
  const { data, status } = await useFetch(
    `/stripe/balance/${authStore?.authUser?._id}`
  );
  state.availablebalance = data.value.available[0].amount / 100;
  state.pendingbalance = data.value.pending[0].amount / 100;
  state.availablebalancecurrency = data.value.available[0].currency;
  state.pendingbalancecurrency = data.value.pending[0].currency;
};
const headers = [
  { text: "Tarih", value: "date" },
  { text: "Tutar", value: "amount" },
];
</script>

<style scoped>
.customize-table {
  --easy-table-body-item-padding: 20px 10px;
  --easy-table-body-row-font-size: 15px;
  --easy-table-header-font-size: 20px;
  --easy-table-header-item-padding: 20px 10px;
  --easy-table-border: none;
}
.paypal {
  background-image: url("/imgs/paypal.svg");
}
.stripe {
  background-image: url("/imgs/stripe.svg");
}
.stan-chart {
  background-image: url("/imgs/stan-chart.svg");
}
.flutter-wave {
  background-image: url("/imgs/flutter-wave.svg");
}
</style>
