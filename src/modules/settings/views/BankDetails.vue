<template>
  <form
    autocomplete="off"
    class="flex flex-col gap-6 w-full content-container py-16"
    @submit="handleSubmit"
  >
    <p class="text-3xl font-semibold tracking-wider">Banka Hesap Bilgileri</p>
    <div class="flex gap-4 flex-col md:flex-row w-full">
      <div class="input-wrapper">
        <label class="labels" for="insuranceCo">Ülke</label>
        <select class="inputs w-full" @change="getMatchingCountry">
          <option disabled selected>Ülke</option>
          <option
            v-for="country in countrySuggestions"
            :key="country.name"
            :value="country.isoCode"
          >
            {{ country.name }}
          </option>
        </select>
      </div>

      <div class="input-wrapper">
        <label class="labels" for="state">Şehir</label>
        <select class="inputs w-full" @change="getStateSuggestions">
          <option disabled selected>Şehir</option>
          <option
            v-for="state in stateSuggestions"
            :key="state.name"
            :value="state.isoCode"
          >
            {{ state.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex gap-4 flex-col md:flex-row w-full">
      <div class="input-wrapper">
        <label class="labels" for="state">İlçe</label>
        <select class="inputs w-full" @change="getCitySuggestion">
          <option disabled selected>İlçe</option>
          <option
            v-for="city in citySuggestions"
            :key="city.name"
            :value="city.isoCode"
          >
            {{ city.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex gap-4 flex-col md:flex-row w-full">
      <tok-input v-model="address" label="*Adres" required />
    </div>
    <div class="flex gap-4 flex-col md:flex-row w-full">
      <tok-input
        v-model="accountNumber"
        :required="true"
        label="*IBAN"
      />
      <tok-input
        v-model="routingNumber"
        :required="true"
        label="*İsim Soyisim"
        type="text"
      />
    </div>
    <div class="flex gap-4 flex-col md:flex-row w-full">
      <tok-input v-model="postalCode" :required="true" label="*Posta Kodu" />
      <tok-phone-input
        v-model="phoneNumber"
        :required="true"
        label="*Telefon Numarası"
        @keypress="onlyNumber"
      />
    </div>
    <div class="flex gap-4 flex-col md:flex-row w-full">
      <tok-date-picker
        v-model="DOB"
        :required="true"
        label="*Doğum Tarihi"
        type="date"
      />
      <tok-input
        v-model="lastFourSSN"
        :required="true"
        label="*TC Kimlik Numarası"
        maxLength="11"
        type="text"
        @keypress="onlyNumber"
      />
    </div>
    <spinner-v2 :load="loading" />
    <button
      :class="[isValid ? 'bg-info' : 'bg-slate-300']"
      class="primary-btn w-44"
      type="submit"
    >
      Kaydet
    </button>
  </form>
</template>

<script setup>
import { useBankDetails } from "@/modules/settings/composables/useBankDetails.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const {
  country,
  state,
  city,
  address,
  accountNumber,
  DOB,
  phoneNumber,
  routingNumber,
  lastFourSSN,
  postalCode,
  handleSubmit,
  isValid,
  loading,
  onlyNumber,
  getMatchingCountry,
  countrySuggestions,
  getStateSuggestions,
  stateSuggestions,
  citySuggestions,
  getCitySuggestion,
} = useBankDetails();
</script>
