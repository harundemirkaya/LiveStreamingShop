import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "@/shared/routes/routes";
import Axios from "axios";
import GoogleSignInPlugin from "vue3-google-signin";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "@/shared/http/firebase-config.js";
import store from "@/store/store.js";
import TokInput from "@/shared/components/Fields/TokInput.vue";
import TokSelect from "@/shared/components/Fields/TokSelect.vue";
import TokTextArea from "@/shared/components/Fields/TokTextArea.vue";
import TokPhoneInput from "@/shared/components/Fields/TokPhoneInput.vue";
import TokDatePicker from "@/shared/components/Fields/TokDatePicker.vue";
import VueAppleLogin from "vue-apple-login";

const app = createApp(App);
app.config.globalProperties.$APP_ID = `${import.meta.env.VITE_API_APP_ID}`;

Axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}`;
const token = localStorage.getItem("token");
Axios.defaults.headers.Authorization = token ? `Bearer ${token}` : "";

app.use(GoogleSignInPlugin, {
  clientId: `${import.meta.env.VITE_API_GOOGLE_CLIENT_ID}`,
});

app
  .use(store)
  .use(router)
  .use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
  .use(VueAppleLogin, {
    clientId: "site.tokshopping.live",
    scope: "name email",
    redirectURI: "https://site.tokshopping.live",
    state: Date.now().toString(),
    usePopup: true,
  })
  .component("tok-input", TokInput)
  .component("tok-select", TokSelect)
  .component("tok-text-area", TokTextArea)
  .component("tok-phone-input", TokPhoneInput)
  .component("tok-date-picker", TokDatePicker)
  .component("easy-data-table", Vue3EasyDataTable);

router.isReady().then(() => {
  app.mount("#app");
});
