import { saveToFavorites, removeFromFavorites, addToCart } from './../Script/fetchProducts.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

// إضافة parameters جديدة: initialQuantity و updateCallback
export function createCard(title, price, image, description = "", initialQuantity = 1, updateCallback = null) {
    const card = document.createElement("div");
    card.className = "col-lg-3 col-md-6 col-sm-12 mb-5 pb-4 d-flex justify-content-center";

    const cardContent = document.createElement("div");
    cardContent.className = "card border border-light-subtle shadow-sm position-relative mb-5";

    // "Best Deal" Badge
    const badge = document.createElement("span");
    badge.className = "badge bg-danger position-absolute top-0 start-0 m-2";
    badge.style.fontSize = "0.65rem";
    badge.style.zIndex = "10";
    badge.style.padding = "0.3rem 0.6rem";
    badge.textContent = "Best Deal";
    cardContent.appendChild(badge);

    // ❤️ Favorite Icon (only if not in favourite.html or cart.html)
    const isSpecialPage = window.location.pathname.includes("favourite.html") || window.location.pathname.includes("cart.html");
    let favIcon;
    if (!isSpecialPage) {
        favIcon = document.createElement("i");
        favIcon.className = "bi bi-heart-fill position-absolute top-0 end-0 m-2 text-secondary";
        favIcon.style.cursor = "pointer";
        favIcon.style.fontSize = "1.4rem";
        favIcon.style.zIndex = "10";
        favIcon.title = "Add to Favorites";
        cardContent.appendChild(favIcon);
    }

    // Image
    if (image) {
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        img.className = "card-img-top p-4";
        img.style.objectFit = "contain";
        img.style.height = "200px";
        cardContent.appendChild(img);
    }

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body text-center px-3 pb-3";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title mb-2";
    cardTitle.style.fontSize = "1rem";
    cardTitle.textContent = title;

    const cardPrice = document.createElement("p");
    cardPrice.className = "card-text text-danger fw-bold mb-3";
    cardPrice.style.fontSize = "1.25rem";
    cardPrice.textContent = `${price}$`;

    // Optional description
    let descP;
    if (description) {
        descP = document.createElement("p");
        descP.className = "card-text text-muted small mb-2";
        descP.textContent = description;
        cardBody.appendChild(descP);
    }

    // Quantity controls (Gray buttons)
    const quantityGroup = document.createElement("div");
    quantityGroup.className = "input-group mb-3 mx-auto";
    quantityGroup.style.width = "10rem";

    let quantity = initialQuantity; // استخدام initialQuantity من Firestore
    const quantityInput = document.createElement("input");
    quantityInput.type = "text";
    quantityInput.className = "form-control text-center";
    quantityInput.value = quantity;
    quantityInput.readOnly = true;

    const minusBtn = document.createElement("button");
    minusBtn.className = "btn btn-outline-secondary";
    minusBtn.type = "button";
    minusBtn.textContent = "−";
    minusBtn.addEventListener("click", () => {
        console.log("Minus button clicked, current quantity:", quantity);
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            Swal.fire({
                icon: 'success',
                title: 'Quantity Updated',
                text: `Quantity of ${title} decreased to ${quantity}`,
                background: '#2a2a2a',
                color: '#fff',
                confirmButtonColor: '#ff7e3f',
                timer: 1500,
                toast: true,
                position: 'top-end'
            });
        }
    });

    const plusBtn = document.createElement("button");
    plusBtn.className = "btn btn-outline-secondary";
    plusBtn.type = "button";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => {
        console.log("Plus button clicked, current quantity:", quantity);
        quantity++;
        quantityInput.value = quantity;
        Swal.fire({
            icon: 'success',
            title: 'Quantity Updated',
            text: `Quantity of ${title} increased to ${quantity}`,
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f',
            timer: 1500,
            toast: true,
            position: 'top-end'
        });
    });

    quantityGroup.appendChild(minusBtn);
    quantityGroup.appendChild(quantityInput);
    quantityGroup.appendChild(plusBtn);

    // زرار "Add to Cart" بتاعة اللون #ff7f50
    const addToCartBtn = document.createElement("button");
    addToCartBtn.className = "btn w-100";
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.style.backgroundColor = "#ff7f50";
    addToCartBtn.style.borderColor = "#ff7f50";
    addToCartBtn.style.color = "#fff";
    addToCartBtn.addEventListener("click", async () => {
        await addToCartHandler(quantity);
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${title} has been added to your cart!`,
            background: '#2a2a2a',
            color: '#fff',
            confirmButtonColor: '#ff7e3f',
            timer: 1500,
            toast: true,
            position: 'top-end'
        });
    });

    // دالة لإضافة المنتج للسلة
    const addToCartHandler = async (qty) => {
        const cardEl = cardContent;

        const name = cardEl.querySelector(".card-title")?.textContent || "";
        const price = cardEl.querySelector(".card-text.text-danger")?.textContent || "0";
        const image = cardEl.querySelector("img")?.src || "";
        const desc = cardEl.querySelector(".card-text.text-muted")?.textContent || "";

        const cartItem = {
            name: name,
            price: parseFloat(price.replace("$", "")),
            image: image,
            description: desc
        };

        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");

        console.log("Adding to cart:", cartItem, "Quantity:", qty, "Email:", email);

        try {
            await addToCart(cartItem, email, qty);
            console.log("Successfully added to cart");
            if (updateCallback) updateCallback(); // تحديث إجمالي السعر في صفحة السلة (لو موجود)
        } catch (error) {
            console.error("Add to cart error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add to cart.',
                background: '#2a2a2a',
                color: '#fff',
                confirmButtonColor: '#ff7e3f'
            });
        }
    };

    // ❤️ Favorite icon click event
    if (!isSpecialPage) {
        favIcon.addEventListener("click", async () => {
            favIcon.classList.toggle("text-danger");
            favIcon.classList.toggle("favorite");

            const cardEl = favIcon.closest(".card");

            const name = cardEl.querySelector(".card-title")?.textContent || "";
            const price = cardEl.querySelector(".card-text.text-danger")?.textContent || "0";
            const image = cardEl.querySelector("img")?.src || "";
            const desc = cardEl.querySelector(".card-text.text-muted")?.textContent || "";

            const favoriteItem = {
                name: name,
                price: parseFloat(price.replace("$", "")),
                image: image,
                description: desc
            };

            try {
                if (favIcon.classList.contains("favorite")) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const email = urlParams.get("email");
                    await saveToFavorites(favoriteItem, email);
                } else {
                    await removeFromFavorites(favoriteItem);
                }
            } catch (error) {
                console.error("Favorite toggle error:", error);
            }
        });
    }

    // Append elements to card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardPrice);
    if (description) cardBody.appendChild(descP);
    cardBody.appendChild(quantityGroup);
    cardBody.appendChild(addToCartBtn); // زرار "Add to Cart" بتاعة اللون #ff7f50

    cardContent.appendChild(cardBody);
    card.appendChild(cardContent);

    return card;
}