import {defineStore} from "pinia";
import {useFetch} from "@/shared/composables/Fetch.js";


export const useFavorite = defineStore('favorite', {
    state: () => ({
        productIds: []
    }),
    getters: {
        getAllProducts: async (state) => {
            const products = []
            for (const id of state.productIds) {
                const {data} = await useFetch(`/products/products/${id}`)
                products.push(data.value)
            }
            return products
        },
        isFavorite: state => id => state.productIds.findIndex(item => item === id)

    },
    actions: {
        addFavorite(productId) {
            this.productIds.push(productId)
        },
        removeFavorite(productId) {
            this.productIds = this.productIds.filter(item => item !== productId)
        }
    }, persist: true
})