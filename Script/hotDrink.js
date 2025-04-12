
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 3000
    });
}

const hotDrinksData = [
    {
        image: "Resources/download (8).jpg",
        title: "Coffee",
        price: 35,
        description: "Freshly brewed arabica coffee"
    },
    {
        image: "Resources/download (8).jpg",
        title: "Tea",
        price: 30,
        description: "Premium tea leaves"
    },
    {
        image: "Resources/download (8).jpg",
        title: "Hot Chocolate",
        price: 40,
        description: "Rich chocolate drink"
    },
    {
        image: "Resources/download (8).jpg",
        title: "Cappuccino",
        price: 45,
        description: "Espresso with steamed milk"
    }
];


const products = document.getElementById("products");
if (products) {
    products.innerHTML = "";
    hotDrinksData.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${item.image}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="text-primary fw-bold">EGP ${item.price}</p>
                    <button class="btn btn-primary">Add to Order</button>
                </div>
            </div>
        `;
        products.appendChild(col);
    });
}