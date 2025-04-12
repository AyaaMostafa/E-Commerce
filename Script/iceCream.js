import { createCard } from './../components/productCard.js';  

function loadIceCreamProducts() {
    const iceCreamData = [
        {
            image: "/Resources/download (9).jpg",
            title: "Spaghetti Bolognese",
            price: 95,
            description: "Classic spaghetti with rich meat sauce"
        },
        {
            image: "/Resources/download (9).jpg",
            title: "Fettuccine Alfredo",
            price: 105,
            description: "Creamy Alfredo sauce with fettuccine pasta"
        },
        {
            image: "/Resources/download (9).jpg",
            title: "Penne Arrabbiata",
            price: 85,
            description: "Penne pasta with spicy tomato sauce"
        },
        {
            image: "/Resources/download (9).jpg",
            title: "Lasagna",
            price: 110,
            description: "Layers of pasta, meat sauce, and cheese"
        }
    ];

    const iceCreamProducts = document.getElementById("iceCreamProducts");

    if (iceCreamProducts) {
        iceCreamProducts.innerHTML = "";  
        iceCreamData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            iceCreamProducts.appendChild(productCard);  
        });
    } else {
        console.error("Products container not found");
    }
}

loadIceCreamProducts();
