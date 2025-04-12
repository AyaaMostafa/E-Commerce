
import { createCard } from './../components/productCard.js';  

function loadSandwichProducts() {
    const sandwichData = [
        {
        image: "/Resources/download (5).jpg",
                title: "Club Sandwich",
                price: 65,
                description: "Turkey, bacon, lettuce, tomato, and mayo on toasted bread"
            },
            {
                image: "/Resources/download (5).jpg",
                title: "Chicken Caesar Wrap",
                price: 70,
                description: "Grilled chicken, romaine, parmesan, and Caesar dressing"
            },
            {
                image: "/Resources/download (5).jpg",
                title: "Veggie Sandwich",
                price: 55,
                description: "Avocado, cucumber, sprouts, and hummus on multigrain"
            }
    ];

    const sandwichProducts = document.getElementById("sandwichProducts");

    if (sandwichProducts) {
        sandwichProducts.innerHTML = "";  
        sandwichData.forEach(product => {
    
            let productCard = createCard(product.title, product.price, product.image);
            sandwichProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadSandwichProducts();
