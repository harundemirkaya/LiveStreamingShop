import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth.js";
import { toRaw } from "vue";
import pinia from "@/store/store.js";

const routes = [
  {
    path: "/",
    component: () => import("@/shared/pages/HomeLayout.vue"),
    children: [
      {
        path: "messaging",
        name: "messaging",
        component: () => import("@/modules/messaging/views/Messaging.vue"),
        children: [
          {
            path: ":userId",
            name: "inbox",
            component: () => import("@/modules/messaging/views/Inbox.vue"),
          },
          {
            path: "",
            name: "newmsg",
            component: () => import("@/modules/messaging/views/NewMessage.vue"),
          },
        ],
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "bankdetails",
        name: "bankdetails",
        component: () => import("@/modules/settings/views/BankDetails.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "favorites",
        name: "favorites",
        component: () => import("@/modules/products/views/Favorites.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "/profile/:userId",
        name: "profile",
        component: () => import("@/modules/profile/views/Profile.vue"),
        meta: {
          requires_auth: true,
        },
      },

      {
        path: "shop/:shopId",
        name: "shop",
        component: () => import("@/modules/shops/views/Shop.vue"),
      },
      {
        path: "shop/edit/:shopId",
        name: "editshop",
        component: () => import("@/modules/shops/views/EditShop.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "shop/add/:shopId",
        name: "addproduct",
        component: () => import("@/modules/products/views/AddProduct.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "product/edit/:productId",
        name: "editproduct",
        component: () => import("@/modules/products/views/EditProduct.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "checkout",
        name: "checkout",
        component: () => import("@/modules/checkout/views/Checkout.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "product/:productId",
        name: "productDetails",
        component: () => import("@/modules/products/views/ProductsDetails.vue"),
      },
      {
        path: "live/:roomId",
        name: "live",
        component: () => import("@/modules/live/views/AgoraVideo.vue"),
        // meta: {
        //   requires_auth: true,
        // },
      },
      {
        path: "createtokshow",
        name: "createtokshow",
        component: () => import("@/modules/live/views/CreateTokShow.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "myorders",
        name: "myorders",
        component: () => import("@/modules/orders/views/MyOrders.vue"),
      },
      {
        path: "categories/:categoryId",
        name: "categories",
        component: () => import("@/modules/categories/views/Categories.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("@/modules/signup/views/Login.vue"),
      },
      {
        path: "search/:keyword",
        name: "search",
        component: () => import("@/modules/search/search/Search.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/modules/settings/views/Settings.vue"),
        meta: {
          requires_auth: true,
        },
        children: [
          {
            name: "import-products",
            path: "import-products",
            component: () =>
              import("@/modules/settings/components/ImportProducts.vue"),
          },
          {
            name: "shipping-method",
            path: "shipping-method",
            component: () =>
              import("@/modules/settings/components/ShippingMethod.vue"),
          },
          {
            name: "shipping-address",
            path: "",
            component: () =>
              import("@/modules/settings/components/ShippingAddress.vue"),
          },
        ],
      },
      {
        path: "shop/new",
        name: "newshop",
        component: () => import("@/modules/shops/views/EditShop.vue"),
      },
      {
        path: "shop/edit/:shopId",
        name: "editshop",
        component: () => import("@/modules/shops/views/EditShop.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "myorders",
        name: "myorders",
        component: () => import("@/modules/orders/views/MyOrders.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "wallet",
        name: "wallet",
        component: () => import("@/modules/wallet/views/Wallet.vue"),
        meta: {
          requires_auth: true,
        },
      },
      {
        path: "categories/:categoryId",
        name: "categories",
        component: () => import("@/modules/categories/views/Categories.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("@/modules/signup/views/Login.vue"),
      },
      {
        path: "search/:keyword",
        name: "search",
        component: () => import("@/modules/search/search/Search.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/modules/settings/views/Settings.vue"),
        meta: {
          requires_auth: true,
        },
        children: [
          {
            name: "import-products",
            path: "import-products",
            component: () =>
              import("@/modules/settings/components/ImportProducts.vue"),
          },
          {
            path: "payout",
            name: "payout",
            component: () =>
              import("@/modules/settings/components/PayoutSettings.vue"),
          },
          {
            name: "shipping-method",
            path: "shipping-method",
            component: () =>
              import("@/modules/settings/components/ShippingMethod.vue"),
          },
          {
            name: "shipping-address",
            path: "",
            component: () =>
              import("@/modules/settings/components/ShippingAddress.vue"),
          },
        ],
      },
      {
        path: "",
        name: "landing",
        component: () => import("@/modules/landing/views/LandingPage.vue"),
      },
    ],
  },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia);
  const authUser = toRaw(authStore.authUser);

  if (to.meta.requires_auth && !authUser?._id) {
    return { name: "login" };
  }
  if (to.meta.requires_shop && authUser?.shopId == null) {
    return { name: "newshop" };
  }
});

router.afterEach((to) => {
  const authStore = useAuthStore(pinia);
  const authUser = toRaw(authStore.authUser);

  if (to.meta.requires_auth && !authUser?._id) {
    return { name: "login" };
  }
  if (to.meta.requires_shop && authUser?.shopId == null) {
    return { name: "newshop" };
  }
});

export default router;
