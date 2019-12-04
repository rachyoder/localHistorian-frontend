import Firebase from "firebase/app";
import "firebase/storage";

/* Holds the Firebase Configuration */
const firebaseConfig = {
    apiKey: "AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k",
    authDomain: "local-historian.firebaseapp.com",
    databaseURL: "https://local-historian.firebaseio.com",
    projectId: "local-historian",
    storageBucket: "local-historian.appspot.com",
    messagingSenderId: "228483228657",
    appId: "1:228483228657:web:3a7bb10d55f626b5cf1a50",
    measurementId: "G-EDNBYZGSW0"
};

Firebase.initializeApp(firebaseConfig);


const Storage = Firebase.storage();

export { Firebase, Storage as default };