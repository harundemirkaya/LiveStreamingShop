import {reactive, toRefs} from "vue";
import {useFilters} from "@/store/filters.js";
import {useSort} from "@/store/sort.js";
import {useFetch} from "@/shared/composables/Fetch.js";


export const useResults = () =>{
    const state = reactive({
        loading: false,
        products: [],
        errMsg: "",
        numberOfProducts: ""
    })
    const filterStore = useFilters()
    const sortStore = useSort()


    const populate = async () => {
        let startingSubstring = "/products/paginated/allproducts?page=1&limit=15&"
        let featuredSubstring = `featured=false&`
        let channelSubstring = `channel&`
        let titleSubString = 'title&'
        let priceSubstring = 'price&'
        let userIdSubstring = 'userid&'
        let interestSubstring = 'interest'

        if(sortStore.sort.value === "Featured")
            featuredSubstring = "featured=true&"

        if(filterStore.filters.categoryId && !filterStore.filters.interestId)
            channelSubstring = `channel=${filterStore.filters.categoryId}&`

        if(filterStore.filters.interestId){
            interestSubstring = `interest=${filterStore.filters.interestId}`
            channelSubstring = `channel&`
        }

        if(sortStore.sort.value === "Low")
            priceSubstring = 'price=Low&'

        if(sortStore.sort.value === "High")
            priceSubstring = 'price=High&'

        state.loading = true

        let url = startingSubstring + featuredSubstring + channelSubstring + titleSubString + priceSubstring
            + userIdSubstring + interestSubstring

        let {data} = await useFetch(url)
        let filteredData = runFilters(data.value.products)
        state.loading = false
        state.numberOfProducts = filteredData.length


        if(filteredData.length === 0){
            return state.errMsg = "No products available"
        }

        state.products = filteredData
        state.errMsg = ""
        return filteredData
    }

    const runFilters = (products) => {
        let filteredProducts = products
        if (filterStore.filters.minPrice && filterStore.filters.maxPrice)
            filteredProducts = products.filter(item => item.price > filterStore.filters.minPrice && item.price < filterStore.filters.maxPrice)

        if (filterStore.filters.maxPrice === undefined && filterStore.filters.minPrice)
            filteredProducts = products.filter(item => item.price > filterStore.filters.minPrice)

        return filteredProducts;
    }


    return {...toRefs(state), populate, runFilters}
}