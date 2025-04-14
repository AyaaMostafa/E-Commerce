import { db } from "./firebase-config.js";
import { collection, getDocs, setDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
// Select DOM elements
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const modal = document.getElementById("popupModal");
const closeModalBtn = document.getElementById("closeModal");
const formTitle = document.getElementById("formTitle");
const nameField = document.getElementById("nameField");
const phoneField = document.getElementById("phoneField");
const locationField = document.getElementById("locationField");
const authForm = document.getElementById("authForm");
const authButtons = document.getElementById("authButtons");
const logoutButton = document.getElementById("logoutButton");
<<<<<<< Updated upstream

let isSignupMode = false;

=======
 
let isSignupMode = false;
 
>>>>>>> Stashed changes
// Utility Functions
const showSuccess = (message) => Swal.fire({ icon: "success", title: "Success", text: message, background: "#2a2a2a", color: "#fff", confirmButtonColor: "#ff7e3f" });
const showError = (message) => Swal.fire({ icon: "error", title: "Error", text: message, background: "#2a2a2a", color: "#fff", confirmButtonColor: "#ff7e3f" });
const encryptPassword = (password) => CryptoJS.SHA256(password).toString();
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
// Toggle Modal Visibility
const toggleModal = (show, title, showExtraFields) => {
    modal.style.display = show ? "flex" : "none";
    formTitle.textContent = title;
    nameField.classList.toggle("hidden", !showExtraFields);
    phoneField.classList.toggle("hidden", !showExtraFields);
    locationField.classList.toggle("hidden", !showExtraFields);
    if (!show) authForm.reset();
};
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
// Check Login Status on Page Load
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        authButtons.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        authButtons.style.display = "block";
        logoutButton.style.display = "none";
    }
});
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
// Event Listeners for Buttons
signupBtn.onclick = () => {
    isSignupMode = true;
    toggleModal(true, "Register", true);
    document.getElementById("fullName").required = true;
    document.getElementById("phone").required = true;
    document.getElementById("location").required = true;
};
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
loginBtn.onclick = () => {
    isSignupMode = false;
    toggleModal(true, "Login", false);
    document.getElementById("fullName").required = false;
    document.getElementById("phone").required = false;
    document.getElementById("location").required = false;
};
<<<<<<< Updated upstream

closeModalBtn.onclick = () => toggleModal(false);
window.onclick = (event) => { if (event.target === modal) toggleModal(false); };

=======
 
closeModalBtn.onclick = () => toggleModal(false);
window.onclick = (event) => { if (event.target === modal) toggleModal(false); };
 
>>>>>>> Stashed changes
// Logout Functionality
logoutBtn.onclick = () => {
    localStorage.removeItem("currentUser");
    showSuccess("Logged out successfully!");
    setTimeout(() => window.location.href = "index.html", 1500);
};
<<<<<<< Updated upstream

// Form Submission (Login or Register)
authForm.onsubmit = async (event) => {
    event.preventDefault();

    const email = authForm.querySelector('input[type="email"]').value.trim();
    const password = authForm.querySelector('input[type="password"]').value;
    const encryptedPassword = encryptPassword(password);

=======
 
// Form Submission (Login or Register)
authForm.onsubmit = async (event) => {
    event.preventDefault();
 
    const email = authForm.querySelector('input[type="email"]').value.trim();
    const password = authForm.querySelector('input[type="password"]').value;
    const encryptedPassword = encryptPassword(password);
 
>>>>>>> Stashed changes
    // Validation for Both Modes
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return showError("Please enter a valid email address.");
    if (!password || password.length < 6) return showError("Password must be at least 6 characters long.");
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
    if (isSignupMode) {
        // Register Mode
        const name = nameField.querySelector("input").value.trim();
        const phone = phoneField.querySelector("input").value.trim();
        const location = locationField.querySelector("input").value.trim();
        const emailKey = email.toLowerCase().replace(/\./g, "_");
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
        // Validation for Register
        if (!name || name.length < 3) return showError("Full name must be at least 3 characters long.");
        const phoneRegex = /^\d{10,15}$/;
        if (!phone || !phoneRegex.test(phone)) return showError("Please enter a valid phone number (10-15 digits).");
        if (!location || location.length < 3) return showError("Location must be at least 3 characters long.");
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
        try {
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", email));
            const userSnapshot = await getDocs(userQuery);
<<<<<<< Updated upstream

            if (!userSnapshot.empty) return showError("Email already registered.");

            const userData = { name, email, password: encryptedPassword, phone, location, accountType: "client" };
            await setDoc(doc(db, "users", emailKey), userData);

=======
 
            if (!userSnapshot.empty) return showError("Email already registered.");
 
            const userData = { name, email, password: encryptedPassword, phone, location, accountType: "client" };
            await setDoc(doc(db, "users", emailKey), userData);
 
>>>>>>> Stashed changes
            showSuccess("Registration successful! You can now log in.");
            toggleModal(false);
        } catch (error) {
            showError("Registration failed. Please try again.");
        }
    } else {
        // Login Mode
        try {
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", email));
            const userSnapshot = await getDocs(userQuery);
<<<<<<< Updated upstream

            if (userSnapshot.empty) return showError("Email not found.");

            let userData = null;
            userSnapshot.forEach(doc => userData = doc.data());

            if (userData.password !== encryptedPassword) return showError("Incorrect password.");

            localStorage.setItem("currentUser", JSON.stringify(userData));
            showSuccess(`Welcome, ${userData.name}!`);

            // Redirect based on account type
            const redirectUrl = userData.accountType === "admin" ? "../Pages/adminDashboard/adminDasboard.html" : "app/app.html";
            setTimeout(() => window.location.href = redirectUrl, 1000);

=======
 
            if (userSnapshot.empty) return showError("Email not found.");
 
            let userData = null;
            userSnapshot.forEach(doc => userData = doc.data());
 
            if (userData.password !== encryptedPassword) return showError("Incorrect password.");
 
            localStorage.setItem("currentUser", JSON.stringify(userData));
            showSuccess(`Welcome, ${userData.name}!`);
 
            // Redirect based on account type
            const redirectUrl = userData.accountType === "admin" ? "../Pages/adminDashboard/adminDasboard.html" : "app/app.html";
            setTimeout(() => window.location.href = redirectUrl, 1000);
 
>>>>>>> Stashed changes
            toggleModal(false);
        } catch (error) {
            showError("Login failed. Please try again.");
        }
    }
};