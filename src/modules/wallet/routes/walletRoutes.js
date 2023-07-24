export const walletRoutes = [
    {
        path: "wallet",
        name: "wallet",
        component: () => import("@/modules/wallet/views/Wallet.vue"),
        meta: {
            requires_auth: true,
        },
    },
]