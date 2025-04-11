
import { createCard } from './../components/productCard.js';


// Initialize Bootstrap carousel after content is loaded
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 2000
    });
}


let data = [
    {
        image: "../Resources/1.png",
        title: "Card Title 1",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 2",
        price: 399
    },
    {
        image: "../Resources/1.png",
        title: "Card Title 3",
        price: 399
    }
];

const products = document.getElementById("products");
    if (products) {
        products.innerHTML = "";
        for (let product of data) {
            let productCard = createCard(product.title, product.price, product.image);
            products.appendChild(productCard);
        }
    } else {
        console.error("Products container not found");
    }
