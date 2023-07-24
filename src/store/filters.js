import {defineStore} from "pinia";

export const useFilters = defineStore('filters-state', {
    state: () => ({
        filters: {
            categoryId: "",
            interestId: "",
            minPrice: "",
            maxPrice: "",
            sale: "",
            results: 0
        }
    }),
    getters:{
        minPrice: state => state.filters.minPrice,
        categoryId: state => state.filters.categoryId,
    },
    actions: {
        setPrice({min, max}) {
            this.filters = {...this.filters, minPrice: min, maxPrice: max}
        },
        setCatId(id) {
            this.filters = {...this.filters, categoryId: id}
        },
        setInterestId(id) {
            this.filters = {...this.filters, interestId: id}
        },
        setResults(number) {
            this.filters = {...this.filters, results: number}
        }
    }, persist: true
})