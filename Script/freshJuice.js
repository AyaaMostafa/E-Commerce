
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 3000
    });
}

const freshJuiceData = [
    {
        image: "Resources/images (1).jpg",
        title: "Orange Juice",
        price: 40,
        description: "Freshly squeezed oranges"
    },
    {
        image: "Resources/images (1).jpg",
        title: "Watermelon Juice",
        price: 45,
        description: "Refreshing watermelon"
    },
    {
        image: "Resources/images (1).jpg",
        title: "Carrot Juice",
        price: 50,
        description: "Healthy carrot blend"
    },
    {
        image: "Resources/images (1).jpg",
        title: "Strawberry Juice",
        price: 55,
        description: "Sweet strawberry delight"
    }
];

const products = document.getElementById("products");
if (products) {
    products.innerHTML = "";
    freshJuiceData.forEach(item => {
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