<template>
  <div class="flex flex-col gap-8 w-full items-center py-16">
    <h3 class="text-xl text-primary font-medium text-center">
      Get started on BeeRelation TV
    </h3>
    <v-facebook-login
      :app-id="$APP_ID"
      class="primary-btn bg-[#4167b2] flex gap-2 md:gap-4 fb items-center lg:w-1/4 justify-center md:tracking-wide md:font-semibold md:text-sm"
      @login="handleLogin"
      v-if="!state.loading"
    ></v-facebook-login>

    <vue-apple-login
      v-if="!state.loading"
      mode="center-align"
      type="sign in"
      color="black"
      :border="true"
      :radius="100"
      width="100%"
      height="50%"
      logoSize="medium"
      :logoPosition="0"
      :labelPosition="0"
      className="vue-apple-login"
      :onSuccess="callSuccess"
      :onFailure="callFail"
    ></vue-apple-login>

    <button
      class="primary-btn flex gap-4 bg-white items-center lg:w-1/4 justify-center md:tracking-wide md:font-semibold md:text-lg"
    >
      <GoogleSignInButton
        v-if="!state.loading"
        text="Continue with Google"
        @error="handleLoginError"
        @success="handleLoginSuccess"
      />
    </button>
    <spinner-v2 :load="state.loading" />

    <hr />

    <div class="flex flex-col gap-6 mt-6" v-if="!state.loading">
      <p class="text-center">
        By continuing, you agree to our terms of use and privacy policy.
      </p>
    </div>
  </div>
</template>

<script setup>
import { decodeCredential, GoogleSignInButton } from "vue3-google-signin";
import { useAuthStore } from "@/store/auth";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import SpinnerV2 from "@/shared/components/Spinner/SpinnerV2.vue";
import VFacebookLogin from "vue-facebook-login-component-next";
import { useFetch } from "@/shared/composables/Fetch";

const state = reactive({
  loading: false,
});

const authStore = useAuthStore();
const { saveToken, saveUser } = authStore;
const router = useRouter();

const callSuccess = async (data) => {
  state.loading = true;
  var nameMatch = data.userData.email.match(/^([^@]*)@/);
  var name = nameMatch ? nameMatch[1] : null;
  let payload = {
    email: data.userData.email,
    firstName: name,
    lastName: "",
    type: "apple",
    profilePhoto: "",
    userName: name,
  };
  let { data: response } = await useFetch("authenticate/social/mobileapp", {
    data: payload,
    method: "POST",
  });
  if (response.value.success === true) {
    saveToken(response.value.accessToken);
    saveUser(response.value.data);
    localStorage.setItem("token", response.value.accessToken);
    localStorage.setItem("userid", response.value.data._id);
    router.back();
  }

  router.back();
  state.loading = false;
};

const handleLogin = async (r) => {
  state.loading = true;
  let url = `https://graph.facebook.com/v2.12/me?fields=name,first_name,last_name,email,picture&access_token=${r.authResponse.accessToken}`;
  let { data } = await useFetch(url);
  let payload = {
    email: data.value.email,
    firstName: data.value.first_name,
    lastName: data.value.last_name,
    type: "facebook",
    profilePhoto: data.value.picture.data.url,
    userName: data.value.first_name,
  };
  let { data: response } = await useFetch("authenticate/social/mobileapp", {
    data: payload,
    method: "POST",
  });

  if (response.value.success === true) {
    saveToken(response.value.accessToken);
    saveUser(response.value.data);
    localStorage.setItem("token", response.value.accessToken);
    localStorage.setItem("userid", response.value.data._id);
    router.back();
  }
  state.loading = false;
};

// handle success event
const handleLoginSuccess = async (userData) => {
  state.loading = true;
  const { credential } = userData;
  const user = decodeCredential(credential);

  const payload = {
    firstName: user.family_name,
    profilePhoto: user.picture,
    userName: user.name,
    email: user.email,
    type: "google",
  };
  let { data: response } = await useFetch("authenticate/social/mobileapp", {
    data: payload,
    method: "POST",
  });
  if (response.value.success === true) {
    saveToken(response.value.accessToken);
    saveUser(response.value.data);
    localStorage.setItem("token", response.value.accessToken);
    localStorage.setItem("userid", response.value.data._id);
    router.back();
  }
  state.loading = false;
};

// handle an error event
const handleLoginError = () => {
  Swal.fire({
    icon: "error",
    text: "Login failed please try again",
  });
};
</script>

<style>
.fb {
  background: #4167b2;
}
</style>
