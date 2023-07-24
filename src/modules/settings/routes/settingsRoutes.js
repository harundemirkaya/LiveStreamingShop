export const settingsRoutes = [
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
];
