import {ref, shallowRef} from "vue";
import $axios from "@/shared/http/Axios.js";


export default async function (url, config = {}, $axiosInstance = $axios) {
    const response = shallowRef()
    const status = ref(0)
    // data object which is a child of the response
    const data = shallowRef()
    // higher level error object
    const error = shallowRef()
    // error from response
    const responseError = shallowRef(null)
    // loading state var
    const isLoading = ref(true)
    // indicates process is done
    const isFinished = ref(false)

    try {
        status.value = 0;
        const result = await $axiosInstance.request({
            url,
            ...config
        })
        response.value = result
        status.value = result.status
        data.value = result.data
    } catch (e) {
        error.value = e;
        responseError.value = e.response?.data;
        status.value = e.response?.status
    } finally {
        isLoading.value = false
        isFinished.value = true
    }

    return {
        response,
        data,
        error,
        responseError,
        status,
        isLoading,
        loading: isLoading,
        finished: isFinished
    }

}

export const useFetch = async(url, config = {}, $axiosInstance = $axios)=>{
    const response = shallowRef()
    const status = ref(0)
    // data object which is a child of the response
    const data = shallowRef()
    // higher level error object
    const error = shallowRef()
    // error from response
    const responseError = shallowRef(null)
    // loading state var
    const isLoading = ref(true)
    // indicates process is done
    const isFinished = ref(false)

    try {
        status.value = 0;
        const result = await $axiosInstance.request({
            url,
            ...config
        })
        response.value = result
        status.value = result.status
        data.value = result.data
    } catch (e) {
        error.value = e;
        responseError.value = e.response?.data;
        status.value = e.response?.status
    } finally {
        isLoading.value = false
        isFinished.value = true
    }

    return {
        response,
        data,
        error,
        responseError,
        status,
        isLoading,
        loading: isLoading,
        finished: isFinished
    }
}