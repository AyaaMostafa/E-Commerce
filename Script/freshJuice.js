
import { createCard } from './../components/productCard.js';  // Assuming the same function is used

function loadJuiceProducts() {
    const juiceData = [
        {
            image: "/Resources/images (1).jpg",
            title: "Orange Juice",
            price: 40,
            description: "Freshly squeezed oranges"
        },
        {
            image: "/Resources/images (1).jpg",
            title: "Watermelon Juice",
            price: 45,
            description: "Refreshing watermelon"
        },
        {
            image: "/Resources/images (1).jpg",
            title: "Carrot Juice",
            price: 50,
            description: "Healthy carrot blend"
        },
        {
            image: "/Resources/images (1).jpg",
            title: "Strawberry Juice",
            price: 55,
            description: "Sweet strawberry delight"
        }
    ];

    const juiceProducts = document.getElementById("juiceProducts");

    if (juiceProducts) {
        juiceProducts.innerHTML = "";  
        juiceData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            juiceProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadJuiceProducts();
