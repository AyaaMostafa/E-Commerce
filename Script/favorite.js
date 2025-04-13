import { createCard } from './../components/productCard.js';  

function loadFavoriteProducts() {
    const favoriteData = [
        {
            image: "/Resources/fav1.jpg",
            title: "Chocolate Cake",
            price: 90,
            description: "Decadent chocolate cake with a rich cocoa flavor."
        }
    ];

    const favoriteProducts = document.getElementById("favoriteProducts");

    if (favoriteProducts) {
        favoriteProducts.innerHTML = "";  
        favoriteData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            favoriteProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadFavoriteProducts();
