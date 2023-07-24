import {reactive, toRefs} from "vue";
import Swal from "sweetalert2";
import {useFetch} from "@/shared/composables/Fetch.js";
import {useRoute} from "vue-router";
import toBase64 from "@/shared/helpers/base64.js";
import {useFirebase} from "@/shared/composables/Firebase.js";


export const useEditProduct = () => {
    const route = useRoute()
    const productState = reactive({
        product_name: "",
        price: 0,
        category: "",
        discount: 0,
        images: [],
        variations: "",
        quantity: 0,
        description: "",
        selectedFiles: [],
        all_interests: [],
        loading: false,
        product_interests: [],
        interests: [],
    })


    const removeInterest = (id) => {
        productState.product_interests = productState.product_interests.filter(item => item._id !== id)
    }

    const handleSelectChange = (evt) => {
        let interestObject = productState.interests.find(item => item._id === evt.currentTarget.value)
        let found = productState.product_interests.findIndex(item => item._id === evt.currentTarget.value)
        if (found === -1)
            productState.product_interests.push(interestObject)
    }

    const getProductById = async () => {
        productState.loading = true
        const {data, status} = await useFetch(`/products/products/${route.params.productId}`)
        if (status.value === 200) {
            productState.product_name = data.value.name
            productState.price = data.value.price
            productState.product_interests = data.value.interest
            productState.discount = data.value.discountedPrice
            productState.images = data.value.images
            productState.variations = data.value.variations.join()
            productState.quantity = data.value.quantity
            productState.description = data.value.description
            productState.loading = false
        }
    }

    const removeImage = (idx) => {
        productState.images = productState.images.filter((img, index) => index !== idx)
    }

    const getAllInterests = async () => {
        productState.loading = true;
        const {data, status} = await useFetch(`/channels`)

        if (status.value === 200) {
            const interests = []
            for (let i = 0; i < data.value.length; i++) {
                for (let j = 0; j < data.value[i].interests.length; j++) {
                    interests.push(data.value[i].interests[j])
                }
                productState.interests = interests
            }

        }
        productState.category_list = data.value
        productState.loading = false
    }

    const onFileSelected = async (file) => {
        productState.loading = true
        productState.selectedFiles.push(file)
        const base64String = await toBase64(file)
        productState.images = [...productState.images, base64String]
        productState.loading = false
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        productState.loading = true

        if (productState.selectedFiles.length > 0) {
            for (let i = 0; i < productState.selectedFiles.length; i++) {
                const { uploadToFirebase } = useFirebase()
                console.log(productState.selectedFiles[i]);
                let str = await uploadToFirebase(productState.selectedFiles[i])
                productState.images = [...productState.images, str.value]
            }
        }

        // clean up base 64
        productState.images = productState.images.filter(img => img?.includes('https') && !img?.includes('data:image'))

        await useFetch(`/products/products/${route.params.productId}`, {
            method: 'PUT',
            data: {
                'name': productState.product_name,
                'price': productState.price,
                'interest': productState.product_interests,
                'discountedPrice': productState.discount,
                'description': productState.description,
                'quantity': productState.quantity,
                'variations': productState.variations,
                'images': productState.images
            }
        })

        Swal.fire({
            icon: "success"
        })
        productState.loading = false
    }

    return {
        handleSubmit,
        onFileSelected,
        getProductById,
        getAllInterests,
        handleSelectChange,
        removeInterest,
        removeImage,
        ...toRefs(productState)
    }
}