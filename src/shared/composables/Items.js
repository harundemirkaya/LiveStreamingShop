import {reactive, toRefs} from "vue";
import useFetch from "./Fetch"

export function useItems() {
    const itemsData = reactive({
        loading: false,
        items: [],
        status: "",
        error: "",
        item: {},
        links: {
            next: '',
            prev: ''
        }
    })

    const getItems = async (url) => {
        itemsData.loading = true
        const {data, status, error} = await useFetch(url)
        itemsData.loading = false
        itemsData.items = data
        itemsData.status = status
        itemsData.error = error
    }

    const addItem = async (url, obj) => {
        itemsData.loading = true
        const {data} = await useFetch(url, {
            method: "POST",
            data: obj
        })
        itemsData.loading = false
        itemsData.item = data
    }

    return {getItems,addItem, ...toRefs(itemsData)}

}