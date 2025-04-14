
import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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



// save to doc 
export async function saveToFavorites(item, email) {
    try {
        const favoritesDocRef = doc(db, "favorites", "favorites");
 
        const favoriteItem = {
            description: item.description ?? "",
            image: item.image,
            name: item.name,
            price: item.price,
            email: email
        };

        console.log("Favorite item:", favoriteItem);

        const docSnap = await getDoc(favoritesDocRef);
 
        if (docSnap.exists()) {
            await updateDoc(favoritesDocRef, {
                items: arrayUnion(favoriteItem)
            });
        } else {
            await setDoc(favoritesDocRef, {
                items: [favoriteItem]
            });
        }
 
        console.log("Added to favorites/favorites in items array:", favoriteItem);
    } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
    }
}




export async function removeFromFavorites(item) {
    try {
        const favoritesDocRef = doc(db, "favorites", "favorites");

        const itemToRemove = {
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description ?? "",
        };

        await updateDoc(favoritesDocRef, {
            items: arrayRemove(itemToRemove)
        });

        console.log("Removed from favorites:", itemToRemove);
    } catch (error) {
        console.error("Error removing from favorites:", error);
        throw error;
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