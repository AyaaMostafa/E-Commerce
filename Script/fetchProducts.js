import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { createCard } from "./../components/productCard.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export async function fetchProducts(collection, docId) {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}

export async function saveToFavorites(item, email) {
    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to add items to favorites.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        return;
    }

    try {
        const favoritesDocRef = doc(db, "favorites", "favorites");

        const favoriteItem = {
            description: item.description ?? "",
            image: item.image,
            name: item.name,
            price: item.price,
            email: email
        };

        console.log("Saving favorite item with image:", favoriteItem); 

        const docSnap = await getDoc(favoritesDocRef);

        if (docSnap.exists()) {
            const items = docSnap.data().items || [];
            const alreadyInFavorites = items.some(fav => fav.name === item.name && fav.email === email);
            if (alreadyInFavorites) {
                Swal.fire({
                    icon: 'info',
                    title: 'Already in Favorites',
                    text: 'This item is already in your favorites.',
                    background: '#2a2a2a',
                    color: '#fff',
                    confirmButtonColor: '#ff7e3f',
                    timer: 1500
                });
                return;
            }

            await updateDoc(favoritesDocRef, {
                items: arrayUnion(favoriteItem)
            });
        } else {
            await setDoc(favoritesDocRef, {
                items: [favoriteItem]
            });
        }

        console.log("Added to favorites/favorites in items array:", favoriteItem);
        Swal.fire({
            icon: 'success',
            title: 'Added to Favorites',
            text: 'Item has been added to your favorites!',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f',
            timer: 1500
        });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add item to favorites.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        throw error;
    }
}

export async function removeFromFavorites(item) {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to remove items from favorites.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        return;
    }

    try {
        const favoritesDocRef = doc(db, "favorites", "favorites");

        const docSnap = await getDoc(favoritesDocRef);
        if (!docSnap.exists() || !docSnap.data().items) return;

        const items = docSnap.data().items;
        const itemToRemove = items.find(fav => fav.name === item.name && fav.email === email);

        if (itemToRemove) {
            await updateDoc(favoritesDocRef, {
                items: arrayRemove(itemToRemove)
            });

            console.log("Removed from favorites:", itemToRemove);
            Swal.fire({
                icon: 'success',
                title: 'Removed',
                text: 'Item removed from favorites!',
                background: '#2a2a2a',
                color: '#fff',
                confirmButtonColor: '#ff7e3f',
                timer: 1500
            });
        }
    } catch (error) {
        console.error("Error removing from favorites:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove item from favorites.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        throw error;
    }
}

export async function addToCart(item, email, quantity = 1) {
    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to add items to your cart.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        return;
    }

    try {
        const cartDocRef = doc(db, "cart", "cart");

        const cartItem = {
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description ?? "",
            email: email,
            quantity: quantity
        };

        const docSnap = await getDoc(cartDocRef);

        if (docSnap.exists()) {
            const items = docSnap.data().items || [];
            const existingItem = items.find(prod => prod.name === item.name && prod.email === email);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                await updateDoc(cartDocRef, {
                    items: arrayRemove(existingItem)
                });
                await updateDoc(cartDocRef, {
                    items: arrayUnion({ ...existingItem, quantity: newQuantity })
                });

                Swal.fire({
                    icon: 'info',
                    title: 'Updated Cart',
                    text: 'Item quantity updated in your cart!',
                    background: '#2a2a2a',
                    color: '#fff',
                    confirmButtonColor: '#ff7e3f',
                    timer: 1500
                });
                return;
            }

            await updateDoc(cartDocRef, {
                items: arrayUnion(cartItem)
            });
        } else {
            await updateDoc(cartDocRef, {
                items: arrayUnion({ ...existingItem, quantity: existingItem.quantity + quantity })
            });
        }

        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: 'Item has been added to your cart!',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f',
            timer: 1500
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add item to cart.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        throw error;
    }
}

export async function removeFromCart(item, email) {
    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'Please log in to remove items from your cart.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        return;
    }

    try {
        const cartDocRef = doc(db, "cart", "cart");
        const docSnap = await getDoc(cartDocRef);
        if (!docSnap.exists() || !docSnap.data().items) return;

        const items = docSnap.data().items;
        const itemToRemove = items.find(prod => prod.name === item.name && prod.email === email);

        if (itemToRemove) {
            await updateDoc(cartDocRef, {
                items: arrayRemove(itemToRemove)
            });

            Swal.fire({
                icon: 'success',
                title: 'Removed from Cart',
                text: 'Item has been removed from your cart!',
                background: '#2a2a2a',
                color: '#fff',
                confirmButtonColor: '#ff7e3f',
                timer: 1500
            });
        }
    } catch (error) {
        console.error("Error removing from cart:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove item from cart.',
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f'
        });
        throw error;
    }
}

export function loadDataToHtml(data) {
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