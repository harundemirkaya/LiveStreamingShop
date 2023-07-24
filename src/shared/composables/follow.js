import useFetch from "@/shared/composables/Fetch.js";
import {useAuthStore} from "@/store/auth.js";
import {useRouter} from "vue-router";
import {ref} from "vue";


export function useFollow() {
    const authStore = useAuthStore()
    const router = useRouter()
    const loading = ref(false)


    const checkFollowing = ({followedId}) => {
        loading.value = true;

        let user = authStore.authUser
        loading.value = false;

        if (!user)
            return false

        let found = user?.following?.findIndex(item => item._id === followedId)

        if (found === -1)
            return false
        if (found > -1)
            return true
    }


    const follow = async ({followedId}) => {
        if (!authStore.authUser._id)
            return router.push("/login")

        loading.value = true;
        let found = checkFollowing({followedId})

        await useFetch(
            `/users/${found ? 'unfollow' : 'follow'}/${authStore.authUser._id}/${followedId}`,
            {
                'method': 'PUT'
            })

        await authStore.getUser()
        loading.value = false

    }

    return {follow, loading, checkFollowing}
}