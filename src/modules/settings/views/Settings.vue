<template>
  <div
    class="flex flex-col lg:flex-row w-full content-container py-16 gap-4 lg:gap-20"
  >
    <div
      class="tabs items-start flex flex-row lg:flex-col w-full lg:max-w-[180px] lg:gap-8"
    >
      <p
        class="hidden lg:block text-2xl md:text-3xl text-primary font-semibold mb-4 tracking-wide"
      >
        Settings
      </p>
      <a
        @click="router.push('/settings')"
        :class="[
          pathname === '/settings' ? 'text-info tab-active lg:border-0' : '',
        ]"
        class="tab lg:justify-start tab-bordered text-xs lg:text-lg font-medium text-primary lg:border-0"
      >
        Shipping Address
      </a>
      <a
        @click="router.push('/settings/import-products')"
        :class="[
          pathname === '/settings/import-products'
            ? 'text-info tab-active'
            : '',
        ]"
        class="tab lg:justify-start tab-bordered text-xs lg:text-lg font-medium text-primary lg:border-0"
      >
        Import Products
      </a>
      <a
        @click="router.push('/settings/shipping-method')"
        :class="[
          pathname === '/settings/shipping-method'
            ? 'text-info tab-active'
            : '',
        ]"
        class="tab lg:justify-start tab-bordered text-xs lg:text-lg font-medium text-primary lg:border-0"
      >
        Shipping Method
      </a>
      <a
        @click="router.push('/settings/payout')"
        :class="[
          pathname === '/settings/payout'
            ? 'text-info tab-active'
            : '',
        ]"
        class="tab lg:justify-start tab-bordered text-xs lg:text-lg font-medium text-primary lg:border-0"
      >
        Payout Settings
      </a>
    </div>
    <div class="hidden lg:block min-h-[80vh] w-[1px] bg-secondary"></div>
    <div class="p-4 w-full max-w-4xl">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const pathname = router.currentRoute.value.path;
</script>
