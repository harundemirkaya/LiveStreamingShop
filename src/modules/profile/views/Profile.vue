<template>
  <div class="flex flex-col gap-8 justify-between w-full content-container pt-16 pb-12">

    <div class="flex w-full items-center gap-12">
      <!-- PROFILE PHOTO
        <div class="flex flex-col gap-4">
        <input
            ref="fileInput"
            style="display: none"
            type="file"
            @change="onFileSelected"
        />
        <div
            :style="{backgroundImage: `url(${profilePhoto || '/imgs/profile.svg'})`}"
            class="flex w-24 h-24 lg:w-60 lg:h-60  rounded-full relative
              bg-gray-300 bg-center bg-no-repeat bg-contain shadow-2xl "
            @click="isOwner && $refs.fileInput.click()"
        >
          <spinner-v2 :load="state.loading"/>
          <div
              class="w-7 h-7 rounded-full bg-info absolute bottom-[10%] right-[0%] lg:right-[5%] z-10 flex justify-center items-center">
            <svg
                aria-hidden="true"
                class="w-4 h-4 cursor-pointer" fill="#FF7643" stroke="#ffffff" stroke-width="1.5"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
      </div>
      -->

      <div class="flex flex-col  gap-1">
        <p class="h3 font-medium"> Profili Düzenle </p>
      </div>
    </div>
    <!--    names-->
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center w-full">
      <tok-input :disabled="!isOwner" id="userName" v-model="userName" label="Kullanıcı Adı" placeholder=" "/>
      <tok-input :disabled="!isOwner" id="email" v-model="email" :type="email" label="Email" placeholder=" "/>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center w-full">
      <tok-input :disabled="!isOwner" id="firstName" v-model="firstName" label="Ad" placeholder=" "/>
      <tok-input :disabled="!isOwner" id="lastName" v-model="lastName" label="Soyad" placeholder=" "/>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center w-full">
      <tok-text-area  :disabled="!isOwner" id="bio" v-model="bio" label="Biyografi" placeholder=" "/>
    </div>

    <spinner-v2 v-if="state.loading" :load="state.loading"/>

    <button v-if="isOwner && !state.loading" class="primary-btn w-44 self-center" @click="handleSave">Kaydet</button>

  </div>
</template>

<script setup>
import {useAuthStore} from "@/store/auth.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useProfile} from "@/modules/profile/composables/useProfile.js";
import {useRoute} from "vue-router";


const authStore = useAuthStore()
const {
  url,
  firstName,
  lastName,
  userName,
  profilePhoto,
  bio,
  email,
  uploadProfilePhoto,
  getUser,
  updateUser,
} = useProfile()

const state = reactive({
  loading: false
})
const route = useRoute()


const fileInput = ref()
const onFileSelected = (evt) => {
  uploadProfilePhoto(evt.target.files[0])
}

const isOwner = computed(()=>authStore.authUser?._id === route.params.userId)


const handleSave = async () => {
  state.loading = true
  await updateUser(authStore.authUser?._id)
  state.loading = false
}


onMounted(() => {
  getUser({userId: route.params.userId})
})

watch(url, value => {
  if (value){
    profilePhoto.value = value
    state.loading = false
  }
})


</script>