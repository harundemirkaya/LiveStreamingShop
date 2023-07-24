import {reactive, toRefs} from "vue";
import {useFetch} from "@/shared/composables/Fetch.js";


export const useShopShows = () => {
    const state = reactive({
        loading: true,
        events: [],
        futureEvents: []
    })


    const getAllLiveEvents = async (userId) => {
        state.loading = true
        const { data, status } = await useFetch(`/rooms/activetokshows?userid=${userId}`)

        if (status.value === 200)
            state.events = data.value.rooms

        state.loading = false
    }

    const getAllEvents = async (userId) => {
        state.loading = true
        const { data, status } = await useFetch(`/rooms/activetokshows?userid=${userId}&event=true`)

        if (status.value === 200)
            state.futureEvents= data.value.rooms

        state.loading = false
    }


    return {
        getAllLiveEvents,getAllEvents, ...toRefs(state)
    }
}