
document.addEventListener('DOMContentLoaded', function() {
    const burgerData = [
      {
        image: "Resources/download (2).jpg",
        title: "Classic Beef Burger",
        price: 79,
        description: "Juicy beef patty with fresh vegetables and special sauce"
      },
      {
        image: "Resources/download (4).jpg",
        title: "Cheese Burger",
        price: 85,
        description: "Beef patty with melted cheese and crispy bacon"
      },
      {
        image: "Resources/download (1).jpg",
        title: "Spicy Chicken Burger",
        price: 89,
        description: "Spicy grilled chicken with mayo and fresh lettuce"
      }
    ];
  
    const burgerContainer = document.getElementById("burgerProducts");
    
    burgerData.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      
      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 overflow-hidden">
          <div class="ratio ratio-16x9">
            <img src="${item.image}" class="card-img-top object-fit-cover" alt="${item.title}">
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">${item.title}</h5>
            <p class="card-text text-muted">${item.description}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="h5 text-primary fw-bold">EGP ${item.price}</span>
              <button class="btn btn-primary rounded-pill px-4">Order Now</button>
            </div>
          </div>
        </div>
      `;
      
      burgerContainer.appendChild(col);
    });
  });