import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { createCard } from "../components/productCard.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

// دالة لتحميل المنتجات من السلة
async function loadCart() {
    const cartContainer = document.getElementById("cartProducts");
    cartContainer.innerHTML = "";

    try {
        const urlParams = new URLSearchParams(window.location.search);
        let email = urlParams.get("email");
        email = decodeURIComponent(email);
        console.log("Decoded email from URL:", email);

        if (!email) {
            const referrerParams = new URLSearchParams(new URL(document.referrer).search);
            email = referrerParams.get("email");
            if (email) {
                const newUrl = `/Pages/cart.html?email=${encodeURIComponent(email)}`;
                window.history.replaceState({}, '', newUrl);
            }
        }

        console.log("Final email after referrer check:", email);

        if (!email) {
            cartContainer.innerHTML = "<p class='text-center'>Please log in to view your cart.</p>";
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'You need to log in to view your cart.',
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

        // إضافة الـ email لزرار Favorites ديناميكيًا
        const favoritesButton = document.querySelector(".favorites-btn");
        if (favoritesButton) {
            favoritesButton.href = `/Pages/favourite.html?email=${encodeURIComponent(email)}`;
        }

        const cartDocRef = doc(db, "cart", "cart");
        const docSnap = await getDoc(cartDocRef);

        console.log("Firestore doc exists:", docSnap.exists());
        if (docSnap.exists()) {
            console.log("Firestore data:", docSnap.data());
        }

        if (!docSnap.exists() || !docSnap.data().items || docSnap.data().items.length === 0) {
            cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            console.log("No items found in Firestore or document does not exist.");
            return;
        }

        const items = docSnap.data().items;
        console.log("Items in cart:", items);

        const userCart = items.filter(item => item.email === email);
        console.log("Filtered cart for email:", userCart);

        if (userCart.length === 0) {
            cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            console.log("No items found for this email.");
            return;
        }

        userCart.forEach((item, index) => {
            console.log("Rendering item:", item);
            const card = createCard(item.name, item.price, item.image, item.description);

            const cardBody = card.querySelector(".card-body");

            // إضافة زرار "Remove from Cart"
            const removeButton = document.createElement("button");
            removeButton.className = "remove-btn w-100 mt-2";
            removeButton.textContent = "Remove from Cart";
            removeButton.dataset.index = index;
            removeButton.dataset.email = email;

            cardBody.appendChild(removeButton);

            cartContainer.appendChild(card);

            removeButton.addEventListener("click", async (e) => {
                const index = parseInt(e.target.dataset.index);
                const email = e.target.dataset.email;

                const docSnap = await getDoc(cartDocRef);
                const items = docSnap.data().items;
                const userCart = items.filter(item => item.email === email);
                const itemToRemove = userCart[index];

                try {
                    await updateDoc(cartDocRef, {
                        items: arrayRemove(itemToRemove)
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Removed',
                        text: 'Item removed from cart!',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                        timer: 1500
                    });
                    loadCart();
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

        // حساب إجمالي السعر (الكمية دايمًا 1 لأن العنصر مش بيتكرر)
        const totalPrice = userCart.reduce((total, item) => total + item.price, 0);
        const totalPriceElement = document.getElementById("totalPrice");
        if (totalPriceElement) {
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        cartContainer.innerHTML = "<p class='text-center'>Error loading cart. Please try again later.</p>";
    }
}

// إضافة event listener لأيقونة السلة
document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    // التحقق من وجود أيقونة السلة والتعامل مع الضغط عليها
    document.body.addEventListener("click", function (e) {
        if (e.target.id === "cart-icon" || e.target.closest("#cart-icon")) {
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get("email");
            console.log("Cart icon clicked, email:", email);
            window.location.href = `/Pages/cart.html?email=${email}`;
        }
    });
});