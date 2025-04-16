import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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
            updateTotalPrice(0); // تحديث إجمالي السعر إلى 0
            return;
        }

        let items = docSnap.data().items;
        console.log("Items in cart:", items);

        let userCart = items.filter(item => item.email === email);
        console.log("Filtered cart for email:", userCart);

        if (userCart.length === 0) {
            cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            console.log("No items found for this email.");
            updateTotalPrice(0); // تحديث إجمالي السعر إلى 0
            return;
        }

        // دالة لتحديث إجمالي السعر ديناميكيًا
        const updateTotalPrice = (highlight = false) => {
            const totalPrice = userCart.reduce((total, item) => {
                const card = cartContainer.querySelector(`[data-name="${item.name}"]`);
                const quantity = card ? parseInt(card.querySelector(".form-control").value) : item.quantity;
                return total + (item.price * quantity);
            }, 0);
            const totalPriceElement = document.getElementById("totalPrice");
            if (totalPriceElement) {
                totalPriceElement.textContent = totalPrice.toFixed(2);
                if (highlight) {
                    totalPriceElement.style.transition = "color 0.3s ease";
                    totalPriceElement.style.color = "#28a745"; // لون أخضر للحظة
                    setTimeout(() => {
                        totalPriceElement.style.color = "#ff7e3f"; // رجوع للون الأصلي
                    }, 500);
                }
            }
        };

        // عرض الكروت مع أزرار ديناميكية
        userCart.forEach((item, index) => {
            console.log("Rendering item:", item);
            const card = createCard(item.name, item.price, item.image, "", item.quantity, () => updateTotalPrice(true));

            // إضافة data-name للكارت عشان نعرف نحدّث الكمية بسهولة
            card.setAttribute("data-name", item.name);

            // إضافة زرار "Remove"
            const cardBody = card.querySelector(".card-body");
            const removeBtn = document.createElement("button");
            removeBtn.className = "btn btn-danger btn-sm mt-2 w-100";
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", async () => {
                userCart = userCart.filter(cartItem => cartItem.name !== item.name);
                items = items.filter(cartItem => !(cartItem.email === email && cartItem.name === item.name));
                await setDoc(cartDocRef, { items });
                Swal.fire({
                    icon: 'success',
                    title: 'Item Removed',
                    text: `${item.name} has been removed from your cart!`,
                    background: '#2a2a2a',
                    color: '#fff',
                    confirmButtonColor: '#ff7e3f',
                    timer: 1500
                });
                loadCart(); // إعادة تحميل السلة
            });

            cardBody.appendChild(removeBtn);
            cartContainer.appendChild(card);
        });

        // تحديث إجمالي السعر لأول مرة
        updateTotalPrice();

        // إضافة وظيفة لزرار "Clear Cart"
        const clearCartButton = document.getElementById("clearCartBtn");
        if (clearCartButton) {
            clearCartButton.addEventListener("click", async () => {
                try {
                    await setDoc(cartDocRef, { items: [] }); // تفريغ السلة
                    Swal.fire({
                        icon: 'success',
                        title: 'Cart Cleared',
                        text: 'All items have been removed from your cart!',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                        timer: 1500
                    });
                    loadCart(); // إعادة تحميل السلة
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to clear cart.',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f'
                    });
                }
            });
        }

        // إضافة وظيفة لزرار "Checkout"
        const checkoutButton = document.getElementById("checkoutBtn");
        if (checkoutButton) {
            checkoutButton.addEventListener("click", async () => {
                if (userCart.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Empty Cart',
                        text: 'Your cart is empty. Add items to proceed!',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f'
                    });
                    return;
                }

                try {
                    await setDoc(cartDocRef, { items: [] }); // تفريغ السلة
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Placed',
                        text: 'Thank you for your order! Your cart has been cleared.',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                        timer: 2000
                    });
                    loadCart(); // إعادة تحميل السلة
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to place order.',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f'
                    });
                }
            });
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