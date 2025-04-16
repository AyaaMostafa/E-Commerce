import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { createCard } from "../components/productCard.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

// دالة لعرض المنتجات المفضلة
async function loadFavorites() {
    const favoritesContainer = document.getElementById("favoriteProducts");
    favoritesContainer.innerHTML = "";

    try {
        const urlParams = new URLSearchParams(window.location.search);
        let email = urlParams.get("email");
        email = decodeURIComponent(email);
        console.log("Decoded email from URL:", email);

        if (!email) {
            const referrerParams = new URLSearchParams(new URL(document.referrer).search);
            email = referrerParams.get("email");
            if (email) {
                const newUrl = `/Pages/favourite.html?email=${encodeURIComponent(email)}`;
                window.history.replaceState({}, '', newUrl);
            }
        }

        console.log("Final email after referrer check:", email);

        if (!email) {
            favoritesContainer.innerHTML = "<p class='text-center'>Please log in to view favorites.</p>";
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'You need to log in to view your favorites.',
                background: '#2a2a2a',
                color: '#fff',
                confirmButtonColor: '#ff7e3f',
                timer: 3000
            }).then(() => {
                window.location.href = "/index.html";
            });
            return;
        }

        // إضافة الـ email لزرار Home ديناميكيًا
        const homeButton = document.querySelector(".home-btn");
        if (homeButton) {
            homeButton.href = `/app/app.html?page=home&email=${encodeURIComponent(email)}`;
        }

        const favoritesDocRef = doc(db, "favorites", "favorites");
        const docSnap = await getDoc(favoritesDocRef);

        console.log("Firestore doc exists:", docSnap.exists());
        if (docSnap.exists()) {
            console.log("Firestore data:", docSnap.data());
        }

        if (!docSnap.exists() || !docSnap.data().items || docSnap.data().items.length === 0) {
            favoritesContainer.innerHTML = "<p class='text-center'>No favorites yet.</p>";
            console.log("No items found in Firestore or document does not exist.");
            return;
        }

        const items = docSnap.data().items;
        console.log("Items in favorites:", items);

        const userFavorites = items.filter(item => item.email === email);
        console.log("Filtered favorites for email:", userFavorites);

        if (userFavorites.length === 0) {
            favoritesContainer.innerHTML = "<p class='text-center'>No favorites yet.</p>";
            console.log("No favorites found for this email.");
            return;
        }

        userFavorites.forEach((item, index) => {
            console.log("Rendering item:", item);
            const card = createCard(item.name, item.price, item.image, item.description);

            const cardBody = card.querySelector(".card-body");
            const removeButton = document.createElement("button");
            removeButton.className = "remove-btn w-100";
            removeButton.textContent = "Remove from Favorites";
            removeButton.dataset.index = index;
            removeButton.dataset.email = email;

            cardBody.appendChild(removeButton);

            favoritesContainer.appendChild(card);

            removeButton.addEventListener("click", async (e) => {
                const index = parseInt(e.target.dataset.index);
                const email = e.target.dataset.email;

                const docSnap = await getDoc(favoritesDocRef);
                const items = docSnap.data().items;
                const userFavorites = items.filter(item => item.email === email);
                const itemToRemove = userFavorites[index];

                try {
                    await updateDoc(favoritesDocRef, {
                        items: arrayRemove(itemToRemove)
                    });

                    const favKey = `favorite_${itemToRemove.name}`;
                    localStorage.removeItem(favKey);

                    Swal.fire({
                        icon: 'success',
                        title: 'Removed',
                        text: 'Item removed from favorites!',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                        timer: 1500
                    });
                    loadFavorites();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to remove item.',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f'
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error loading favorites:", error);
        favoritesContainer.innerHTML = "<p class='text-center'>Error loading favorites. Please try again later.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
});