<template>
  <div class="flex flex-col gap-8">
    <form class="flex flex-col gap-8 w-full">
      <div class="input-wrapper">
        <label class="labels" for="insuranceCo">Country</label>
        <select
          class="inputs w-full"
          @change="getMatchingCountry"
          v-model="state.address.countryCode"
        >
          <option disabled selected>Country</option>
          <option
            v-for="country in state.countrySuggestions"
            :key="country.name"
            :value="country.isoCode"
          >
            {{ country.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col md:flex-row w-full gap-10">
        <div class="input-wrapper">
          <label for="city" class="labels">State</label>
          <select
            class="inputs w-full"
            @change="getStateSuggestions"
            v-model="state.address.stateCode"
          >
            <option disabled selected>State</option>
            <option
              v-for="state in state.stateSuggestions"
              :key="state.name"
              :value="state.isoCode"
            >
              {{ state.name }}
            </option>
          </select>
        </div>
        <div class="input-wrapper">
          <label for="state" class="labels">City </label>
          <select
            class="inputs w-full"
            @change="getCitySuggestion"
            v-model="state.address.cityCode"
          >
            <option disabled selected>City</option>
            <option
              v-for="city in state.citySuggestions"
              :key="city.name"
              :value="city.isoCode"
            >
              {{ city.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex w-full gap-10 items-center">
        <div class="input-wrapper">
          <label for="name" class="labels"> Name</label>
          <input
            type="text"
            id="name"
            class="inputs"
            v-model="state.address.name"
          />
        </div>
      </div>
      <div class="input-wrapper">
        <label for="addrress1" class="labels">Address</label>
        <input
          type="text"
          id="addrress1"
          class="inputs"
          placeholder="Address one"
          v-model="state.address.addrress1"
        />
      </div>
      <div class="input-wrapper -mt-4">
        <input
          type="text"
          id="addrress2"
          class="inputs"
          placeholder="Apartment Suite, Unit, Building, Floor, etc"
          v-model="state.address.addrress2"
        />
      </div>
      <div class="input-wrapper">
        <label for="phone" class="labels">Phone number</label>
        <input
          type="text"
          id="phone"
          class="inputs"
          placeholder="Enter phonenumber"
          v-model="state.address.phone"
        />
      </div>
      <div class="input-wrapper">
        <label for="zipcode" class="labels">Zip Code</label>
        <input
          type="text"
          id="zipcode"
          class="inputs"
          v-model="state.address.zipcode"
        />
      </div>
      <spinner-v2 :load="state.loading" />
      <button
        v-if="!state.loading"
        class="primary-btn w-40"
        @click="updateMyAddrress"
      >
        Update
      </button>
    </form>
  </div>
</template>

<script setup>
import { useFetch } from "@/shared/composables/Fetch";
import { useAuthStore } from "@/store/auth";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { onMounted, reactive } from "vue";
import { Country, State, City } from "country-state-city";

const authStore = useAuthStore();
const state = reactive({
  address: {
    name: "",
    addrress1: "",
    addrress2: "",
    phone: "",
    zipcode: "",
    country: "",
    state: "",
    city: "",
    countryCode: "",
    stateCode: "",
    cityCode: "",
  },
  stateSuggestions: [],
  citySuggestions: [],
  countrySuggestions: Country.getAllCountries(),
  loading: false,
  country: "",
  state: "",
  city: "",
});
onMounted(() => {
  fetchMyAddress();
});

const fetchMyAddress = async () => {
  const { data } = await useFetch("/address/all/" + authStore.authUser?._id);

  if (data.value) {
    state.address = data.value[0];
    state.stateSuggestions = State.getStatesOfCountry(
      data.value[0].countryCode
    );
    state.citySuggestions = City.getCitiesOfState(
      state.address.countryCode,
      data.value[0].stateCode
    );
    console.log(state.address.countryCode, data.value[0].stateCode);
  }
};
const updateMyAddrress = async (e) => {
  e.preventDefault();
  state.loading = true;
  if (state.address._id) {
    const { data } = await useFetch("/address/" + state.address?._id, {
      method: "PUT",
      data: { ...state.address, userId: authStore.authUser?._id },
    });
    if (data.value) {
      state.address = data.value.data;
    }
  } else {
    const { data } = await useFetch("/address/" + authStore.authUser?._id, {
      method: "POST",
      data: state.address,
    });
    if (data.value) {
      state.address = data.value;
    }
  }
  state.loading = false;
};

const getMatchingCountry = (evt) => {
  let country = Country.getCountryByCode(evt.currentTarget.value);
  state.address.countryCode = country.isoCode;
  state.address.country = country.name;
  state.stateSuggestions = State.getStatesOfCountry(evt.currentTarget.value);
};

const getStateSuggestions = (evt) => {
  let stateData = State.getStateByCodeAndCountry(
    evt.currentTarget.value,
    state.address.countryCode
  );

  state.address.state = stateData.name;
  state.address.stateCode = stateData.isoCode;
  state.citySuggestions = City.getCitiesOfState(
    state.address.countryCode,
    evt.currentTarget.value
  );
};
const getCitySuggestion = (evt) => {
  console.log(evt.currentTarget.value);
  state.address.city = evt.currentTarget.value;
  state.address.cityCode = evt.currentTarget.value;
};
</script>
