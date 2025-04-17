import { db } from './firebase-config.js';
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

// Function to display success/error messages
function displaySuccessMessage(message) {
    Swal.fire({ 
        icon: 'success', 
        title: 'Success', 
        text: message, 
        background: '#2a2a2a', 
        color: '#fff', 
        confirmButtonColor: '#ff7e3f',
        timer: 1500 
    });
}

function displayErrorMessage(message) {
    Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: message, 
        background: '#2a2a2a', 
        color: '#fff', 
        confirmButtonColor: '#ff7e3f' 
    });
}

// Load Categories from Firestore and populate dropdowns
async function loadCategories() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'food'));
        const categoryDropdown = document.getElementById('categoryDropdown');
        const editCategoryDropdown = document.getElementById('editCategoryDropdown');

        categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
        editCategoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';

        categoriesSnapshot.forEach((docSnap) => {
            const category = docSnap.id; // The category name is the document ID (e.g., burger, pizza)
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = category;
            editOption.textContent = category;
            editCategoryDropdown.appendChild(editOption);
        });
    } catch (error) {
        console.error('Error loading categories:', error.message);
        displayErrorMessage('Failed to load categories.');
    }
}

// Check if user is admin on page load
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Current User:", user); // Debugging
    if (!user || user.accountType !== "admin") {
        displayErrorMessage("Unauthorized access!");
        setTimeout(() => window.location.href = "/index.html", 1500);
        return;
    }
    const adminMessage = document.getElementById('adminMessage');
    if (adminMessage) {
        adminMessage.textContent = `Welcome, ${user.name}! You are logged in as Admin.`;
    }
    loadProducts();
    loadCategories(); // Load categories on page load

    // Add event listeners for buttons if they exist
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error("Logout button not found!");
    }

    const addAdminButton = document.getElementById('addAdminButton');
    if (addAdminButton) {
        addAdminButton.addEventListener('click', submitAddAdminForm);
    } else {
        console.error("Add Admin button not found!");
    }

    const editProductButton = document.getElementById('editProductButton');
    if (editProductButton) {
        editProductButton.addEventListener('click', submitEditProductForm);
    } else {
        console.error("Edit Product button not found!");
    }

    // Fix accessibility issue: Move focus when modal is hidden
    const modals = [document.getElementById('addAdminModal'), document.getElementById('manageProductsModal'), document.getElementById('editProductModal')];
    modals.forEach(modal => {
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => {
                const triggerButton = document.querySelector(`[data-bs-target="#${modal.id}"]`);
                if (triggerButton) {
                    triggerButton.focus(); // Move focus back to the button that opened the modal
                }
            });
        }
    });
});

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    displaySuccessMessage("Logged out successfully!");
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 1500);
}
window.logout = logout; // Ensure it's globally accessible

// Add Admin Form Submission
async function submitAddAdminForm() {
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
        return displayErrorMessage("Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
        console.log("Validation Failed: Password too short"); // Debugging
        return displayErrorMessage("Password must be at least 6 characters long.");
    }
    if (!name || name.length < 3) {
        console.log("Validation Failed: Name too short"); // Debugging
        return displayErrorMessage("Full name must be at least 3 characters long.");
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
        console.log("Validation Failed: Invalid phone number"); // Debugging
        return displayErrorMessage("Please enter a valid phone number (10-15 digits).");
    }
    if (!location || location.length < 3) {
        console.log("Validation Failed: Location too short"); // Debugging
        return displayErrorMessage("Location must be at least 3 characters long.");
    }

    try {
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
            return displayErrorMessage("Email already registered.");
        }

        // Add new admin to Firestore
        console.log("Adding new admin to Firestore..."); // Debugging
        const userData = { name, email, password: encryptedPassword, phone, location, accountType: "admin" };
        await setDoc(doc(db, "users", emailKey), userData);

        console.log("Admin added successfully"); // Debugging
        displaySuccessMessage("Admin added successfully!");
        document.getElementById("addAdminForm").reset();
        const addAdminModal = bootstrap.Modal.getInstance(document.getElementById('addAdminModal'));
        addAdminModal.hide();
    } catch (error) {
        console.error("Error adding admin:", error); // Debugging
        displayErrorMessage(`Failed to add admin: ${error.message}`);
    }
}
window.submitAddAdminForm = submitAddAdminForm; // Ensure it's globally accessible

