import { createCard } from './../components/productCard.js';  

function loadBeverageProducts() {
    const beverageData = [
        {
            image: "/Resources/3486150bde41be56fbbc0f49791a423f.jpg",
            title: "Fresh Orange Juice",
            price: 30,
            description: "Freshly squeezed orange juice served cold."
        },
        {
            image: "/Resources/3486150bde41be56fbbc0f49791a423f.jpg",
            title: "Iced Coffee",
            price: 35,
            description: "Cold brewed coffee with ice and cream."
        },
        {
            image: "/Resources/3486150bde41be56fbbc0f49791a423f.jpg",
            title: "Mango Smoothie",
            price: 40,
            description: "Blended mango smoothie with yogurt."
        },
        {
            image: "/Resources/3486150bde41be56fbbc0f49791a423f.jpg",
            title: "Mint Lemonade",
            price: 28,
            description: "Chilled lemonade with fresh mint leaves."
        }
    ];

    const beverageProducts = document.getElementById("beverageProducts");

    if (beverageProducts) {
        beverageProducts.innerHTML = "";  
        beverageData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            beverageProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadBeverageProducts();
