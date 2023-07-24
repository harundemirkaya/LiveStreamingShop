import {defineStore} from "pinia";


export const useSort = defineStore('sort', {
    state: () => ({
        sort: {
            name: "",
            value: ""
        }
    }),
    getters: {
        sortValue: (state) => state.sort.value,
        sortName: state=> state.sort.name
    },
    actions: {
        addSort(value){
            this.sort = value
        }
    },
    persist: true
})