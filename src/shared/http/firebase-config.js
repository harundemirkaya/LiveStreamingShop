import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import { getFirestore } from 'firebase/firestore'
import { ref as storageRef } from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyDIBOqYj9HbLlcDbTqz597eSG9I81GmTG4",
    authDomain: "tokshop-33509.firebaseapp.com",
    projectId: "tokshop-33509",
    storageBucket: "tokshop-33509.appspot.com",
    messagingSenderId: "65319097700",
    appId: "1:65319097700:web:381829cf95f8ac35f69671"
  };


export const firebaseApp = initializeApp(firebaseConfig)

export const db = getStorage(firebaseApp)
export const fireStore = getFirestore(firebaseApp)

export const imgsRef = storageRef(db, 'images')