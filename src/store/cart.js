import { defineStore } from "pinia";

export const useCart = defineStore("tok-cart", {
  state: () => ({
    products: [],
    shipping: null,
    shippingMethods: [],
  }),
  getters: {
    total: (state) => {
      let sum = 0;
      for (let i = 0; i < state.products.length; i++) {
        sum += state.products[i].qty * state.products[i].price;
      }
      return sum;
    },
    getCartItemById: (state) => (productId) =>
      state.products.find((item) => item._id === productId),
  },
  actions: {
    setShipping(shipping) {
      this.shipping = shipping;
    },
    setShippingMethods(shippings) {
      this.shippingMethods = shippings;
    },
    addToCart(item, qty = 1) {
      let myItem = {
        _id: item._id,
        name: item.name,
        description: item.description,
        qty: qty,
        price: item.discountedPrice > 0 ? item.discountedPrice : item.price,
        image: item.images[0],
        item: item,
      };
      // check if item is in cart
      let inCart = this.products.findIndex(
        (product) => product._id === item._id
      );
      if (inCart === -1) {
        // return this.products.push(myItem)
        return (this.products = [myItem]);
      } else {
        return (this.products = this.products.map((item, idx) =>
          idx === inCart
            ? {
                ...item,
                qty: item.qty + qty,
              }
            : item
        ));
      }
    },
    decrementCart(itemId) {
      let inCart = this.products.findIndex((product) => product._id === itemId);
      if (inCart === -1) return;
      else {
        return (this.products = this.products.map((item, idx) =>
          idx === inCart
            ? {
                ...item,
                qty: item.qty === 1 ? item.qty : --item.qty,
              }
            : item
        ));
      }
    },
    incrementCart(itemId, qty = 1) {
      let inCart = this.products.findIndex((product) => product._id === itemId);
      if (inCart === -1) return;
      else {
        return (this.products = this.products.map((item, idx) =>
          idx === inCart
            ? {
                ...item,
                qty: item.qty + qty,
              }
            : item
        ));
      }
    },
    removeFromCart(itemId) {
      this.shipping = { amount: 0 };
      let inCart = this.products.findIndex((product) => product._id === itemId);
      if (inCart === -1) return;
      else
        return (this.products = this.products.filter(
          (product) => product._id !== itemId
        ));
    },
  },
  persist: true,
});
