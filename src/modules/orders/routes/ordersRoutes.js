export const ordersRoutes = [
  {
    path: "myorders",
    name: "myorders",
    component: () => import("@/modules/orders/views/MyOrders.vue"),
    meta: {
      requires_auth: true,
    },
  },
];