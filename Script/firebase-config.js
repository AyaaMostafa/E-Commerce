// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
 
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "ecommerce-196.firebaseapp.com",
    projectId: "ecommerce-196",
    storageBucket: "ecommerce-196.appspot.com",
    messagingSenderId: "1054826031339",
    appId: "1:1054826031339:web:1e951ed11f23d79fde36ae"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
 
export { db };
 
 