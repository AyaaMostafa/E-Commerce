import { db } from "../../Script/firebase-config.js";
import { collection, getDocs, setDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
 
// Function to display success/error messages
function displaySuccessMessage(message) {
    Swal.fire({ icon: 'success', title: 'Success', text: message, background: '#2a2a2a', color: '#fff', confirmButtonColor: '#ff7e3f' });
}
 
function displayErrorMessage(message) {
    Swal.fire({ icon: 'error', title: 'Error', text: message, background: '#2a2a2a', color: '#fff', confirmButtonColor: '#ff7e3f' });
}
 
// Check if user is admin on page load
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Current User:", user); // Debugging
    if (!user || user.accountType !== "admin") {
        displayErrorMessage("Unauthorized access!");
        setTimeout(() => window.location.href = "../../index.html", 1500);
    }
});
 
// Logout function
window.logout = function() {
    localStorage.removeItem("currentUser");
    displaySuccessMessage("Logged out successfully!");
    setTimeout(() => {
        window.location.href = "../../index.html";
    }, 1500);
};
 
// --- Add Admin ---
const addAdminForm = document.getElementById("addAdminForm");
 
addAdminForm.onsubmit = async function(event) {
    event.preventDefault();
    console.log("Add Admin Form Submitted"); // Debugging
 
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
        addAdminForm.reset();
    } catch (error) {
        console.error("Error adding admin:", error); // Debugging
        displayErrorMessage(`Failed to add admin: ${error.message}`);
    }
};