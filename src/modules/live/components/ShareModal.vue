<template>
  <div class="fixed inset-0 w-screen h-screen self-center bg-black/80 px-4 items-center z-50">
    <div class="flex flex-col w-11/12 mx-auto max-w-md min-h-[20vh]  gap-6 mt-14 bg-white p-4 rounded-lg relative">
      <svg
          aria-hidden="true"
          class="absolute top-4 right-4 w-8"
          fill="#ffffff"
          stroke="#ff0000"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          @click="emit('close')"
      >
        <path
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></path>
      </svg>


      <div class="flex w-full gap-5 items-center  mt-10">
        <a class=""
           :href="facebookUrl" target="_blank">
          <svg class="text-blue-600 w-8" fill="currentColor" viewBox="0 0 16 16"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
          </svg>
        </a>
        <a :href="instaUrl" rel="noopener" target="_blank">
          <svg class="text-pink-500 w-8" fill="currentColor" viewBox="0 0 16 16"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
          </svg>
        </a>
        <a :href="whatsappUrl"  data-action="share/whatsapp/share"
           target="_blank">
          <img src="/imgs/whatsapp.svg" alt="" class="w-8">
        </a>
      </div>

      <p class="subtitle1 font-semibold mt-6">Copy Link</p>
      <div @click="handleCopy" class="flex w-full gap-8 items-center">
        <div id="urlDiv" class="w-10/12 overflow-x-scroll px-2  border-[1px] border-slate-400 cursor-pointer items-center shadow-lg font-semibold text-xs
         pt-4 rounded-md">{{ absoluteURL }}
        </div>
        <svg
            :stroke="state.isCopied ? '#00FF00' : '#000000'"
            aria-hidden="true"
            class="w-10" fill="none" stroke-width="1"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            @click="handleCopy">
          <path
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
        </svg>
      </div>

    </div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {reactive} from "vue";

const emit = defineEmits(["close"]);
const props = defineProps(['whatsappUrl', 'facebookUrl', 'instaUrl',  'absoluteUrl' ])
const route = useRoute()
const absoluteURL = new URL(route.fullPath, window.location.origin).href;
const state = reactive({
  isCopied: false,
  whatsAppText: `whatsapp://send?text=Here's the link to the TokShow ${absoluteURL}`
})


const handleCopy = () => {
  state.isCopied = false

  const range = document.createRange()
  range.selectNode(document.getElementById("urlDiv"))
  window.getSelection().removeAllRanges()
  window.getSelection().addRange(range)
  document.execCommand("copy")
  window.getSelection().removeAllRanges()
  state.isCopied = true
}


</script>