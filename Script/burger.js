import { createCard } from './../components/productCard.js';

function loadBurgerProducts() {
  const burgerData = [
    {
      image: "/Resources/download (2).jpg",
      title: "Classic Beef Burger",
      price: 79,
      description: "Juicy beef patty with fresh vegetables and special sauce"
    },
    
    {
      image: "/Resources/download (4).jpg",
      title: "Cheese Burger",
      price: 85,
      description: "Beef patty with melted cheese and crispy bacon"
    },
    {
      image: "/Resources/download (1).jpg",
      title: "Spicy Chicken Burger",
      price: 89,
      description: "Spicy grilled chicken with mayo and fresh lettuce"
    }
  ];

  const burgerProducts = document.getElementById("burgerProducts");
  if (burgerProducts) {
    burgerProducts.innerHTML = "";
    for (let product of burgerData) {
      let productCard = createCard(product.title, product.price, product.image);
      burgerProducts.appendChild(productCard);
    }
  } else {
    console.error("Products container not found");
  }
}

loadBurgerProducts(); 