// Load Products
async function loadProducts() {
    try {
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '';

        // Get all categories under 'food'
        const categoriesSnapshot = await getDocs(collection(db, 'food'));
        if (categoriesSnapshot.empty) {
            productsList.innerHTML = "<tr><td colspan='4' class='text-center'>No products found.</td></tr>";
            return;
        }

        // Loop through each category to get products
        for (const categoryDoc of categoriesSnapshot.docs) {
            const category = categoryDoc.id;
            const itemsSnapshot = await getDocs(collection(db, `food/${category}/items`));
            
            itemsSnapshot.forEach((docSnap) => {
                const product = docSnap.data();
                const productId = docSnap.id;
                const productRow = document.createElement('tr');
                productRow.innerHTML = `
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td>${category}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="openEditProductModal('${productId}', '${product.name}', ${product.price}, '${category}', '${product.image}', '${product.description}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${productId}', '${category}')">Delete</button>
                    </td>
                `;
                productsList.appendChild(productRow);
            });
        }

        if (productsList.innerHTML === '') {
            productsList.innerHTML = "<tr><td colspan='4' class='text-center'>No products found.</td></tr>";
        }
    } catch (error) {
        console.error('Error loading products:', error.message);
        displayErrorMessage('Failed to load products.');
    }
}

// Add Product Form Submission
document.getElementById('addProductForm').onsubmit = async function(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    // Validation
    if (!name || name.length < 3) {
        return displayErrorMessage('Product name must be at least 3 characters long.');
    }
    if (isNaN(price) || price <= 0) {
        return displayErrorMessage('Please enter a valid price greater than 0.');
    }
    if (!category || category.length < 2) {
        return displayErrorMessage('Please enter a valid category (at least 2 characters).');
    }
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!urlRegex.test(image)) {
        return displayErrorMessage('Please enter a valid image URL (png, jpg, jpeg, gif, svg).');
    }
    if (!description || description.length < 10) {
        return displayErrorMessage('Description must be at least 10 characters long.');
    }

    try {
        // Add product to Firestore under food/[category]/items
        const productId = doc(collection(db, `food/${category}/items`)).id;
        await setDoc(doc(db, `food/${category}/items`, productId), {
            name,
            price,
            image,
            description,
        });

        displaySuccessMessage('Product added successfully!');
        document.getElementById('addProductForm').reset();
        loadProducts();
        loadCategories(); // Reload categories to update dropdown
    } catch (error) {
        console.error('Error adding product:', error.message);
        displayErrorMessage('Failed to add product.');
    }
};

// Open Edit Product Modal
function openEditProductModal(id, name, price, category, image, description) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductCategory').value = category;
    document.getElementById('editProductCategoryOriginal').value = category; // Store original category
    document.getElementById('editProductImage').value = image;
    document.getElementById('editProductDescription').value = description;
    const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.show();
}
window.openEditProductModal = openEditProductModal; // Ensure it's globally accessible

// Edit Product Form Submission
async function submitEditProductForm() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const category = document.getElementById('editProductCategory').value.trim();
    const originalCategory = document.getElementById('editProductCategoryOriginal').value;
    const image = document.getElementById('editProductImage').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();

    // Validation
    if (!name || name.length < 3) {
        return displayErrorMessage('Product name must be at least 3 characters long.');
    }
    if (isNaN(price) || price <= 0) {
        return displayErrorMessage('Please enter a valid price greater than 0.');
    }
    if (!category || category.length < 2) {
        return displayErrorMessage('Please enter a valid category (at least 2 characters).');
    }
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!urlRegex.test(image)) {
        return displayErrorMessage('Please enter a valid image URL (png, jpg, jpeg, gif, svg).');
    }
    if (!description || description.length < 10) {
        return displayErrorMessage('Description must be at least 10 characters long.');
    }

    try {
        if (category === originalCategory) {
            // Update product in the same category
            await updateDoc(doc(db, `food/${category}/items`, id), {
                name,
                price,
                image,
                description,
            });
        } else {
            // Delete from old category and add to new category
            await deleteDoc(doc(db, `food/${originalCategory}/items`, id));
            const newProductId = doc(collection(db, `food/${category}/items`)).id;
            await setDoc(doc(db, `food/${category}/items`, newProductId), {
                name,
                price,
                image,
                description,
            });
        }

        displaySuccessMessage('Product updated successfully!');
        const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editProductModal.hide();
        loadProducts();
        loadCategories(); // Reload categories to update dropdown
    } catch (error) {
        console.error('Error updating product:', error.message);
        displayErrorMessage('Failed to update product.');
    }
}
window.submitEditProductForm = submitEditProductForm; // Ensure it's globally accessible

// Delete Product
function deleteProduct(id, category) {
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
                await deleteDoc(doc(db, `food/${category}/items`, id));
                displaySuccessMessage('Product deleted successfully!');
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error.message);
                displayErrorMessage('Failed to delete product.');
            }
        }
    });
}
window.deleteProduct = deleteProduct; // Ensure it's globally accessible