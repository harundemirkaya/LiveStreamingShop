<template>
  <div class="flex flex-col content-container mx-auto pt-8  md:pt-16 lg:pt-20">
    <div class="flex flex-col xl:flex-row-reverse xl:gap-10 w-full">
      <div
        class="w-full xl:min-w-[40vw] h-[32vh] md:h-[25vh] 2xl:h-[60vh] relative hero-bg bg-contain xl:bg-cover bg-center bg-no-repeat"
      >
        <div
          class="absolute w-full h-full bg-info -z-20 rounded-lg xl:rounded-[50px] xl:w-8/12 2xl:w-7/12 xl:left-1/2 xl:-translate-x-1/2"
        />
        <img
          src="/imgs/clear_gift.svg"
          alt="hero"
          class="hidden xl:block h-[142px] absolute -z-10 xl:z-10 xl:top-16 xl:left-0 2xl:left-10"
        />
        <img
          src="/imgs/blur_gift.svg"
          alt="hero"
          class="hidden xl:block w-[242px] absolute bottom-0 right-0 -z-10 xl:z-10 xl:bottom-1/3 xl:-right-20"
        />
      </div>

      <div class="py-4 md:py-16 my-auto w-full">
        <h1
          class="text-2xl md:text-5xl font-semibold lg:font-bold md:tracking-wide text-primary"
        > 
          <span class="text-info">Herkesin </span> bahsettiği alışveriş deneyimi!
        </h1>
        <p class="py-4 md:py-12 text-xl md:text-2xl font-medium text-primary">
          Herkesin kullanabileceği yerleşik bir satın alma deneyimi ile canlı yayında alışveriş şovları için ilk çevrimiçi platformu oluşturduk.
        </p>
        <button
          v-if="!authStore.token"
          @click="router.push('/login')"
          class="bg-info text-white font-semibold text-[24px] leading-[29px] rounded-[44px] w-[237px] h-[73px] flex items-center justify-center focus:outline-none focus:ring-0"
        >
          Bize Katıl
        </button>
        <button
          v-else
          @click="handleClick"
          class="bg-info text-white font-semibold text-[18px] leading-[29px] rounded-[44px] w-[207px] h-[58px] flex items-center justify-center focus:outline-none focus:ring-0"
        >
          Satışa Başla
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const emit = defineEmits(["openSignUpDiag"]);
const router = useRouter();

const pathname = router.currentRoute.value.path;

const handleClick = () => {
  if (authStore.authUser?.shopId) {
    router.push(`/shop/` + authStore.authUser?.shopId._id);
  } else {
    router.push(`/shop/new`);
  }
};
</script>
<style scoped>
.hero-bg {
  background-image: url("/imgs/heropng.png");
}
</style>
