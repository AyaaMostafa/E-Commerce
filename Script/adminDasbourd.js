import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

const allOrdersList = document.getElementById('allOrdersList');
const adminMessage = document.getElementById('adminMessage');

/**
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
 * Loads and displays all orders from Firestore.
 */
async function loadAllOrders() {
    try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        allOrdersList.innerHTML = '';

        if (ordersSnapshot.empty) {
            allOrdersList.innerHTML = "<p class='text-center'>No orders found.</p>";
            return;
        }

        ordersSnapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const orderId = docSnap.id;
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            // Check if status exists, default to 'Unknown' if undefined
            const status = order.status ? order.status : 'Unknown';
            orderElement.innerHTML = `
                <h5>Order ID: ${orderId}</h5>
                <p>User Email: ${order.userEmail || 'N/A'}</p>
                <p>Total Price: $${order.totalPrice || 0}</p>
                <p>Status: <span class="status-${status.toLowerCase()}">${status}</span></p>
                <p>Timestamp: ${order.timestamp || 'N/A'}</p>
                ${order.description ? `<p>Description: ${order.description.map(item => item.email || item.description || 'N/A').join(', ')}</p>` : ''}
            `;

            // Status Dropdown
            const statusSelect = document.createElement('select');
            statusSelect.className = 'form-select mb-2';
            ['Pending', 'Accepted', 'Rejected'].forEach(statusOption => {
                const option = document.createElement('option');
                option.value = statusOption;
                option.textContent = statusOption;
                if (statusOption === status) option.selected = true;
                statusSelect.appendChild(option);
            });

            statusSelect.addEventListener('change', async () => {
                try {
                    await updateDoc(doc(db, 'orders', orderId), { status: statusSelect.value });
                    showMessage('success', 'Status Updated', `Order ${orderId} status updated to ${statusSelect.value}!`);
                    loadAllOrders();
                } catch (error) {
                    showMessage('error', 'Error', 'Failed to update status.');
                }
            });

            orderElement.appendChild(statusSelect);
            allOrdersList.appendChild(orderElement);
        });
    } catch (error) {
        console.error('Error loading orders:', error.message);
        allOrdersList.innerHTML = "<p class='text-center'>Error loading orders. Please try again later.</p>";
    }
}

// Check if the user is an admin on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.accountType !== 'admin') {
        showMessage('error', 'Unauthorized Access', 'You do not have permission to access this page.');
        setTimeout(() => (window.location.href = '/index.html'), 1500);
        return;
    }
    adminMessage.textContent = `Welcome, ${user.name}! You are logged in as Admin.`;
    loadAllOrders();
});