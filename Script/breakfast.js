import { createCard } from './../components/productCard.js';  

function loadBreakfastProducts() {
    const breakfastData = [
        {
            image: "/Resources/download (12).jpg",
            title: "Pancakes",
            price: 50,
            description: "Fluffy pancakes served with maple syrup."
        },
        {
            image: "/Resources/download (12).jpg",
            title: "Omelette",
            price: 45,
            description: "Cheese and vegetable omelette cooked to perfection."
        },
        {
            image: "/Resources/download (12).jpg",
            title: "French Toast",
            price: 55,
            description: "Golden brown French toast topped with powdered sugar."
        },
        {
            image: "/Resources/download (12).jpg",
            title: "Fruit Bowl",
            price: 40,
            description: "Fresh seasonal fruits served chilled."
        }
    ];

    const breakfastProducts = document.getElementById("breakfastProducts");

    if (breakfastProducts) {
        breakfastProducts.innerHTML = "";  
        breakfastData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            breakfastProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}


loadBreakfastProducts();
