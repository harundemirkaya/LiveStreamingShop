<template>
  <div class="flex flex-col gap-3 py-8 lg:pt-2">

    <div class="flex flex-col gap-3">
      <spinner-v2 :load="state.loading" />
      <div
          v-for="cat in state.categories"
          :key="cat.id"
          @click="handleSelect({categoryId: cat._id})"
          class="text-primary text-[16px] font-medium cursor-pointer flex flex-col gap-2"
      >
        <p :class="[filterStore.filters.categoryId === cat._id ? 'underline': '']">{{ cat.title }}</p>
        <div
            @click.stop=""
            :class="[filterStore.filters.interestId === interest._id ? 'bg-info': 'bg-primary']"
            v-for="interest in state.interests"
            v-if="filterStore.filters.categoryId === cat._id"
            :key="interest.name"
            @click="handleSelect({categoryId: cat._id, interestId: interest._id})"
            class="badge badge-md font-medium tracking-wide cursor-pointer ml-4 no-underline"
        >
          {{ interest.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useFilters} from "@/store/filters.js";
import {onMounted, reactive} from "vue";
import useFetch from "@/shared/composables/Fetch.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";

const filterStore = useFilters()
const {setCatId, setInterestId} = filterStore


const state = reactive({
  categories: [],
  loading: true,
  interests: [],
})

const handleSelect = ({categoryId, interestId = ""}) => {
  setCatId(categoryId)

  if(interestId === filterStore.filters.interestId){
    setInterestId("")
  }else{
    setInterestId(interestId)
  }

  let found = state.categories.find(item => item._id === categoryId)
  state.interests = found.interests
}



onMounted(async () => {
  state.loading = true
  const {data} = await useFetch(`/channels`)
  state.loading = false
  state.categories = data.value
})

</script>

