import {reactive, toRefs} from "vue";
import Swal from "sweetalert2";
import {useFetch} from "@/shared/composables/Fetch.js";
import toBase64 from "@/shared/helpers/base64.js";
import {useFirebase} from "@/shared/composables/Firebase.js";
import {useRoute} from "vue-router";
import {useAuthStore} from "@/store/auth.js";


export const useAddProduct = () => {
    const route = useRoute()
    const authStore = useAuthStore()
    const state = reactive({
        product_name: "",
        price: "",
        category: "",
        discount: "",
        images: [],
        variations: "",
        quantity: "",
        description: "",
        selectedFiles: [],
        interests: [],
        loading: false,
        product_interests: [],
        key: 0
    })

    const removeInterest = (id) => {
        state.product_interests = state.product_interests.filter(item => item._id !== id)
    }

    const handleSelectChange = (evt) => {
        let interestObject = state.interests.find(item => item._id === evt.currentTarget.value)
        let found = state.product_interests.findIndex(item => item._id === evt.currentTarget.value)
        if (found === -1)
            state.product_interests.push(interestObject)
    }

    const removeImage = (idx) => {
        state.images = state.images.filter((img, index) => index !== idx)
    }

    const fetchCategory = async () => {
        state.loading = true;
        const {data, status} = await useFetch(`/channels`)

        if (status.value === 200) {
            const interests = []
            for (let i = 0; i < data.value.length; i++) {
                for (let j = 0; j < data.value[i].interests.length; j++) {
                    interests.push(data.value[i].interests[j])
                }
                state.interests = interests
            }
        }
        state.loading = false
    }

    const onFileSelected = async (file) => {
        state.loading = true
        state.selectedFiles.push(file)
        const base64String = await toBase64(file)
        state.images = [...state.images, base64String]
        state.loading = false
    }

    const handleSubmit = async (evt) => {
        state.loading = true

        evt.preventDefault()

        state.images = []
        for (let i = 0; i < state.selectedFiles.length; i++) {
            const { uploadToFirebase} = useFirebase()
            let str = await uploadToFirebase(state.selectedFiles[i])
            state.images = [...state.images, str.value]
        }

        await useFetch(`/products/${route.params.shopId}`, {
            method: 'POST',
            data: {
                'name': state.product_name,
                'price': state.price,
                'interest': state.product_interests,
                'discountedPrice': state.discount,
                'ownerId': authStore.authUser._id,
                'description': state.description,
                'quantity': state.quantity,
                'variations': state.variations,
                'images': state.images
            }
        })
        Swal.fire({
            icon: "success"
        }).then(() => {
            state.product_interests = []
            state.product_name = "";
            state.price = "";
            state.category = "";
            state.discount = "";
            state.images = [];
            state.variations = "";
            state.quantity = "";
            state.description = "";
            state.selectedFile = null;
            state.interests = [];
            state.loading = false;
        })

        state.loading = false
    }

    return {
        ...toRefs(state),
        fetchCategory,
        handleSubmit,
        handleSelectChange,
        onFileSelected,
        removeImage,
        removeInterest,
    }


}