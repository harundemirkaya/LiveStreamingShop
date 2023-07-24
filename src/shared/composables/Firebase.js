import { reactive, toRefs } from "vue";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { ref as storageRef } from "firebase/storage";

export function useFirebase() {
  const fireState = reactive({
    url: "",
  });

  const uploadToFirebase = async (file) => {
    const storage = useFirebaseStorage();
    const fileRef = storageRef(storage, `/images/${file.name}`);

    const { url, upload, metadata } = useStorageFile(fileRef);
    await upload(file);
    console.log(url);
    fireState.url = url;
    return url;
  };

  return { uploadToFirebase, ...toRefs(fireState) };
}
