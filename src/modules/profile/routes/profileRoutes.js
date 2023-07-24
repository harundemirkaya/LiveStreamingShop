
export const profileRoutes = [
    {
        path: "/profile/:userId",
        name: "profile",
        component: () => import("@/modules/profile/views/Profile.vue"),
        meta: {
            requires_auth: true,
        },
    },
]