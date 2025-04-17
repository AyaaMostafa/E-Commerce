import { db } from './firebase-config.js';
import { collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

const ordersList = document.getElementById('ordersList');
const userMessage = document.getElementById('userMessage');

/**
 * Displays success/error messages using Swal.
 * @param {string} type - 'success', 'error', or 'warning'
 * @param {string} title - The title of the message
 * @param {string} message - The message to display
 */
const showMessage = (type, title, message) => {
    Swal.fire({
        icon: type,
        title,
        text: message,
        background: '#2a2a2a',
        color: '#fff',
        confirmButtonColor: '#ff7e3f',
        timer: type === 'success' ? 1500 : undefined,
    });
};

/**
 * Logs out the user and redirects to the home page.
 */
window.logout = function () {
    localStorage.removeItem('currentUser');
    showMessage('success', 'Logged Out', 'Logged out successfully!');
    setTimeout(() => (window.location.href = '/index.html'), 1500);
};

/**
 * Loads and displays the user's orders from Firestore in real-time.
 */
function loadUserOrders(email) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.accountType !== 'client') {
        showMessage('error', 'Unauthorized Access', 'You do not have permission to access this page.');
        setTimeout(() => (window.location.href = '/index.html'), 1500);
        return;
    }

    if (!email) {
        showMessage('error', 'Error', 'No email provided to load orders.');
        console.error('No email provided in URL or localStorage');
        return;
    }

    const ordersQuery = query(collection(db, 'orders'), where('userEmail', '==', email));
    onSnapshot(ordersQuery, (snapshot) => {
        ordersList.innerHTML = '';

        if (snapshot.empty) {
            ordersList.innerHTML = "<p class='text-center'>No orders found for this user.</p>";
            console.log(`No orders found for email: ${email}`);
            return;
        }

        let ordersDisplayed = 0;
        snapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const orderId = docSnap.id;
            const status = order.status || 'Unknown';
            ordersDisplayed++;
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <h5>Order ID: ${orderId}</h5>
                <div id="orderItems-${orderId}">
                    ${order.items ? order.items.map(item => `
                        <div class="order-item-detail">
                            ${item.name} - $${item.price} x ${item.quantity || 1}
                        </div>
                    `).join('') : '<p>No items available.</p>'}
                </div>
                <p>Status: <span class="status-${status.toLowerCase()}">${status}</span></p>
                <p>Total Price: $${order.totalPrice || 0}</p>
                <p>Timestamp: ${order.timestamp || 'N/A'}</p>
            `;
            ordersList.appendChild(orderElement);
        });

        if (ordersDisplayed === 0) {
            ordersList.innerHTML = "<p class='text-center'>No orders found.</p>";
        } else {
            userMessage.textContent = `Welcome, ${user.name}! Here are your orders.`;
        }
    }, (error) => {
        console.error('Error loading orders:', error.message);
        ordersList.innerHTML = "<p class='text-center'>Error loading orders. Please try again later.</p>";
        showMessage('error', 'Error', 'Failed to load orders.');
    });
}

// Check if the user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = decodeURIComponent(urlParams.get('email') || '');

    if (!user || user.accountType !== 'client') {
        showMessage('error', 'Unauthorized Access', 'You do not have permission to access this page.');
        setTimeout(() => (window.location.href = '/index.html'), 1500);
        return;
    }

    if (!emailFromUrl && !user.email) {
        showMessage('error', 'Error', 'No email available to load orders.');
        console.error('No email in URL or localStorage');
        setTimeout(() => (window.location.href = '/index.html'), 1500);
        return;
    }

    userMessage.textContent = `Welcome, ${user.name}! Loading your orders...`;
    loadUserOrders(emailFromUrl || user.email);
});