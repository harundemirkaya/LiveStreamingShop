<template>
  <div class="input-wrapper">
    <label
        :class="[state.errorMessage ? 'text-red bg-pink peer-focus:text-red peer-placeholder-shown:top-[25px] ' +
         'peer-focus:top-2 dark:bg-dark-blue dark:text-red dark:peer-focus:text-red dark:lg:bg-transparent': '']"
        :for="id" class="labels ">
      {{ label }}
    </label>
    <select v-model="inputVal"  class="inputs">
      <option
          v-for="(opt, index) in options"
          :key="index" :value="opt[valueKey] || opt">{{opt[displayKey] || opt}}
      </option>
    </select>
  </div>
</template>

<script setup>
import {computed, reactive} from "vue";

const props = defineProps({
  label: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String
  },
  rules: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false
  },
  modelValue: {
    default: null
  },
  id: {
    type: String,
    default: ""
  },
  options: {
    type: Array,
    default: () => [],
  },
  valueKey: {
    type: String,

  },
  displayKey: {
    type: String,

  }
})

const emit = defineEmits(["input", "keypress", "update:modelValue"])
const state = reactive({
  errorMessage: null
})


const inputVal = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    if (props.required && props.rules.length === 0) {
      val ? (state.errorMessage = false) : (state.errorMessage = "Required")
    }
    emit('update:modelValue', val)
  }

})

const rulesChecker = () => {
  if (props.rules && props.rules.length > 0) {
    for (let i = 0; i < props.rules.length; i++) {
      if (props.rules[i](inputVal.value) !== true) {
        state.errorMessage = props.rules[i](inputVal.value)
        return;
      } else {
        state.errorMessage = null
      }
    }
  }
}


</script>
