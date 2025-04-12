
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 3000
    });
}


const softDrinksData = [
    {
        image: "Resources/download (7).jpg",
        title: "Cola",
        price: 25,
        description: "Classic cola with ice"
    },
    {
        image: "Resources/download (7).jpg",
        title: "Lemon-Lime",
        price: 25,
        description: "Refreshing citrus flavor"
    },
    {
        image: "Resources/download (7).jpg",
        title: "Orange Soda",
        price: 25,
        description: "Fizzy orange flavor"
    },
    {
        image: "Resources/download (7).jpg",
        title: "Ginger Ale",
        price: 30,
        description: "Smooth ginger flavor"
    }
];


const products = document.getElementById("products");
if (products) {
    products.innerHTML = "";
    softDrinksData.forEach(item => {
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