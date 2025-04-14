import { db } from "./firebase-config.js";
import { collection, getDocs, setDoc, doc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const signUpButton = document.getElementById("signupBtn");
const loginButton = document.getElementById("loginBtn");
const modalWindow = document.getElementById("popupModal");
const closeModalButton = document.getElementById("closeModal");
const formTitleText = document.getElementById("formTitle");
const nameInputSection = document.getElementById("nameField");
const phoneInputSection = document.getElementById("phoneField");
const locationInputSection = document.getElementById("locationField");
const authenticationForm = document.getElementById("authForm");
const forgotPasswordSection = document.getElementById("forgotPassword");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

let isSignUpMode = false;

function encryptPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

function displaySuccessMessage(message) {
    Swal.fire({ icon: 'success', title: 'Success', text: message, background: '#2a2a2a', color: '#fff', confirmButtonColor: '#ff7e3f' });
}

function displayErrorMessage(message) {
    Swal.fire({ icon: 'error', title: 'Error', text: message, background: '#2a2a2a', color: '#fff', confirmButtonColor: '#ff7e3f' });
}

signUpButton.onclick = function() {
    modalWindow.style.display = "flex";
    formTitleText.innerText = "Sign Up";
    nameInputSection.classList.remove("hidden");
    phoneInputSection.classList.remove("hidden");
    locationInputSection.classList.remove("hidden");
    forgotPasswordSection.classList.add("hidden");
    isSignUpMode = true;
    document.getElementById("fullName").required = true;
    document.getElementById("phone").required = true;
    document.getElementById("location").required = true;
};

loginButton.onclick = function() {
    modalWindow.style.display = "flex";
    formTitleText.innerText = "Login";
    nameInputSection.classList.add("hidden");
    phoneInputSection.classList.add("hidden");
    locationInputSection.classList.add("hidden");
    forgotPasswordSection.classList.remove("hidden");
    isSignUpMode = false;
    document.getElementById("fullName").required = false;
    document.getElementById("phone").required = false;
    document.getElementById("location").required = false;
};

closeModalButton.onclick = function() {
    modalWindow.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modalWindow) modalWindow.style.display = "none";
};

forgotPasswordLink.onclick = async function(event) {
    event.preventDefault();
    const emailInput = authenticationForm.querySelector('input[type="email"]').value;
    if (!emailInput) return displayErrorMessage("Please enter your email.");

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", emailInput));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return displayErrorMessage("Email not found.");

        const newPassword = Math.random().toString(36).slice(-8);
        const encryptedNewPassword = encryptPassword(newPassword);

        querySnapshot.forEach(async (docSnapshot) => {
            await updateDoc(doc(db, "users", docSnapshot.id), {
                password: encryptedNewPassword
            });
        });

        displaySuccessMessage(`Your new password is: ${newPassword}`);
    } catch (error) {
        displayErrorMessage("Error resetting password.");
    }
};

authenticationForm.onsubmit = async function(event) {
    event.preventDefault();

    const emailInput = authenticationForm.querySelector('input[type="email"]').value;
    const passwordInput = authenticationForm.querySelector('input[type="password"]').value;
    const encryptedPassword = encryptPassword(passwordInput);

    if (isSignUpMode) {
        const userName = nameInputSection.querySelector("input").value;
        const userPhone = phoneInputSection.querySelector("input").value;
        const userLocation = locationInputSection.querySelector("input").value;
        const emailKey = emailInput.toLowerCase().replace(/\./g, "_");

        try {
            // Check if email exists in admin collection (corrected from admins to admin)
            const adminsRef = collection(db, "admin");
            const adminQuery = query(adminsRef, where("email", "==", emailInput));
            const adminSnapshot = await getDocs(adminQuery);
            const userType = !adminSnapshot.empty ? "admin" : "client";

            // Check if email is already registered in users collection
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", emailInput));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) return displayErrorMessage("Email already registered.");

            const userData = {
                name: userName,
                email: emailInput,
                password: encryptedPassword,
                phone: userPhone,
                location: userLocation,
                accountType: userType
            };

            // Add user to Firestore (using emailKey as document ID)
            await setDoc(doc(db, "users", emailKey), userData);

            displaySuccessMessage("Signup successful!");
            authenticationForm.reset();
            modalWindow.style.display = "none";
        } catch (error) {
            displayErrorMessage("Signup failed.");
        }
    } else {
        try {
            let userData = null;
            let accountType = null;

            // First, check in admin collection
            const adminsRef = collection(db, "admin");
            const adminQuery = query(adminsRef, where("email", "==", emailInput));
            const adminSnapshot = await getDocs(adminQuery);

            if (!adminSnapshot.empty) {
                adminSnapshot.forEach(doc => {
                    userData = doc.data();
                    accountType = "admin"; // Force accountType to admin if found in admin collection
                });
            }

            // If not found in admin, check in users collection
            if (!userData) {
                const usersRef = collection(db, "users");
                const userQuery = query(usersRef, where("email", "==", emailInput));
                const userSnapshot = await getDocs(userQuery);

                if (userSnapshot.empty) return displayErrorMessage("Email not found.");

                userSnapshot.forEach(doc => {
                    userData = doc.data();
                    accountType = userData.accountType || "client"; // Use accountType from users, default to client
                });
            }

            // Compare the encrypted password
            if (userData.password !== encryptedPassword) return displayErrorMessage("Incorrect password.");

            // Show success message based on account type
            displaySuccessMessage(accountType === "admin" ? "Welcome Admin!" : "Welcome Client!");
            setTimeout(function() {
                window.location.href = accountType === "admin" ? "admin.html" : "../app/app.html";
            }, 1500);

            authenticationForm.reset();
            modalWindow.style.display = "none";
        } catch (error) {
            console.error("Login error:", error); // Log the error for debugging
            displayErrorMessage("Login failed.");
        }
    }
};