import { createCard } from '../components/productCard.js';  

function loadBrowniesCookiesProducts() {
    const browniesCookiesData = [
        {
            image: "/Resources/download (11).jpg",
            title: "Chocolate Brownie",
            price: 70,
            description: "Rich and fudgy chocolate brownie with walnuts."
        },
        {
            image: "/Resources/download (11).jpg",
            title: "Chocolate Chip Cookies",
            price: 50,
            description: "Classic soft cookies with gooey chocolate chips."
        },
        {
            image: "/Resources/download (11).jpg",
            title: "Caramel Brownie",
            price: 75,
            description: "Decadent brownie topped with a layer of rich caramel."
        },
        {
            image: "/Resources/download (11).jpg",
            title: "Oatmeal Cookies",
            price: 55,
            description: "Chewy oatmeal cookies with raisins and cinnamon."
        }
    ];

    const browniesCookiesProducts = document.getElementById("browniesCookiesProducts");

    if (browniesCookiesProducts) {
        browniesCookiesProducts.innerHTML = "";  
        browniesCookiesData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            browniesCookiesProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadBrowniesCookiesProducts();
