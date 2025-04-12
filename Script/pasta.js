
import { createCard } from './../components/productCard.js';  

function loadPastaProducts() {
    const pastaData = [
        {
                            image: "/Resources/download (6).jpg",
                            title: "Spaghetti Bolognese",
                            price: 95,
                            description: "Classic spaghetti with rich meat sauce"
                        },
                        {
                            image: "/Resources/download (6).jpg",
                            title: "Fettuccine Alfredo",
                            price: 105,
                            description: "Creamy Alfredo sauce with fettuccine pasta"
                        },
                        {
                            image: "/Resources/download (6).jpg",
                            title: "Penne Arrabbiata",
                            price: 85,
                            description: "Penne pasta with spicy tomato sauce"
                        },
                        {
                            image: "/Resources/download (6).jpg",
                            title: "Lasagna",
                            price: 110,
                            description: "Layers of pasta, meat sauce, and cheese"
                        }
    ];

    const pastaProducts = document.getElementById("pastaProducts");

    if (pastaProducts) {
        pastaProducts.innerHTML = "";  
        pastaData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            pastaProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadPastaProducts();

