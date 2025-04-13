import { createCard } from './../components/productCard.js';  

function loadMainCourses() {
    const mainCoursesData = [
        {
            image: "/Resources/images (3).jpg",
            title: "Grilled Chicken",
            price: 120,
            description: "Juicy grilled chicken breast served with vegetables."
        },
        {
            image: "/Resources/images (3).jpg",
            title: "Beef Steak",
            price: 150,
            description: "Tender beef steak cooked to your liking with sauce."
        },
        {
            image: "/Resources/images (3).jpg",
            title: "Spaghetti Bolognese",
            price: 100,
            description: "Classic Italian spaghetti with beef bolognese sauce."
        },
        {
            image: "/Resources/images (3).jpg",
            title: "Fish Fillet",
            price: 110,
            description: "Crispy fish fillet served with lemon butter sauce."
        }
    ];

    const mainCoursesProducts = document.getElementById("mainCoursesProducts");

    if (mainCoursesProducts) {
        mainCoursesProducts.innerHTML = "";  
        mainCoursesData.forEach(product => {
            let productCard = createCard(product.title, product.price, product.image);
            mainCoursesProducts.appendChild(productCard);
        });
    } else {
        console.error("Products container not found");
    }
}

loadMainCourses();
