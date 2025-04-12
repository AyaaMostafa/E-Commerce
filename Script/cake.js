import { createCard } from './../components/productCard.js';  

function loadCakeProducts() {
    const cakeData = [
        {
            image: "/Resources/download (10).jpg",
            title: "Chocolate Cake",
            price: 90,
            description: "Decadent chocolate cake with a rich cocoa flavor."
        },
        {
            image: "/Resources/download (10).jpg",
            title: "Vanilla Cake",
            price: 85,
            description: "Classic vanilla cake with creamy buttercream frosting."
        },
        {
            image: "/Resources/download (10).jpg",
            title: "Red Velvet Cake",
            price: 100,
            description: "Moist red velvet cake with cream cheese frosting."
        },
        {
            image: "/Resources/download (10).jpg",
            title: "Strawberry Cake",
            price: 95,
            description: "Light and fluffy cake with fresh strawberry topping."
        }
    ];

    const cakeProducts = document.getElementById("cakeProducts");

    if (cakeProducts) {
        cakeProducts.innerHTML = "";  
        cakeData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            cakeProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadCakeProducts();
