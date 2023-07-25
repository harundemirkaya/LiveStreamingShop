<template>
  <div
    class="flex flex-col content-container gap-4 py-16 min-h-[90vh] md:min-h-[70vh] lg:min-h-[40vh] xl:min-h-[80vh] items-center relative"
    @click="state.isTagDialogOpen = false"
  >
    <div class="flex flex-col w-full max-w-6xl gap-4 items-center">
      <div class="flex w-full justify-between items-center">
        <p class="text-2xl text-primary tracking-wide font-semibold">Canlı Yayın Başlat</p>
        <img alt="play" class="w-12" src="/imgs/play.svg" />
      </div>
      <hr />
      <form class="flex flex-col w-full gap-8 h-full" @submit="handleSubmit">
        <tok-input
          id="name"
          v-model="state.title"
          :required="true"
          class="w-full"
          label="Başlık"
          placeholder=" "
          type="text"
        />

        <div
          class="flex w-full gap-4 lg:gap-16 flex-col lg:flex-row items-center"
          @click.stop=""
        >
          <div class="flex flex-col w-full gap-3">
            <div class="input-wrapper">
              <label class="labels" for="channel">Ürünler</label>
              <select
                id="tag"
                class="inputs"
                v-model="state.keyword"
                v-if="state.productList.length > 0"
              >
                <option
                  v-for="item in state.productList"
                  :key="item._id"
                  :value="item.name"
                  :disabled="item.quantity < 1"
                >
                  {{ item.name }} | Stok: {{ item.quantity }}
                </option>
              </select>
              <div v-else>
                <button
                  @click="
                    $router.push(`shop/add/${authStore.authUser?.shopId?._id}`)
                  "
                  class="outline-btn"
                >
                  Add New Product
                </button>
              </div>
            </div>

            <div
              v-if="state.taggedProducts.length > 0"
              class="bg-secondary/20 w-full p-3 min-h-16 rounded-lg flex flex-wrap gap-8 items-center"
            >
              <div
                v-for="item in state.taggedProducts"
                :key="item._id"
                class="badge badge-lg relative"
              >
                {{ item.name }}
                <svg
                  aria-hidden="true"
                  class="absolute -top-4 -right-4 h-6 w-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="removeTaggedProduct(item._id)"
                >
                  <path
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center w-full gap-16">
          <div class="input-wrapper">
            <label class="labels" for="channel">Kategori</label>
            <select
              id="channel"
              v-model="state.channel"
              class="inputs"
              required
            >
              <option v-for="c in state.channels" :key="c">
                {{ c.title }}
              </option>
            </select>
          </div>
          <div class="hidden lg:flex lg:w-full" />
        </div>

        <div
          class="flex flex-col-reverse md:flex-row w-full md:items-center justify-between gap-4"
        >
          <div
            class="flex md:w-5/12 items-center justify-between gap-4 cursor-pointer"
            @click="toggleSchedule"
          >
            <p class="text-sm md:text-xl font-medium">İleri Tarih</p>
            <div
              :class="[state.schedule ? 'bg-green-500' : 'bg-red-500']"
              class="w-6 h-6 rounded-full ring-2 ring-secondary p-2 ring-offset-2 cursor-pointer"
            />
          </div>
          <div class="flex md:w-5/12 items-center justify-between gap-4">
            <p class="text-sm md:text-xl font-medium">Mesajlaşmaya İzin Ver</p>
            <input
              v-model="state.chat"
              class="toggle toggle-success"
              type="checkbox"
            />
          </div>
        </div>

        <div v-show="state.schedule" class="flex flex-col w-full gap-8">
          <div class="input-wrapper md:w-1/2">
            <label class="labels" for="date">Select Date</label>
            <input
              id="date"
              v-model="state.date"
              class="inputs"
              required
              type="date"
            />
          </div>
          <div class="input-wrapper md:w-1/2">
            <label class="labels" for="time">Select Time</label>
            <input
              id="time"
              v-model="state.time"
              class="inputs"
              required
              type="time"
            />
          </div>
        </div>

        <div class="flex items-center w-full lg:justify-end gap-5 mt-auto">
          <button
            v-if="!state.loading && state.taggedProducts.length > 0"
            class="primary-btn"
            type="submit"
          >
            {{ state.schedule ? "İleri Tarihli Yayını Ayarla" : "Yayına Başla" }}
          </button>
          <spinner-v2 :load="state.loading" />
        </div>
      </form>
    </div>

    <div v-if="!dialogState.isOpen">
      <default-dialog
        @close="dialogToggle"
        title="Canlı Yayına Geçmek İçin Önce Ödeme Yönteminizi Ayarlamanız Gerekmektedir"
        buttonText="Ödeme Yöntemini Ayarla"
        @handler="router.push('/bankdetails')"
        showHandler="true"
        showCancel="true"
        message="BeeRelation'a Hoş Geldiniz! Canlı yayınlarda başarılı satışlar yapabilmek için bir sipariş aldığınızda size nasıl ödeme yapacağımızı bilmemiz gerekir."
      />
    </div>
  </div>
