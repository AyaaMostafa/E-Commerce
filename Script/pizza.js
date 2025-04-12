
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 3000
    });
}


const pizzaData = [
    {
        image: "Resources/download (4).jpg",
        title: "Margherita Pizza",
        price: 120,
        description: "Classic tomato sauce, mozzarella, and basil"
    },
    {
        image: "Resources/download (4).jpg",
        title: "Pepperoni Pizza",
        price: 140,
        description: "Tomato sauce, mozzarella, and spicy pepperoni"
    },
    {
        image: "Resources/download (4).jpg",
        title: "Veggie Pizza",
        price: 130,
        description: "Tomato sauce, mozzarella, and fresh vegetables"
    },
    {
        image: "Resources/download (4).jpg",
        title: "Hawaiian Pizza",
        price: 150,
        description: "Tomato sauce, mozzarella, ham, and pineapple"
    }
];

const products = document.getElementById("products");
if (products) {
    products.innerHTML = "";
    pizzaData.forEach(pizza => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${pizza.image}" class="card-img-top" alt="${pizza.title}">
                <div class="card-body">
                    <h5 class="card-title">${pizza.title}</h5>
                    <p class="card-text">${pizza.description}</p>
                    <p class="text-primary fw-bold">EGP ${pizza.price}</p>
                    <button class="btn btn-primary">Add to Order</button>
                </div>
            </div>
        `;
        products.appendChild(col);
    });
}