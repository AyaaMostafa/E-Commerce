// Import Firestore database and functions
import { db } from './firebase-config.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { createCard } from '../components/productCard.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

// Constants
const CART_CONTAINER_ID = 'cartProducts';
const TOTAL_PRICE_ID = 'totalPrice';
const CLEAR_CART_BTN_ID = 'clearCartBtn';
const CHECKOUT_BTN_ID = 'checkoutBtn';
const ORDER_STATUS_BTN_ID = 'orderStatusBtn';
const CART_ICON_ID = 'cart-icon';
const HIGHLIGHT_COLOR = '#28a745';
const DEFAULT_COLOR = '#ff7e3f';
const TRANSITION_DURATION = 500; // ms

/**
 * Updates the total price dynamically with optional highlight effect.
 * @param {boolean} highlight - Whether to apply a highlight effect.
 * @param {Array} userCart - Array of cart items.
 * @param {HTMLElement} cartContainer - The cart container element.
 */
const updateTotalPrice = (highlight = false, userCart, cartContainer) => {
    const totalPrice = userCart.reduce((total, item) => {
        const card = cartContainer.querySelector(`[data-name="${item.name}"]`);
        const quantity = card ? parseInt(card.querySelector('.form-control').value, 10) : item.quantity;
        return total + (item.price * (quantity || 0));
    }, 0);

    const totalPriceElement = document.getElementById(TOTAL_PRICE_ID);
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2);
        if (highlight) {
            totalPriceElement.style.transition = `color ${TRANSITION_DURATION / 1000}s ease`;
            totalPriceElement.style.color = HIGHLIGHT_COLOR;
            setTimeout(() => {
                totalPriceElement.style.color = DEFAULT_COLOR;
            }, TRANSITION_DURATION);
        }
    }
};

/**
 * Loads and renders the cart items from Firestore.
 * @returns {Promise<void>}
 */
async function loadCart() {
    const cartContainer = document.getElementById(CART_CONTAINER_ID);
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    try {
        const urlParams = new URLSearchParams(window.location.search);
        let email = decodeURIComponent(urlParams.get('email') || '');

        if (!email) {
            const referrerParams = new URLSearchParams(new URL(document.referrer).search);
            email = decodeURIComponent(referrerParams.get('email') || '');
            if (email) {
                const newUrl = `/Pages/cart.html?email=${encodeURIComponent(email)}`;
                window.history.replaceState({}, document.title, newUrl);
            }
        }

        if (!email) {
            cartContainer.innerHTML = "<p class='text-center'>Please log in to view your cart.</p>";
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'You need to log in to view your cart.',
                background: '#2a2a2a',
                color: '#fff',
                confirmButtonColor: '#ff7e3f',
                timer: 3000,
            }).then(() => {
                window.location.href = '/index.html';
            });
            return;
        }

        const cartDocRef = doc(db, 'cart', 'cart');
        const docSnap = await getDoc(cartDocRef);

        if (!docSnap.exists() || !docSnap.data().items || docSnap.data().items.length === 0) {
            cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            updateTotalPrice(false, [], cartContainer);
            return;
        }

        const { items } = docSnap.data();
        const userCart = items.filter(item => item.email === email);

        if (userCart.length === 0) {
            cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            updateTotalPrice(false, [], cartContainer);
            return;
        }

        // Render cart items
        userCart.forEach((item) => {
            const card = createCard(item.name, item.price, item.image, '', item.quantity, () =>
                updateTotalPrice(true, userCart, cartContainer)
            );
            card.setAttribute('data-name', item.name);

            const cardBody = card.querySelector('.card-body');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger btn-sm mt-2 w-100';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', async () => {
                const updatedUserCart = userCart.filter(cartItem => cartItem.name !== item.name);
                const updatedItems = items.filter(cartItem => !(cartItem.email === email && cartItem.name === item.name));
                await setDoc(cartDocRef, { items: updatedItems });
                Swal.fire({
                    icon: 'success',
                    title: 'Item Removed',
                    text: `${item.name} has been removed from your cart!`,
                    background: '#2a2a2a',
                    color: '#fff',
                    confirmButtonColor: '#ff7e3f',
                    timer: 1500,
                });
                loadCart();
            });

            cardBody.appendChild(removeBtn);
            cartContainer.appendChild(card);
        });

        updateTotalPrice(false, userCart, cartContainer);

        // Clear Cart functionality
        const clearCartButton = document.getElementById(CLEAR_CART_BTN_ID);
        if (clearCartButton) {
            clearCartButton.addEventListener('click', async () => {
                try {
                    await setDoc(cartDocRef, { items: [] });
                    Swal.fire({
                        icon: 'success',
                        title: 'Cart Cleared',
                        text: 'All items have been removed from your cart!',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                        timer: 1500,
                    });
                    loadCart();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to clear cart.',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                    });
                }
            });
        }

        // Checkout functionality
        const checkoutButton = document.getElementById(CHECKOUT_BTN_ID);
        if (checkoutButton) {
            checkoutButton.addEventListener('click', async () => {
                if (userCart.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Empty Cart',
                        text: 'Your cart is empty. Add items to proceed!',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                    });
                    return;
                }

                try {
                    const orderId = Date.now().toString();
                    await setDoc(doc(db, 'orders', orderId), {
                        userEmail: email,
                        items: userCart.map(({ name, price, quantity }) => ({ name, price, quantity })),
                        status: 'pending',
                        totalPrice: userCart.reduce((sum, { price, quantity }) => sum + price * quantity, 0).toFixed(2),
                        timestamp: new Date().toISOString(),
                    });
                    await setDoc(cartDocRef, { items: [] });
                    window.location.href = `/Pages/orderdetails/orderdetails.html?orderId=${orderId}&email=${encodeURIComponent(email)}`;
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to place order.',
                        background: '#2a2a2a',
                        color: '#fff',
                        confirmButtonColor: '#ff7e3f',
                    });
                }
            });
        }

        // Order Status functionality
        const orderStatusButton = document.getElementById(ORDER_STATUS_BTN_ID);
        if (orderStatusButton) {
            orderStatusButton.addEventListener('click', () => {
                window.location.href = `/Pages/orderdetails/orderdetails.html?email=${encodeURIComponent(email)}`;
            });
        }
    } catch (error) {
        console.error('Error loading cart:', error.message);
        cartContainer.innerHTML = "<p class='text-center'>Error loading cart. Please try again later.</p>";
    }
}

// Initialize cart and event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    document.body.addEventListener('click', (e) => {
        if (e.target.id === CART_ICON_ID || e.target.closest(`#${CART_ICON_ID}`)) {
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email');
            console.log('Cart icon clicked, email:', email);
            window.location.href = `../Pages/cart/cart.html?email=${email}`;
        }
    });
});