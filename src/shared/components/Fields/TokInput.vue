<template>
  <div class="input-wrapper">
    <label
        :class="[state.errorMessage ? 'text-red bg-pink peer-focus:text-red peer-placeholder-shown:top-[25px] ' +
         'peer-focus:top-2 dark:bg-dark-blue dark:text-red dark:peer-focus:text-red dark:lg:bg-transparent': '']"
        :for="id" class="labels ">
      {{ label }}
    </label>
    <input
        :maxlength="maxLength"
        :disabled="disabled"
        :id="id"
        ref="refInput"
        v-model="inputVal"
        :class="[state.errorMessage ? 'bg-pink text-red border-red focus:border-red focus:border-red dark:bg-pink' +
         'focus:ring-0 dark:focus:border-red dark:border-2 dark:border-red dark:text-red dark:bg-pink': '']"
        :placeholder="placeholder"
        :type="type"
        class="inputs peer"
        @keypress="emit('keypress', $event)"
        @keyup="rulesChecker"
    />

  </div>


</template>

<script setup>
import {computed, reactive} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "text"
  },
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
  disabled: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: String,
    default: null
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
