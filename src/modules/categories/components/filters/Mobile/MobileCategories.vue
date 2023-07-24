<template>
  <div
      class="flex lg:hidden flex-row gap-5 whitespace-nowrap overflow-x-auto mt-8 w-full  border-b-[1px] border-smoke pb-2">
    <spinner-v2 :load="state.loading" />

      <div v-for="cat in state.categories" class="flex" :key="cat._id">
        <div class="flex flex-col gap-2">
          <p
              @click="handleSelect({categoryId: cat._id})"
              :key="cat._id"
              :class="[filterStore.filters.categoryId === cat._id ? 'italic font-bold text-primary': 'font-normal']"
              class="cursor-pointer"
          >
            {{ cat.title }}
          </p>
          <div class="flex items-center gap-2">
            <div
                @click.stop=""
                :class="[filterStore.filters.interestId === interest._id ? 'bg-info': 'bg-primary']"
                v-for="interest in state.interests"
                v-if="cat._id === filterStore.filters.categoryId"
                :key="interest._id"
                @click="handleSelect({categoryId: cat._id, interestId: interest._id})"
                class="badge badge-md font-medium tracking-wide cursor-pointer"
            >
              {{ interest.name }}
            </div>
          </div>

        </div>
      </div>

  </div>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import useFetch from "@/shared/composables/Fetch.js";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import {useFilters} from "@/store/filters.js";


const props = defineProps(['selectedId'])
const emit = defineEmits(['select'])


const filterStore = useFilters()
const {setCatId, setInterestId} = filterStore

const state = reactive({
  categories: [],
  loading: false,
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

const handleInterestClick = (id) => {
  if(filterStore.filters.interestId === id) return setInterestId("")
  return setInterestId(id)
}


onMounted(async() => {
  state.loading = true
  const {data} = await useFetch(`/channels`)
  state.loading  = false
  state.categories = data.value
})


</script>
