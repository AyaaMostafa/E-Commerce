
const carouselElement = document.getElementById("mainCarousel");
if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 3000
    });
}

const sandwichData = [
    {
        image: "Resources/download (5).jpg",
        title: "Club Sandwich",
        price: 65,
        description: "Turkey, bacon, lettuce, tomato, and mayo on toasted bread"
    },
    {
        image: "Resources/download (5).jpg",
        title: "Chicken Caesar Wrap",
        price: 70,
        description: "Grilled chicken, romaine, parmesan, and Caesar dressing"
    },
    {
        image: "Resources/download (5).jpg",
        title: "Veggie Sandwich",
        price: 55,
        description: "Avocado, cucumber, sprouts, and hummus on multigrain"
    }
];

const products = document.getElementById("products");
if (products) {
    products.innerHTML = "";
    sandwichData.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
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