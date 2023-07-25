<template>

  <form class="flex flex-col content-container py-10 lg:py-16 gap-12" @submit="handleSubmit">
    <p class="text-2xl text-primary font-semibold tracking-wide">
      Ürün Detaylarını Düzenle
    </p>

    <div class="flex flex-col md:flex-row justify-between w-full gap-8">
      <div class="form-control w-full">
        <label class="labels"> Ürün İsmi </label>
        <input
            v-model="product_name"
            class="inputs"
            required
            type="text"
        />
      </div>
      <div class="form-control w-full">
        <label class="labels"> Fiyat </label>
        <input
            v-model="price"
            class="inputs"
            min="1"
            placeholder="$"
            required
            type="number"
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-between w-full gap-8">
      <div class="form-control w-full">
        <label class="labels"> Varyantlar (Örn: Kırmızı, Mavi, Sarı)</label>
        <input
            v-model="variations"
            class="inputs"
            placeholder="Variations"
            required
            type="text"
        />
      </div>
      <div class="form-control w-full">
        <label class="labels"> Stok </label>
        <input
            v-model="quantity"
            class="inputs"
            min="1"
            placeholder="Quantity"
            required
            type="number"
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-between w-full gap-8">
      <div class="form-control w-full">
        <label class="labels"> Ürün Açıklaması </label>
        <textarea v-model="description" class="inputs"> </textarea>
      </div>
    </div>
    <div class="flex flex-col md:flex-row w-full items-center gap-8">
      <div class="form-control w-full">
        <label class="labels"> İndirimli Fiyat </label>
        <input
            v-model="discount"
            class="inputs"
            min="0"
            placeholder="% Discount"
            step=".01"
            type="number"
        />
      </div>
      <div class=" w-full"/>
    </div>

    <div class="flex flex-col md:flex-row w-full items-center gap-8">
      <div class="form-control w-full">
        <label class="labels">Kategori </label>
        <select class="inputs w-full" @change="handleSelectChange">
          <option disabled selected>Category</option>
          <option
              v-for="interest in interests"
              :key="interest._id"
              :value="interest._id"
          >
            {{ interest.name }}
          </option>
        </select>
      </div>
      <div class="flex w-full gap-4 items-center flex-wrap">
        <div v-for="interest in product_interests" class="badge badge-lg relative">
          {{ interest.name }}
          <svg
              aria-hidden="true"
              class="absolute -top-4 -right-4 h-6 w-6 text-red-500"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              @click="removeInterest(interest._id)">
            <path
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-linecap="round"
                stroke-linejoin="round">
            </path>
          </svg>
        </div>
      </div>
    </div>


    <div
        class="flex w-full lg:w-1/2 min-h-[200px] border-[0.1rem] border-primary rounded-lg
          self-start relative mt-8 p-4 gap-6 flex-wrap"
        @click="$refs.fileInput.click()"
    >
      <input
          id="file"
          ref="fileInput"
          accept="image/*"
          class="hidden"
          name="file"
          type="file"
          @change="onFileSelected($event.target.files[0])"
      />
      <p class="absolute -top-8 labels">Ürün Görselleri </p>
      <div
          class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-lg
           font-semibold tracking-wide text-primary bg-gray-200/40 p-2">
        <p v-if="!loading" class="">+ Görsel Yükle</p>
        <spinner-v2 :load="loading"/>
      </div>


      <div
          v-for="(img, idx) in images"
          class="relative bg-slate-200 p-1 h-20 w-20 flex items-center justify-center"
          @click.stop="">
        <img
            :src="img"
            alt="img"
            class="w-16 h-16"
        >
        <svg
            aria-hidden="true"
            class="w-4 h-4 absolute -top-0 -right-3"
            fill="none"
            stroke="#FF0000"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="removeImage(idx)">
          <path
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-linecap="round"
              stroke-linejoin="round">
          </path>
        </svg>
      </div>

    </div>

    <div class="flex w-full justify-end gap-6 items-center mt-10">
      <button v-if="!loading" class="primary-btn" type="submit">Güncelle</button>
      <spinner-v2 :load="loading"/>
    </div>
  </form>

</template>

<script setup>
import {onMounted} from "vue";
import {useStorageFile} from "vuefire";
import {imgsRef} from "@/shared/http/firebase-config.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import {useRoute} from "vue-router";
import {useAuthStore} from "@/store/auth.js";
import {useEditProduct} from "@/modules/products/composables/useEditProduct.js";



const authStore = useAuthStore()
const {url, upload} = useStorageFile(imgsRef)
const route = useRoute()



const {
  loading,
  removeInterest,
  getAllInterests,
  handleSelectChange,
  getProductById,
  onFileSelected,
  handleSubmit,
  variations,
  category,
  product_interests,
  product_name,
  discount,
  images,
  quantity,
  price,
  description,
  removeImage,
  interests
} = useEditProduct()


onMounted(() => {
  getProductById()
  getAllInterests()
})


const emits = defineEmits(["close"]);

</script>
