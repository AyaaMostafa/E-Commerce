

document.body.addEventListener("click", function (e) {
    if (e.target.id === "favorite-icon") {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");
        console.log(e.target);
        window.location.href = `../Pages/favorite/favorite.html?email=${email}`;
    }
});
