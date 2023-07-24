import {reactive, toRefs} from "vue";
import {useFavorite} from "@/store/favoriteStore.js";


export const useFavorites = () => {

    const favoriteStore = useFavorite()
    const favoriteState = reactive({
        favorites: [],
        loading: false
    })


    const getFavorites = async()=>{
        favoriteState.loading = true
        favoriteState.favorites = await favoriteStore.getAllProducts
        favoriteState.loading = false

    }

    return {getFavorites, ...toRefs(favoriteState)}
}