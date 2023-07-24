import { addDoc, collection, updateDoc, doc, setDoc } from "firebase/firestore";
import { fireStore } from "@/shared/http/firebase-config.js";

export const useSendMsg = () => {
  const sendMsg = ({ path, data }) => addDoc(collection(fireStore, path), data);
  const updateMsg = ({ path, data }) => updateDoc(doc(fireStore, path), data);
  const addInbox = ({ path, data }) => setDoc(doc(fireStore, path), data);

  return { sendMsg, updateMsg, addInbox };
};
