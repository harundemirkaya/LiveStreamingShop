<template>
  <p class="text-lg text-info font-semibold tracking-wide -mt-8 w-full">
    Add Shipping Details
  </p>
  <form class="flex flex-col gap-8 w-full" @submit="handleSubmit">
    <div class="input-wrapper">
      <label class="labels" for="country">Name</label>
      <input
        id="name"
        v-model="state.name"
        class="inputs"
        required
        type="text"
      />
    </div>
    <div class="input-wrapper">
      <label class="labels" for="country">Country</label>
      <input
        id="country"
        v-model="state.country"
        class="inputs"
        required
        type="text"
      />
    </div>

    <div class="input-wrapper">
      <label class="labels" for="address">Address</label>
      <input
        id="address"
        v-model="state.address1"
        class="inputs"
        placeholder="Street and number P.O Box"
        required
        type="text"
      />
    </div>
    <div class="input-wrapper -mt-4">
      <input
        id="apartment"
        v-model="state.address2"
        class="inputs"
        placeholder="Apartment Suite, Unit, Building, Floor, etc"
        type="text"
      />
    </div>
    <div class="flex w-full gap-10 items-end">
      <div class="input-wrapper">
        <label class="labels" for="city">City</label>
        <input
          id="city"
          v-model="state.city"
          class="inputs"
          required
          type="text"
        />
      </div>
      <div class="input-wrapper">
        <label class="labels" for="state">State</label>
        <input
          id="state"
          v-model="state.state"
          class="inputs"
          required
          type="text"
        />
      </div>
    </div>
    <div class="input-wrapper">
      <label class="labels" for="zip">Zip/Postal Code</label>
      <input
        id="zip"
        v-model="state.zip_code"
        class="inputs"
        required
        type="number"
      />
    </div>
    <div class="input-wrapper">
      <label class="labels" for="zip">Phone</label>
      <input id="zip" v-model="state.phone" class="inputs" type="tel" />
    </div>

    <spinner-v2 :load="state.loading" />
    <button v-if="!state.loading" class="outline-btn">
      {{ !state.shippingId ? "Save &  Continue" : "Update Address" }}
    </button>
  </form>
</template>

<script setup>
import useFetch from "@/shared/composables/Fetch.js";
import { onMounted, reactive, watch } from "vue";
import { useAuthStore } from "@/store/auth.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const state = reactive({
  name: "",
  country: "",
  fName: "",
  lName: "",
  address1: "",
  street: "",
  address2: "",
  city: "",
  state: "",
  zip_code: "",
  phone: "",
  shippingId: "",

  loading: false,
});

const authStore = useAuthStore();

const getAddress = async () => {
  // await authStore?.getUser()
  if (authStore?.authUser?.address == null) return;
  state.address1 = authStore?.authUser?.address.addrress1;
  state.address2 = authStore?.authUser?.address.addrress2;
  state.city = authStore?.authUser?.address.city;
  state.country = authStore?.authUser?.address.country;
  state.name = authStore?.authUser?.address.name;
  state.phone = authStore?.authUser?.address.phone;
  state.state = authStore?.authUser?.address.state;
  state.shippingId = authStore?.authUser?.address._id;
  state.zip_code = authStore?.authUser?.address.zipcode;
  state.street = authStore?.authUser?.address.street;
};

const handleSubmit = async (evt) => {
  evt.preventDefault();
  let method = "POST";
  let url = "/address";

  if (state.shippingId) {
    method = "PUT";
    url = `/address/${state.shippingId}`;
  }
  state.loading = true;
  await useFetch(url, {
    method: method,
    data: {
      name: state.name,
      country: state.country,
      fName: state.fName,
      lName: state.lName,
      addrress1: state.address1,
      addrress2: state.address2,
      city: state.city,
      state: state.state,
      street: state.street,
      zipcode: state.zip_code,
      phone: state.phone,
      userId: authStore.authUser._id,
    },
  });

  state.loading = false;
};

onMounted(() => {
  getAddress();
});

watch(authStore, (value) => {
  if (value.authUser) getAddress();
});
</script>
