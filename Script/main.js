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

forgotPasswordLink.onclick = function(event) {
    event.preventDefault();
    const emailInput = authenticationForm.querySelector('input[type="email"]').value;
    if (!emailInput) return displayErrorMessage("Please enter your email.");

    firebase.database().ref("users").orderByChild("email").equalTo(emailInput).once("value")
        .then(function(snapshot) {
            if (!snapshot.exists()) return displayErrorMessage("Email not found.");

            const newPassword = Math.random().toString(36).slice(-8);
            const encryptedNewPassword = encryptPassword(newPassword);

            snapshot.forEach(function(child) {
                firebase.database().ref("users/" + child.key).update({ password: encryptedNewPassword });
            });

            displaySuccessMessage(`Your new password is: ${newPassword}`);
        })
        .catch(function(error) {
            displayErrorMessage("Error resetting password.");
        });
};

authenticationForm.onsubmit = function(event) {
    event.preventDefault();

    const emailInput = authenticationForm.querySelector('input[type="email"]').value;
    const passwordInput = authenticationForm.querySelector('input[type="password"]').value;
    const encryptedPassword = encryptPassword(passwordInput);

    if (isSignUpMode) {
        const userName = nameInputSection.querySelector("input").value;
        const userPhone = phoneInputSection.querySelector("input").value;
        const userLocation = locationInputSection.querySelector("input").value;
        const emailKey = emailInput.toLowerCase().replace(/\./g, "_");

        firebase.database().ref("admins/" + emailKey).once("value")
            .then(function(adminSnapshot) {
                const userType = adminSnapshot.exists() ? "admin" : "client";

                firebase.database().ref("users").orderByChild("email").equalTo(emailInput).once("value")
                    .then(function(userSnapshot) {
                        if (userSnapshot.exists()) return displayErrorMessage("Email already registered.");

                        const userData = {
                            name: userName,
                            email: emailInput,
                            password: encryptedPassword,
                            phone: userPhone,
                            location: userLocation,
                            accountType: userType
                        };

                        firebase.database().ref("users").push(userData);
                        displaySuccessMessage("Signup successful!");
                        authenticationForm.reset();
                        modalWindow.style.display = "none";
                    })
                    .catch(function(error) {
                        displayErrorMessage("Signup failed.");
                    });
            })
            .catch(function(error) {
                displayErrorMessage("Failed to check admin status.");
            });
    } else {
        firebase.database().ref("users").orderByChild("email").equalTo(emailInput).once("value")
            .then(function(snapshot) {
                if (!snapshot.exists()) return displayErrorMessage("Email not found.");

                let userData;
                snapshot.forEach(function(child) {
                    userData = child.val();
                });

                if (userData.password !== encryptedPassword) return displayErrorMessage("Incorrect password.");

                displaySuccessMessage(userData.accountType === "admin" ? "Welcome Admin!" : "Welcome Client!");
                setTimeout(function() {
                    window.location.href = userData.accountType === "admin" ? "admin.html" : "../app/app.html";
                }, 1500);

                authenticationForm.reset();
                modalWindow.style.display = "none";
            })
            .catch(function(error) {
                displayErrorMessage("Login failed.");
            });
    }
};