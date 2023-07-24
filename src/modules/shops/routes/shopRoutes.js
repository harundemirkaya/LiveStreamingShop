export const shopRoutes = [
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
    path: "shop/new",
    name: "newshop",
    component: () => import("@/modules/shops/views/EditShop.vue"),
    meta: {
      requires_auth: true,
    },
  },
];
