
import { createCard } from './../components/productCard.js'; 

function loadSoftDrinksProducts() {
 
    const softDrinksData = [
        {
                image: "/Resources/download (7).jpg",
                title: "Cola",
                price: 25,
                description: "Classic cola with ice"
            },
            {
                image: "/Resources/download (7).jpg",
                title: "Lemon-Lime",
                price: 25,
                description: "Refreshing citrus flavor"
            },
            {
                image: "/Resources/download (7).jpg",
                title: "Orange Soda",
                price: 25,
                description: "Fizzy orange flavor"
            },
            {
                image: "/Resources/download (7).jpg",
                title: "Ginger Ale",
                price: 30,
                description: "Smooth ginger flavor"
            }
    ];

    const softDrinksProducts = document.getElementById("softDrinksProducts");

    if (softDrinksProducts) {
        softDrinksProducts.innerHTML = "";  

   
        softDrinksData.forEach(product => {
        
            let productCard = createCard(product.title, product.price, product.image);
            softDrinksProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadSoftDrinksProducts();
