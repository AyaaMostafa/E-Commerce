import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

const allOrdersList = document.getElementById('allOrdersList');
const adminMessage = document.getElementById('adminMessage');

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
            const status = order.status ? order.status : 'Unknown';
            orderElement.innerHTML = `
                <h5>Order ID: ${orderId}</h5>
                <p>User Email: ${order.userEmail || 'N/A'}</p>
                <p>Total Price: $${order.totalPrice || 0}</p>
                <p>Status: <span class="status-${status.toLowerCase()}">${status}</span></p>
                <p>Timestamp: ${order.timestamp || 'N/A'}</p>
                ${order.items ? `<p>Items: ${order.items.map(item => `${item.name} - $${item.price} x ${item.quantity || 1}`).join(', ')}</p>` : ''}
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

// Add Admin Form Submission
window.submitAddAdminForm = async function() {
    const name = document.getElementById("adminName").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const phone = document.getElementById("adminPhone").value.trim();
    const location = document.getElementById("adminLocation").value.trim();

    console.log("Form Data:", { name, email, password, phone, location }); // Debugging

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log("Validation Failed: Invalid email"); // Debugging
        return showMessage('error', 'Error', "Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
        console.log("Validation Failed: Password too short"); // Debugging
        return showMessage('error', 'Error', "Password must be at least 6 characters long.");
    }
    if (!name || name.length < 3) {
        console.log("Validation Failed: Name too short"); // Debugging
        return showMessage('error', 'Error', "Full name must be at least 3 characters long.");
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
        console.log("Validation Failed: Invalid phone number"); // Debugging
        return showMessage('error', 'Error', "Please enter a valid phone number (10-15 digits).");
    }
    if (!location || location.length < 3) {
        console.log("Validation Failed: Location too short"); // Debugging
        return showMessage('error', 'Error', "Location must be at least 3 characters long.");
    }

    try {
        // Check if CryptoJS is loaded
        if (typeof CryptoJS === 'undefined' || !CryptoJS.SHA256) {
            console.error("CryptoJS is not loaded");
            return showMessage('error', 'Error', "Encryption library failed to load. Please try again later.");
        }

        console.log("Encrypting Password..."); // Debugging
        const encryptedPassword = CryptoJS.SHA256(password).toString();
        const emailKey = email.toLowerCase().replace(/\./g, "_");
        console.log("Encrypted Password:", encryptedPassword); // Debugging
        console.log("Email Key:", emailKey); // Debugging

        // Check if email already exists
        console.log("Checking if email exists..."); // Debugging
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
            console.log("Email already registered"); // Debugging
            return showMessage('error', 'Error', "Email already registered.");
        }

        // Add new admin to Firestore
        console.log("Adding new admin to Firestore..."); // Debugging
        const userData = { name, email, password: encryptedPassword, phone, location, accountType: "admin" };
        await setDoc(doc(db, "users", emailKey), userData);

        console.log("Admin added successfully"); // Debugging
        showMessage('success', 'Success', "Admin added successfully!");
        document.getElementById("addAdminForm").reset();
        const addAdminModal = bootstrap.Modal.getInstance(document.getElementById('addAdminModal'));
        addAdminModal.hide();
    } catch (error) {
        console.error("Error adding admin:", error); // Debugging
        showMessage('error', 'Error', `Failed to add admin: ${error.message}`);
    }
};

// Load Products
async function loadProducts() {
    try {
        const productsList = document.getElementById('productsList');
        if (!productsList) {
            console.error('Products list element not found.');
            return;
        }

        const productsSnapshot = await getDocs(collection(db, 'products'));
        productsList.innerHTML = '';

        if (productsSnapshot.empty) {
            productsList.innerHTML = "<tr><td colspan='4' class='text-center'>No products found.</td></tr>";
            return;
        }

        productsSnapshot.forEach((docSnap) => {
            const product = docSnap.data();
            const productId = docSnap.id;
            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openEditProductModal('${productId}', '${product.name}', ${product.price}, '${product.category}', '${product.image}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${productId}')">Delete</button>
                </td>
            `;
            productsList.appendChild(productRow);
        });
    } catch (error) {
        console.error('Error loading products:', error.message);
        showMessage('error', 'Error', 'Failed to load products.');
    }
}

// Add Product Form Submission
document.getElementById('addProductForm').onsubmit = async function(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value.trim();

    // Validation
    if (!name || name.length < 3) {
        return showMessage('error', 'Error', 'Product name must be at least 3 characters long.');
    }
    if (isNaN(price) || price <= 0) {
        return showMessage('error', 'Error', 'Please enter a valid price greater than 0.');
    }
    if (!category) {
        return showMessage('error', 'Error', 'Please select a category.');
    }
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!urlRegex.test(image)) {
        return showMessage('error', 'Error', 'Please enter a valid image URL (png, jpg, jpeg, gif, svg).');
    }

    try {
        const productId = doc(collection(db, 'products')).id; // Generate a unique ID
        await setDoc(doc(db, 'products', productId), {
            name,
            price,
            category,
            image,
        });
        showMessage('success', 'Success', 'Product added successfully!');
        document.getElementById('addProductForm').reset();
        loadProducts();
    } catch (error) {
        console.error('Error adding product:', error.message);
        showMessage('error', 'Error', 'Failed to add product.');
    }
};

// Open Edit Product Modal
window.openEditProductModal = function(id, name, price, category, image) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductCategory').value = category;
    document.getElementById('editProductImage').value = image;
    const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.show();
};

// Edit Product Form Submission
window.submitEditProductForm = async function() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const category = document.getElementById('editProductCategory').value;
    const image = document.getElementById('editProductImage').value.trim();

    // Validation
    if (!name || name.length < 3) {
        return showMessage('error', 'Error', 'Product name must be at least 3 characters long.');
    }
    if (isNaN(price) || price <= 0) {
        return showMessage('error', 'Error', 'Please enter a valid price greater than 0.');
    }
    if (!category) {
        return showMessage('error', 'Error', 'Please select a category.');
    }
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!urlRegex.test(image)) {
        return showMessage('error', 'Error', 'Please enter a valid image URL (png, jpg, jpeg, gif, svg).');
    }

    try {
        await updateDoc(doc(db, 'products', id), {
            name,
            price,
            category,
            image,
        });
        showMessage('success', 'Success', 'Product updated successfully!');
        const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editProductModal.hide();
        loadProducts();
    } catch (error) {
        console.error('Error updating product:', error.message);
        showMessage('error', 'Error', 'Failed to update product.');
    }
};

// Delete Product
window.deleteProduct = async function(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff7e3f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        background: '#2a2a2a',
        color: '#fff',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, 'products', id));
                showMessage('success', 'Success', 'Product deleted successfully!');
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error.message);
                showMessage('error', 'Error', 'Failed to delete product.');
            }
        }
    });
};

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
    loadProducts();
});