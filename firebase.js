// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOtCl3DEiVEAW6_Kp5twt7bO9tBTF0ryo",
    authDomain: "book-nest-bf867.firebaseapp.com",
    projectId: "book-nest-bf867",
    appId: "1:296960777462:web:dc8a2c1e63a8f01ab620d7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
