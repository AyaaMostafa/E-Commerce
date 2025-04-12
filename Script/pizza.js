import { createCard } from './../components/productCard.js';

function loadPizzaProducts() {
    const pizzaData = [
        {
            image: "/Resources/download (4).jpg",
            title: "Margherita Pizza",
            price: 120,
            description: "Classic tomato sauce, mozzarella, and basil"
        },
        {
            image: "/Resources/download (4).jpg",
            title: "Pepperoni Pizza",
            price: 140,
            description: "Tomato sauce, mozzarella, and spicy pepperoni"
        },
        {
            image: "/Resources/download (4).jpg",
            title: "Veggie Pizza",
            price: 130,
            description: "Tomato sauce, mozzarella, and fresh vegetables"
        },
        {
            image: "/Resources/download (4).jpg",
            title: "Hawaiian Pizza",
            price: 150,
            description: "Tomato sauce, mozzarella, ham, and pineapple"
        }
    ];

    const pizzaProducts = document.getElementById("pizzaProducts");
    
    if (pizzaProducts) {
        pizzaProducts.innerHTML = "";
        for (let product of pizzaData) {
            let productCard = createCard(product.title, product.price, product.image);
            pizzaProducts.appendChild(productCard);
        }
    } else {
        console.error("Products container not found");
    }
}

loadPizzaProducts(); 
