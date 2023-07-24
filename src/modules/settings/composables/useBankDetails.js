import { useFetch } from "@/shared/composables/Fetch";
import router from "@/shared/routes/routes";
import { useAuthStore } from "@/store/auth";
import { computed, reactive, toRefs } from "vue";
import { Country, State, City } from "country-state-city";
import Swal from "sweetalert2";

const authStore = useAuthStore();

export const useBankDetails = () => {
  const bankState = reactive({
    country: "",
    state: "",
    city: "",
    address: "",
    accountNumber: "",
    routingNumber: "",
    postalCode: "",
    phoneNumber: "",
    DOB: "",
    lastFourSSN: "",
    loading: false,
    countrySuggestions: Country.getAllCountries(),
    stateSuggestions: [],
    citySuggestions: [],
  });

  const getMatchingCountry = (evt) => {
    bankState.country = evt.currentTarget.value;
    bankState.stateSuggestions = State.getStatesOfCountry(
      evt.currentTarget.value
    );
  };

  const getStateSuggestions = (evt) => {
    bankState.state = evt.currentTarget.value;
    bankState.citySuggestions = City.getCitiesOfState(
      bankState.country,
      evt.currentTarget.value
    );
  };
  const getCitySuggestion = (evt) => {
    bankState.city = evt.currentTarget.value;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!isValid.value) return false;
    bankState.loading = true;
    const month = new Date(bankState.DOB).getMonth() + 1;
    const day = new Date(bankState.DOB).getDate();
    let dataa = {
      country: "US",
      currency: "usd",
      account_number: bankState.accountNumber,
      city: bankState.city,
      state: bankState.state,
      day: day < 9 ? `0${day}` : day,
      month: month < 9 ? `0${month}` : month,
      year: new Date(bankState.DOB).getFullYear(),
      ssn_last_4: bankState.lastFourSSN,
      address_one: bankState.address,
      address_two: bankState.address,
      postal_code: bankState.postalCode,
      phone: bankState.phoneNumber,
      routing_number: bankState.routingNumber,
      email: authStore.authUser?.email,
      name: authStore.authUser?.firstName,
      first_name: authStore.authUser?.firstName,
      last_name: authStore.authUser?.lastName,
      account_holder_name: `${authStore.authUser?.firstName} ${authStore.authUser?.lastName}`,
    };
    const { data } = await useFetch(
      `/stripe/connect/${authStore.authUser?._id}`,
      {
        method: "POST",
        data: dataa,
      }
    );
    if (data.value.account.success === true) {
      router.push("/settings/payout");
    } else {
      console.log(data);
      Swal.fire({
        icon: "error",
        text: data.value.message,
      }).then(() => {});
    }
    bankState.loading = false;
  };

  const onlyNumber = (event) => {
    const keyCode = event.keyCode ? event.keyCode : event.which;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  };

  const isValid = computed(
    () =>
      bankState.country &&
      bankState.city &&
      bankState.state &&
      bankState.address &&
      bankState.accountNumber &&
      bankState.routingNumber &&
      bankState.postalCode &&
      bankState.phoneNumber &&
      bankState.DOB &&
      bankState.lastFourSSN
  );

  return {
    ...toRefs(bankState),
    isValid,
    bankState,
    handleSubmit,
    onlyNumber,
    getMatchingCountry,
    getCitySuggestion,
    getStateSuggestions,
  };
};
