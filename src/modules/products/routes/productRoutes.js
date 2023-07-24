export const productRoutes = [
  {
    path: "product/edit/:productId",
    name: "editproduct",
    component: () => import("@/modules/products/views/EditProduct.vue"),
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
    path: "shop/add/:shopId",
    name: "addproduct",
    component: () => import("@/modules/products/views/AddProduct.vue"),
    meta: {
      requires_auth: true,
    },
  },
  {
    path: "favorites",
    name: "favorites",
    component: () => import("@/modules/products/views/Favorites.vue"),
  },
];
