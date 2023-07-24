export const categoriesRoutes= [
    {
        path: "categories/:categoryId",
        name: "categories",
        component: () => import("@/modules/categories/views/Categories.vue"),
    },
]