</template>

<script setup>
import {defineAsyncComponent, onMounted, reactive, watch} from "vue";
import { useRouter } from "vue-router";
import { useFetch } from "@/shared/composables/Fetch.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import { useAuthStore } from "@/store/auth.js";
const DefaultDialog = defineAsyncComponent({
  loader:() => import("@/shared/components/Dialogs/DefaultDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})
import moment from "moment";

const state = reactive({
  title: "",
  schedule: false,
  chat: false,
  date: new Date().toISOString().slice(0, 10),
  time: "00:00",
  isTagDialogOpen: false,
  taggedProducts: [],
  keyword: "",
  productList: [],
  loading: false,
  loadingProducts: false,
  channels: [],
  channel: "",
});

const emit = defineEmits(["close"]);
const router = useRouter();
const authStore = useAuthStore();

const getProducts = async () => {
  state.loadingProducts = true;
  const { data } = await useFetch(
    `/products/paginated/allproducts?page=1&limit=15&featured=false&channel&title=${state.keyword}&price&shopId=${authStore?.authUser?.shopId?._id}&interest`
  );
  state.productList = data.value.products;

  state.loadingProducts = false;
};
const dialogState = reactive({
  isOpen: authStore.authUser?.payoutmethod == null,
});
const dialogToggle = () => {
  dialogState.isOpen = !dialogState.isOpen;
  router.back();
};

const toggleSchedule = () => (state.schedule = !state.schedule);

const handleSubmit = async (evt) => {
  evt.preventDefault();
  let productIds = state.taggedProducts.map((p) => p._id);
  let eventTime = moment(state.date + " " + state.time);
  let eventMillseconds = new Date(eventTime).getTime();
  let channelId = state.channels.find((c) => (c.title = state.channel))._id;

  const body = {
    title: state.title,
    roomType: "public",
    allowrecording: true,
    allowchat: state.chat,
    discount: "0",
    productIds: productIds,
    hostIds: [],
    userIds: [],
    raisedHands: [],
    speakerIds: [],
    invitedIds: [],
    shopId: authStore?.authUser?.shopId?._id,
    status: true,
    ended: false,
    productPrice: [],
    activeTime: Date.now(),
    channel: channelId,
  };

  if (state.schedule) {
    body.event = state.schedule;
    body.eventDate = eventMillseconds;
  }

  state.loading = true;
  const { status, data } = await useFetch(
    `/rooms/${authStore?.authUser?._id}`,
    {
      method: "POST",
      data: body,
    }
  );

  if (status.value === 200) router.push(`/live/${data.value._id}`);

  state.loading = false;
};

const removeTaggedProduct = (id) => {
  state.taggedProducts = state.taggedProducts.filter((prod) => prod._id !== id);
};

const getChannels = async () => {
  state.loading = true;
  const { data, status } = await useFetch(`/channels`);
  state.loading = false;
  if (status.value === 200) {
    state.channels = data.value;
  }
};

onMounted(() => {
  if (authStore?.authUser?.shopId == null) {
    router.push("shop/new");
  } else {
    getChannels();
    getProducts();
  }
});

watch(
  () => state.keyword,
  (value) => {
    let found = state.productList.findIndex(
      (product) => product.name === value
    );
    let existing = state.taggedProducts.findIndex(
      (product) => product.name === value
    );
    if (found > -1 && existing === -1) {
      state.taggedProducts.push(state.productList[found]);
      state.keyword = "";
    }
    getProducts();
  }
);
</script>
