export const searchRoutes = [
    {
        path: "search/:keyword",
        name: "search",
        component: () => import("@/modules/search/search/Search.vue"),
    },
]