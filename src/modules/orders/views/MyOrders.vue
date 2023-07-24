<template>
  <div class="flex flex-col content-container py-16 gap-8">
    <div class="flex w-full justify-between items-center">
      <p class="text-2xl text-primary font-semibold tracking-wide">
        {{ state.defaultOrders ? "Orders" : "Purchases" }}
      </p>
      <div class="flex gap-4 items-center">
        <p class="font-semibold tracking-wider" @click="fetchPurchases">
          Purchases
        </p>
        <input
          checked
          class="toggle toggle-success"
          type="checkbox"
          @click="fetchList"
        />
        <p class="font-semibold tracking-wider" @click="fetchOrders">Orders</p>
      </div>
    </div>
    <spinner-v2 :load="state.loading" />
    <div
      v-if="state.loading === false"
      class="rounded-lg border-[1px] border-primary z-10 p-1 w-full"
    >
      <easy-data-table
        :headers="headers"
        :items="state.orders"
        alternating
        class="w-full gap-5"
        table-class-name="customize-table"
      >
        <template #item-date="item">
          <p class="table-text">
            {{ new Date(item.createdAt).toLocaleDateString() }}
          </p>
        </template>

        <template #item-product="item">
          <p class="table-text">
            {{ item.itemId.productId.name }},<br />
            Qty: {{ item.quantity }}
            <br />
            Variations: {{ item.itemId.productId.variations.toString() }}
          </p>
        </template>

        <template #item-status="item" v-if="state.defaultOrders">
          <status-dialog
            :current-state="item.status"
            :orderid="item._id"
            @close="state.openStatusDiagId = ''"
          />
        </template>

        <template #item-paymentMethod="item"
          ><b>{{
            item.paymentMethod == "cod" ? "Cash On delivery" : "Credit Card"
          }}</b></template
        >

        <template #item-customer="item">
          <p
            @click="
              !state.defaultOrders ? $router.push('shop/' + item.shopId._id) : ''
            "
            class="cursor-pointer"
          >
            <b>{{
              state.defaultOrders
                ? "Customer : " + item.customerId.firstName
                : "From : " + item.shopId.name
            }}</b>
            <br />

            {{ state.defaultOrders ? "  Email:" + item.customerId.email : "" }}

            <br />
          </p>
        </template>

        <template #item-info="item">
          {{ item.shippingId.name }}<br />
          {{ item.shippingId.city }}, {{ item.shippingId.state }}
          {{ item.shippingId.country }}<br />
          {{ item.shippingId.phone }}, {{ item.shippingId.zipcode }}<br />
        </template>

        <template #item-total="item">
          <b
            >SubTotal:
            {{ getPriceFormatted(item.totalCost + item.servicefee) }}</b
          >
          <p>Service Fee: - {{ getPriceFormatted(item.servicefee ?? "0") }}</p>

          Shipping: {{ getPriceFormatted(item.shippingFee ?? "0") }}<br />
          Tax: {{ getPriceFormatted(item.tax ?? "0") }}<br />
          <b
            >Total:
            {{ getPriceFormatted(item.totalCost + item.shippingFee) }}</b
          >
        </template>
      </easy-data-table>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import useFetch from "@/shared/composables/Fetch";
import {defineAsyncComponent, onMounted, reactive} from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useUtils } from "@/shared/composables/utils";
const  StatusDialog = defineAsyncComponent({
  loader:() => import("@/modules/orders/components/StatusDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})


const authStore = useAuthStore();
const utils = useUtils();
const { getPriceFormatted } = utils;

const state = reactive({
  orders: [],
  loading: false,
  defaultOrders: false,
  openStatusDiagId: "",
});

const headers = [
  { text: "Date", value: "date" },
  { text: "Product", value: "product" },
  { text: "Paid via", value: "paymentMethod" },
  { text: "Status", value: "status" },
  { text: "Shipping", value: "info" },
  { text: "Other Info", value: "customer" },
  { text: "Summary", value: "total" },
];
const fetchOrders = async () => {
  state.loading = true;
  let path = "";
  if (!state.defaultOrders) {
    path = `/orders/all/orders?userid=${authStore?.authUser._id}`;
  }
  if (state.defaultOrders) {
    path = `/orders/all/orders?shopId=${authStore?.authUser?.shopId._id}`;
  }
  const { data } = await useFetch(path);
  state.loading = false;
  state.orders = data.value.orders;
};

const fetchList = async () => {
  state.defaultOrders = !state.defaultOrders;
  await fetchOrders();
};
onMounted(() => {
  fetchOrders();
});
</script>

<style>
.customize-table {
  --easy-table-body-item-padding: 20px 10px;
  --easy-table-body-row-font-size: 15px;
  --easy-table-header-font-size: 20px;
  --easy-table-header-item-padding: 20px 10px;
  --easy-table-border: none;
}
.header-text {
  font-size: 16px;
}
</style>
