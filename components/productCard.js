

export function createCard(title, price, image) {
    const card = document.createElement("div");
    card.className = "col-lg-3 col-md-6 col-sm-12 mb-5 pb-4 d-flex justify-content-center";
    const cardContent = document.createElement("div");
    cardContent.className = "card border border-light-subtle shadow-sm position-relative mb-5";

    // "Best Deal" Badge
    const badge = document.createElement("span");
    badge.className = "badge bg-danger position-absolute top-0 start-0 m-2";
    badge.style.fontSize = "0.65rem";
    badge.style.zIndex = "10";
    card.style.position = 'relative';
    badge.style.padding = "0.3rem 0.6rem";
    badge.textContent = "Best Deal";
    cardContent.appendChild(badge);

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

    // Quantity controls
    const quantityGroup = document.createElement("div");
    quantityGroup.className = "input-group mb-3 mx-auto";
    quantityGroup.style.width = "10rem";

    const minusBtn = document.createElement("button");
    minusBtn.className = "btn btn-outline-secondary";
    minusBtn.type = "button";
    minusBtn.textContent = "−";

    const quantityInput = document.createElement("input");
    quantityInput.type = "text";
    quantityInput.className = "form-control text-center";
    quantityInput.value = "1";
    quantityInput.readOnly = true;

    const plusBtn = document.createElement("button");
    plusBtn.className = "btn btn-outline-secondary";
    plusBtn.type = "button";
    plusBtn.textContent = "+";

    quantityGroup.appendChild(minusBtn);
    quantityGroup.appendChild(quantityInput);
    quantityGroup.appendChild(plusBtn);

    // Add to Cart Button
    const addToCartBtn = document.createElement("button");
    addToCartBtn.className = "btn btn-dark w-100";
    addToCartBtn.textContent = "Add to Cart";

    // Quantity change logic
    minusBtn.addEventListener("click", () => {
        let current = parseInt(quantityInput.value);
        if (current > 1) quantityInput.value = current - 1;
    });

    plusBtn.addEventListener("click", () => {
        let current = parseInt(quantityInput.value);
        quantityInput.value = current + 1;
    });

    // Append to card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(quantityGroup);
    cardBody.appendChild(addToCartBtn);

    cardContent.appendChild(cardBody);
    card.appendChild(cardContent);

    return card;
}
