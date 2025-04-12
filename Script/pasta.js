
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 3000
    });
}


const pastaData = [
    {
        image: "Resources/download (6).jpg",
        title: "Spaghetti Bolognese",
        price: 95,
        description: "Classic spaghetti with rich meat sauce"
    },
    {
        image: "Resources/download (6).jpg",
        title: "Fettuccine Alfredo",
        price: 105,
        description: "Creamy Alfredo sauce with fettuccine pasta"
    },
    {
        image: "Resources/download (6).jpg",
        title: "Penne Arrabbiata",
        price: 85,
        description: "Penne pasta with spicy tomato sauce"
    },
    {
        image: "Resources/download (6).jpg",
        title: "Lasagna",
        price: 110,
        description: "Layers of pasta, meat sauce, and cheese"
    }
];

const products = document.getElementById("products");
if (products) {
    products.innerHTML = "";
    pastaData.forEach(pasta => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${pasta.image}" class="card-img-top" alt="${pasta.title}">
                <div class="card-body">
                    <h5 class="card-title">${pasta.title}</h5>
                    <p class="card-text">${pasta.description}</p>
                    <p class="text-primary fw-bold">EGP ${pasta.price}</p>
                    <button class="btn btn-primary">Add to Order</button>
                </div>
            </div>
        `;
        products.appendChild(col);
    });
}