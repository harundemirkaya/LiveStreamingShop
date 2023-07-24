import {reactive, toRefs} from "vue";

import {useFirebase} from "@/shared/composables/Firebase.js";
import {useFetch} from "@/shared/composables/Fetch.js";
import {useAuthStore} from "@/store/auth.js";
import toBase64 from "@/shared/helpers/base64.js";

export const useEditShop = () => {

    const authStore = useAuthStore();
    const shopState = reactive({
        name: "",
        shopStatus: false,
        description: "",
        selectedFile: null,
        avatar: "",
        loading: false,
    })

    const onFileSelected = async(file) => {
        shopState.loading = true;
        shopState.selectedFile = file;
        const base64String = await toBase64(file)
        shopState.avatar = base64String
        shopState.loading = false
    };


    const getShop = async () => {
        shopState.loading = true;
        const {data} = await useFetch(
            `/shop/shop/${authStore.authUser?.shopId?._id}`
        );

        shopState.name = data.value.name;
        shopState.description = data.value.description;
        shopState.shopStatus = data.value.open;
        shopState.avatar = data.value.image;
        shopState.loading = false
    };

    const editShop = async () => {
        shopState.loading = true;
        if(shopState.selectedFile){
            const {uploadToFirebase, url} = useFirebase()
            await uploadToFirebase(shopState.selectedFile)
            shopState.avatar = url
        }



        if (authStore.authUser?.shopId) {
            await useFetch(
                `/shop/shop/${authStore.authUser?.shopId?._id}`,
                {
                    method: "PUT",
                    data: {
                        "name": shopState.name,
                        "open": shopState.shopStatus,
                        "description": shopState.description,
                        "image": shopState.avatar,
                    },
                }
            );
        } else {
            let shopdata = {
                name: shopState.name,
                open: shopState.shopStatus,
                description: shopState.description,
                image: shopState.avatar,
                first_name: authStore.authUser?.firstName,
                last_name: authStore.authUser?.lastName,
                email: authStore.authUser?.email,
            };
             await useFetch(
                `/shop/${authStore.authUser?._id}`,
                {
                    method: "POST",
                    data: shopdata,
                }
            );
        }
        await authStore.getUser();
        shopState.loading = false;
    }


    return {
        onFileSelected,
        getShop,
        editShop,
        ...toRefs(shopState)
    }
}