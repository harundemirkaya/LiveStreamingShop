<template>
  <div class="input-wrapper relative">
    <select
      @change="handleSelectChange"
      v-model="state.status"
      id="tag"
      class="border-[1px] border-primary text-white font-semibold rounded-lg text-center w-24 py-[1px] px-1 bg-primary"
    >
      <option
        class="text-white bg-primary text-lg text-center p-2"
        v-for="item in opts"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useFetch } from "@/shared/composables/Fetch";
import { reactive } from "vue";

const opts = [
  "pending",
  "cancelled",
  "shipped",
  "delivered",
  "processed",
  "on-hold",
  "completed",
  "processing",
  "refunded",
];
const emits = defineEmits(["close"]);
const props = defineProps(["currentState", "orderid"]);
const state = reactive({
  status: props.currentState,
});
const handleSelectChange = async (env) => {
  console.log(props.orderid);
  let { data, status } = await useFetch("orders/orders/"+props.orderid, {
    method: "PUT",
    data: { status: env.currentTarget.value },
  });
};
</script>
