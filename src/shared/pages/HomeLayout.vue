<template>
  <div class="flex flex-col overflow-x-clip h-full">
    <navbar
        @goLive="toggleGoLive"
        @openCart="toggleCart"
        @openSidebar="toggleSidebar"
        @openSignUpDiag="toggleSignUpDiag"
        @openUserDiag="toggleUserDiag"
    />

    <topbar v-if="route.name !== 'categories' && route.name !== 'login'"/>
    <div class="w-full min-h-[75vh]">
      <router-view :key="$route.path"/>
    </div>

    <Footer/>
  </div>


  <!-- dialogs -->

  <div v-if="state.isSidebarOpen">
    <sidebar
        @close="toggleSidebar"
        @goLive="toggleGoLive"
        @openCart="toggleCart"
        @openSignUpDiag="toggleSignUpDiag"
    />
  </div>

  <div v-if="state.isCartOpen">
    <cart-dialog @close="toggleCart"/>
  </div>

  <div v-if="state.isUserDiagOpen">
    <user-dialog @close="toggleUserDiag"/>
  </div>
</template>

<script setup>
import Navbar from "@/shared/components/Navbars/Navbar.vue";
import Footer from "@/shared/components/Footers/Footer.vue";
import Topbar from "@/shared/components/Navbars/Topbar.vue";

const  UserDialog = defineAsyncComponent({
  loader:() => import("@/shared/components/Dialogs/UserDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const  CartDialog = defineAsyncComponent({
  loader:() => import("@/shared/components/Dialogs/CartDialog.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

const Sidebar = defineAsyncComponent({
  loader:() => import("@/shared/components/Sidebars/Sidebar.vue"),
  loadingComponent: import("@/shared/components/Spinner/SpinnerV2.vue")
})

import {defineAsyncComponent, onMounted, reactive, watch} from "vue";
import {useAuthStore} from "@/store/auth.js";
import {useRoute, useRouter} from "vue-router";

const authStore = useAuthStore();
const route = useRoute()
const router = useRouter()


onMounted(() => {
  authStore.getUser();
  authStore.getAppSettings();
});
const state = reactive({
  isSidebarOpen: false,
  isCartOpen: false,
  isGoLiveOpen: false,
  isUserDiagOpen: false,
  isSignUpOpen: false,
});

const toggleSidebar = () => (state.isSidebarOpen = !state.isSidebarOpen);
const toggleGoLive = () => (state.isGoLiveOpen = !state.isGoLiveOpen);
const toggleCart = () => (state.isCartOpen = !state.isCartOpen);
const toggleUserDiag = () => (state.isUserDiagOpen = !state.isUserDiagOpen);
const toggleSignUpDiag = () => (state.isSignUpOpen = !state.isSignUpOpen);


watch(authStore, value => {
  if (!value.authUser?._id && route.meta.requires_auth)
    router.push('/login')
  // if (!value.authUser?._id && route.meta.requires_shop)
  //   router.push('/shop/new')
})

</script>
