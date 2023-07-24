export const authRoutes = [
    {
        path: "login",
        name: "login",
        component: () => import("@/modules/signup/views/Login.vue"),
    },
]