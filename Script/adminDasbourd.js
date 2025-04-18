import { db } from './firebase-config.js';
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

const showMessage = (type, message) => {
    Swal.fire({ 
        icon: type, 
        title: type === 'success' ? 'Success' : 'Error', 
        text: message, 
        background: '#2a2a2a', 
        color: '#fff', 
        confirmButtonColor: '#ff7e3f',
        timer: type === 'success' ? 1500 : undefined 
    });
};

async function loadCategories() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'food'));
        const categoryDropdown = document.getElementById('categoryDropdown');
        const editCategoryDropdown = document.getElementById('editCategoryDropdown');
        categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
        editCategoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';

        categoriesSnapshot.forEach((docSnap) => {
            const category = docSnap.id;
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
        showMessage('error', 'Failed to load categories.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.accountType !== "admin") {
        showMessage('error', 'Unauthorized access!');
        setTimeout(() => window.location.href = "/index.html", 1500);
        return;
    }

    document.getElementById('adminMessage').textContent = `Welcome, ${user.name}! You are logged in as Admin.`;
    loadProducts();
    loadCategories();

    document.getElementById('logoutButton')?.addEventListener('click', logout);
    document.getElementById('addAdminButton')?.addEventListener('click', submitAddAdminForm);
    document.getElementById('editProductButton')?.addEventListener('click', submitEditProductForm);

    [document.getElementById('addAdminModal'), document.getElementById('manageProductsModal'), document.getElementById('editProductModal')].forEach(modal => {
        modal?.addEventListener('hidden.bs.modal', () => {
            document.querySelector(`[data-bs-target="#${modal.id}"]`)?.focus();
        });
    });
});

function logout() {
    localStorage.removeItem("currentUser");
    showMessage("success", "Logged out successfully!");
    setTimeout(() => window.location.href = "/index.html", 1500);
}
window.logout = logout;

async function submitAddAdminForm() {
    const name = document.getElementById("adminName").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const phone = document.getElementById("adminPhone").value.trim();
    const location = document.getElementById("adminLocation").value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('error', "Invalid email address.");
    if (password.length < 6) return showMessage('error', "Password must be at least 6 characters.");
    if (name.length < 3) return showMessage('error', "Name must be at least 3 characters.");
    if (!/^\d{10,15}$/.test(phone)) return showMessage('error', "Invalid phone number (10-15 digits).");
    if (location.length < 3) return showMessage('error', "Location must be at least 3 characters.");

    try {
        const encryptedPassword = CryptoJS.SHA256(password).toString();
        const emailKey = email.toLowerCase().replace(/\./g, "_");
        const userSnapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));
        if (!userSnapshot.empty) return showMessage('error', "Email already registered.");

        await setDoc(doc(db, "users", emailKey), { name, email, password: encryptedPassword, phone, location, accountType: "admin" });
        showMessage('success', "Admin added successfully!");
        document.getElementById("addAdminForm").reset();
        bootstrap.Modal.getInstance(document.getElementById('addAdminModal')).hide();
    } catch (error) {
        showMessage('error', "Failed to add admin.");
    }
}
window.submitAddAdminForm = submitAddAdminForm;

async function loadProducts() {
    try {
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '';
        const categoriesSnapshot = await getDocs(collection(db, 'food'));
        if (categoriesSnapshot.empty) {
            productsList.innerHTML = "<tr><td colspan='4' class='text-center'>No products found.</td></tr>";
            return;
        }

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
        showMessage('error', 'Failed to load products.');
    }
}

document.getElementById('addProductForm').onsubmit = async function(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    if (name.length < 3) return showMessage('error', 'Product name must be at least 3 characters.');
    if (isNaN(price) || price <= 0) return showMessage('error', 'Price must be greater than 0.');
    if (category.length < 2) return showMessage('error', 'Category must be at least 2 characters.');
    if (description.length < 10) return showMessage('error', 'Description must be at least 10 characters.');

    try {
        const productId = doc(collection(db, `food/${category}/items`)).id;
        await setDoc(doc(db, `food/${category}/items`, productId), { name, price, image, description });
        showMessage('success', 'Product added successfully!');
        document.getElementById('addProductForm').reset();
        loadProducts();
        loadCategories();
    } catch (error) {
        showMessage('error', 'Failed to add product.');
    }
};

function openEditProductModal(id, name, price, category, image, description) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductCategory').value = category;
    document.getElementById('editProductCategoryOriginal').value = category;
    document.getElementById('editProductImage').value = image;
    document.getElementById('editProductDescription').value = description;
    new bootstrap.Modal(document.getElementById('editProductModal')).show();
}
window.openEditProductModal = openEditProductModal;

async function submitEditProductForm() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const category = document.getElementById('editProductCategory').value.trim();
    const originalCategory = document.getElementById('editProductCategoryOriginal').value;
    const image = document.getElementById('editProductImage').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();

    if (name.length < 3) return showMessage('error', 'Product name must be at least 3 characters.');
    if (isNaN(price) || price <= 0) return showMessage('error', 'Price must be greater than 0.');
    if (category.length < 2) return showMessage('error', 'Category must be at least 2 characters.');
    if (description.length < 10) return showMessage('error', 'Description must be at least 10 characters.');

    try {
        if (category === originalCategory) {
            await updateDoc(doc(db, `food/${category}/items`, id), { name, price, image, description });
        } else {
            await deleteDoc(doc(db, `food/${originalCategory}/items`, id));
            const newProductId = doc(collection(db, `food/${category}/items`)).id;
            await setDoc(doc(db, `food/${category}/items`, newProductId), { name, price, image, description });
        }
        showMessage('success', 'Product updated successfully!');
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        loadProducts();
        loadCategories();
    } catch (error) {
        showMessage('error', 'Failed to update product.');
    }
}
window.submitEditProductForm = submitEditProductForm;

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
                showMessage('success', 'Product deleted successfully!');
                loadProducts();
            } catch (error) {
                showMessage('error', 'Failed to delete product.');
            }
        }
    });
}
window.deleteProduct = deleteProduct;