<template>
  <div class="flex flex-col gap-8 min-h-full">
    <p class="text-xl text-primary font-semibold tracking-wider">Import from</p>
    <div class="flex flex-col md:flex-row w-full md:items-center gap-6">
      <div
        :class="[state.selected === 'wc' ? `border-info text-info ` : ` `]"
        @click="toggleImportOptions('wc')"
        class="w-52 h-14 bgwc bg-center bg-no-repeat h-14 border-2 rounded-lg cursor-pointer"
      />
      <div
        :class="[state.selected === 'sp' ? `border-info text-info ` : ` `]"
        @click="toggleImportOptions('sp')"
        class="w-52 h-14 bgsh bg-center bg-no-repeat h-14 border-2 rounded-lg cursor-pointer"
      />
    </div>
    <div v-if="state.selected === 'wc'">
      <form class="flex flex-col gap-8 w-full" @submit="handleSubmit">
        <div class="input-wrapper">
          <label for="wcUrl" class="labels"> Shop Url</label>
          <input
            required
            type="text"
            id="wcUrl"
            v-model="state.wcUrl"
            class="inputs"
            placeholder="Woocomerce Shop Url"
          />
        </div>
        <div class="input-wrapper">
          <label for="wcSecretKey" class="labels">Security Key</label>
          <input
            required
            type="text"
            id="wcSecretKey"
            v-model="state.wcSecretKey"
            class="inputs"
            placeholder="Security Key"
          />
        </div>
        <div class="input-wrapper">
          <label for="wcConsumerKey" class="labels">Consumer Key</label>
          <input
            required
            type="text"
            id="wcConsumerKey"
            v-model="state.wcConsumerKey"
            class="inputs"
            placeholder="Consumer Key"
          />
        </div>
        <div v-if="state.status === true && !state.loading">
          <h1 class="text-info">{{ state.message }}</h1>
        </div>
        <button class="primary-btn mt-4" v-if="!state.loading">
          {{ state.wcimportready }}
        </button>
      </form>
    </div>
    <div v-if="state.selected === 'sp'">
      <form class="flex flex-col gap-8 w-full" @submit="handleSubmit">
        <div class="input-wrapper">
          <label for="shopifyUrl" class="labels">Shopify Store Url</label>
          <input
            required
            type="text"
            id="shopifyUrl"
            v-model="state.shopifyUrl"
            class="inputs"
            placeholder="Shopify Url"
          />
        </div>
        <div class="input-wrapper">
          <label for="shopifyAccessToken" class="labels">Access Token</label>
          <input
            required
            type="text"
            id="shopifyAccessToken"
            v-model="state.shopifyAccessToken"
            class="inputs"
            placeholder="Security Key"
          />
        </div>
        <div v-if="state.status === true && !state.loading">
          <h1 class="text-info">{{ state.message }}</h1>
        </div>
        <button class="primary-btn mt-4" v-if="!state.loading">
          {{ state.spimportready }}
        </button>
      </form>
    </div>
    <spinner-v2 :load="state.loading" />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { onMounted, reactive } from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useFetch } from "@/shared/composables/Fetch";

const authStore = useAuthStore();
const state = reactive({
  wcUrl: authStore.authUser?.shopId.wcUrl,
  wcSecretKey: authStore.authUser?.shopId.wcSecretKey,
  wcConsumerKey: authStore.authUser?.shopId.wcConsumerKey,
  shopifyUrl: authStore.authUser?.shopId.shopifyUrl,
  shopifyAccessToken: authStore.authUser?.shopId.shopifyAccessToken,
  selected: "wc",
  wcimportready: "Save",
  spimportready: "Save",
  status: null,
  message: "",
  loading: false,
});

onMounted(() => {
  checkImportStatus(state.selected);
});
const checkImportStatus = (type) => {
  if (type === "wc") {
    if (
      authStore.authUser?.shopId.wcUrl !== "" &&
      authStore.authUser?.shopId.wcSecretKey !== "" &&
      authStore.authUser?.shopId.wcConsumerKey !== ""
    ) {
      state.wcimportready = "Import Woocommerce Products";
    }
  }
  if (type === "sp") {
    if (
      authStore.authUser?.shopId.shopifyUrl !== "" &&
      authStore.authUser?.shopId.shopifyAccessToken !== ""
    ) {
      state.spimportready = "Import Shopify Products";
    }
  }
  console.log(state.spimportready);
};
const toggleImportOptions = (type) => {
  state.selected = type;
  state.status = false;
  checkImportStatus(type);
};
const handleSubmit = async (evt) => {
  evt.preventDefault();
  state.loading = true;
  if (state.selected === "wc") {
    useFetch(`/shop/shop/${authStore.authUser?.shopId?._id}`, {
      method: "PUT",
      data: {
        wcConsumerKey: state.wcConsumerKey,
        wcUrl: state.wcUrl,
        wcSecretKey: state.wcSecretKey,
      },
    }).then(async () => {
      const { data } = await useFetch(`/import`, {
        method: "POST",
        data: { userId: authStore?.authUser?._id, type: "import" },
      });
      state.message = data.value.message;
      state.status = data.value.status;
      state.loading = false;
    });
  }
  if (state.selected === "sp") {
    useFetch(`/shop/shop/${authStore.authUser?.shopId?._id}`, {
      method: "PUT",
      data: {
        shopifyAccessToken: state.shopifyAccessToken,
        shopifyUrl: state.shopifyUrl,
      },
    }).then(async () => {
      const { data } = await useFetch(`/import/shopify`, {
        method: "POST",
        data: { userId: authStore?.authUser?._id, type: "import" },
      });
      state.message = data.value.message;
      state.status = data.value.status;
      state.loading = false;
    });
  }
  console.log();
};
</script>

<style scoped>
.bgsh {
  background-image: url("/imgs/shopify.svg");
}
.bgwc {
  background-image: url("/imgs/woo.svg");
}
</style>
