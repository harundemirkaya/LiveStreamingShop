

export const checkoutRoutes = [
    {
        path: "checkout",
        name: "checkout",
        component: () => import("@/modules/checkout/views/Checkout.vue"),
        meta: {
            requires_auth: true,
        },
    },
]