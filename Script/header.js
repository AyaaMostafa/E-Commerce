

document.body.addEventListener("click", function (e) {
    if (e.target.id === "favorite-icon") {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");
        console.log(e.target);
        window.location.href = `../Pages/favorite/favourite.html?email=${email}`;
    }
});

document.body.addEventListener("click", function (e) {
    if (e.target.id === "cart-icon") {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");
        console.log(e.target);
        window.location.href = `../Pages/cart/cart.html?email=${email}`;
    }
});
