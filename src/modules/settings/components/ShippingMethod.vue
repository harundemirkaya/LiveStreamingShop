<template>
  <div class="flex flex-col gap-8">
    <p class="text-lg font-semibold">Kargo Yöntemleri</p>
    <div>
      <button class="primary-btn rounded-md" @click="addNewShippingRow">
        Ekle +
      </button>
    </div>
    <form v-for="shipping in state.shippings" :key="shipping">
      <div class="flex w-full items-center gap-4 mt-8">
        <input
          type="text"
          class="inputs"
          v-model="shipping.name"
          placeholder="İsim"
        />
        <input
          type="number"
          class="inputs"
          v-model="shipping.amount"
          placeholder="Fiyat"
        />
        <p
          @click="deleteShippingMethod(shipping)"
          class="text-info cursor-pointer"
        >
          Sil
        </p>
      </div>
    </form>
    <p
      v-if="!state.loading"
      @click="saveShippingMethod"
      class="primary-btn rounded-md text-center"
    >
      Güncelle</p
    ><spinner-v2 :load="state.loading" />
  </div>
</template>
<script setup>
import { useFetch } from "@/shared/composables/Fetch";
import { useAuthStore } from "@/store/auth";
import { reactive } from "vue-demi";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
const authStore = useAuthStore();

const state = reactive({
  shippings: authStore.authUser?.shopId?.shippingMethods,
  loading: false,
});
const addNewShippingRow = () => {
  state.shippings.push({ name: "", amount: 0, enabled: false });
};
const deleteShippingMethod = (sp) => {
  let filtered = state.shippings.filter((s) => s.name !== sp.name);
  state.shippings = filtered;
  saveShippingMethod();
  console.log(filtered);
};

const saveShippingMethod = async () => {
  state.loading = true;
  let { data, status } = await useFetch(
    "/shop/shippingmethods/add/" + authStore.authUser?.shopId?._id,
    {
      data: {
        data: state.shippings.filter((s) => s.name != ""),
      },
      method: "POST",
    }
  );
  state.loading = false;
};
</script>
