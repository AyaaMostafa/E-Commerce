
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import {createCard} from "./../components/productCard.js"

export async function fetchProducts(collection, docId) {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}



export function loadDataToHtml(data)
{
    const products = document.getElementById("products");
    if (products) {
        products.innerHTML = "";
        for (let product of data) {
            let productCard = createCard(product.name, product.price, product.image);
            products.appendChild(productCard);
        }
    } else {
        console.error("Products container not found");
    }
}