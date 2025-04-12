
import { createCard } from './../components/productCard.js';  

function loadHotDrinksProducts() {
   
    const hotDrinksData = [
        {
                    image: "/Resources/download (8).jpg",
                    title: "Coffee",
                    price: 35,
                    description: "Freshly brewed arabica coffee"
                },
                {
                    image: "/Resources/download (8).jpg",
                    title: "Tea",
                    price: 30,
                    description: "Premium tea leaves"
                },
                {
                    image: "/Resources/download (8).jpg",
                    title: "Hot Chocolate",
                    price: 40,
                    description: "Rich chocolate drink"
                },
                {
                    image: "/Resources/download (8).jpg",
                    title: "Cappuccino",
                    price: 45,
                    description: "Espresso with steamed milk"
                }
    ];

    const hotDrinksProducts = document.getElementById("hotDrinksProducts");

    if (hotDrinksProducts) {
        hotDrinksProducts.innerHTML = "";  
        hotDrinksData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            hotDrinksProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadHotDrinksProducts();
