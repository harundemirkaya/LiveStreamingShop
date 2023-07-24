import {reactive, toRefs} from "vue";
import {useFetch} from "@/shared/composables/Fetch.js";


export const useAuctionTab = () =>{
    const state = reactive({
        auctions: [],
        loading: false
    })

    const getAllAuctions = async(roomId)=>{
        state.loading = true
        const {data} = await useFetch(`auction/all/${roomId}`)
        state.auctions = data.value
        state.loading = false
    }

    return {
        ...toRefs(state), getAllAuctions
    }

}