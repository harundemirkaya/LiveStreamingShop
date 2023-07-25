<template>
  <div
      class="bg-[linear-gradient(0deg,rgba(0,0,0,.25),hsla(0,0%,100%,0),rgba(0,0,0,.25))] rounded-[10px] shadow-lg
      hover:shadow-2xl"
  >
    <div
        :class="[shop.image ? 'bg-cover bg-center' : 'bg-center  bg-contain']"
        :style="{
        backgroundImage: `url('${shop.image || '/imgs/mic_logo.png'}')`,
      }"
        class="h-[313px] min-[500px]:h-[350px] md:h-[288px] lg:h-[170px] relative rounded-md bg-no-repeat cursor-pointer"
        @click="handleShopClick"
    >
      <div v-if="authStore.authUser._id !== shop.userId?._id" class="absolute right-[15px] top-[15px] z-10" @click.stop="">
        <button
            v-if="!state.loading && !state.isFollowing"
            :class="[state.isFollowing ? 'bg-[rgba(0,0,0,.2)] ' : 'bg-primary']"
            class="rounded-md text-[14px] leading-[1.5] cursor-pointer text-white font-semibold text-lg px-2 py-1"
            @click="handleFollowClick"
        >
          {{ state.isFollowing ? "  Takipten Çıkart" : "Takip Et" }}
        </button>

        <svg
            v-if="!state.loading && state.isFollowing"
            aria-hidden="true"
            class="h-8 w-8"
            fill="none"
            stroke="#36454F"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="handleFollowClick"
        >
          <path
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
          ></path>
        </svg>

        <spinner-v2 :load="state.loading" class="-mt-6"/>
      </div>

      <p
          class="bg-gray-600/50 px-1 rounded-lg text-white text-[14px] font-semibold shadow-2xl  absolute bottom-5 left-5
         tracking-wide"
      >
        {{ shop.name }}
      </p>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {useFollow} from "@/shared/composables/follow.js";
import {onMounted, reactive, watch} from "vue";
import {useAuthStore} from "@/store/auth.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const props = defineProps(["shop"]);

const state = reactive({
  image: "",
  isFollowing: false,
  loading: false,
});

const router = useRouter();
const {follow, loading, checkFollowing} = useFollow();
const authStore = useAuthStore();

const handleShopClick = () => {
  router.push(`/shop/${props.shop._id}`);
};

onMounted(() => {
  state.isFollowing =  checkFollowing({followedId: props?.shop?.userId?._id});
});

watch(authStore, () => {
  state.isFollowing =   checkFollowing({followedId: props?.shop?.userId?._id});
});

const handleFollowClick = async () => {
  state.loading = true;
  await follow({followedId: props?.shop?.userId?._id});
  state.loading = false;
};
</script>
