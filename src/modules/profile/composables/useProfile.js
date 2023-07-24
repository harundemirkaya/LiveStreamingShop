import { reactive, toRefs } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { useFetch } from "@/shared/composables/Fetch.js";
import toBase64 from "@/shared/helpers/base64.js";
import { useFirebase } from "@/shared/composables/Firebase.js";

export const useProfile = () => {
  const authStore = useAuthStore();

  const profileState = reactive({
    profilePhoto: "",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    loading: false,
    selectedFile: null,
  });

  const getUser = async ({ userId = authStore.authUser?._id }) => {
    console.log(userId);
    const { data, status } = await useFetch(`/users/${userId}`);
    console.log(data);
    if (status.value === 200) {
      const userObj = data.value;
      console.log(userObj);
      profileState.profilePhoto = authStore.authUser.profilePhoto;
      profileState.userName = authStore.authUser.userName;
      profileState.firstName = authStore.authUser.firstName;
      profileState.lastName = authStore.authUser.lastName;
      profileState.email = authStore.authUser.email;
      profileState.bio = authStore.authUser.bio;
    }

    // profileState.profilePhoto = authStore.authUser.profilePhoto;
    // profileState.userName = authStore.authUser.userName;
    // profileState.firstName = authStore.authUser.firstName;
    // profileState.lastName = authStore.authUser.lastName;
    // profileState.email = authStore.authUser.email;
    // profileState.bio = authStore.authUser.bio;
  };

  const uploadProfilePhoto = async (file) => {
    profileState.selectedFile = file;
    profileState.profilePhoto = await toBase64(file);
  };

  const updateUser = async (userId) => {
    if (profileState.selectedFile) {
      const { url, uploadToFirebase } = useFirebase();
      await uploadToFirebase(profileState.selectedFile);
      profileState.profilePhoto = url;
    }

    await useFetch(`/users/${userId}`, {
      method: "PUT",
      data: {
        profilePhoto: profileState.profilePhoto,
        userName: profileState.userName,
        firstName: profileState.firstName,
        lastName: profileState.lastName,
        bio: profileState.bio,
      },
    });
    await authStore.getUser();
    await getUser({ userId });
  };

  return {
    getUser,
    uploadProfilePhoto,
    profileState,
    updateUser,
    ...toRefs(profileState),
  };
};
