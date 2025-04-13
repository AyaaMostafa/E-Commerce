function loadAboutUsContent() {
    const aboutUsContainer = document.getElementById("aboutUsContainer");

    if (aboutUsContainer) {
        const imageElement = document.createElement("img");
        imageElement.src = "/Resources/3eb003d5-606c-4c12-8441-0512f7b85ec0.jpg";  
        imageElement.alt = "About Us";
        imageElement.classList.add("img-fluid", "rounded", "shadow");

        const textContainer = document.createElement("div");
        textContainer.classList.add("col-md-6");

        const heading = document.createElement("h2");
        heading.classList.add("mb-3");
        heading.innerText = "About Our Restaurant";

        const paragraph = document.createElement("p");
        paragraph.innerHTML = `
            Welcome to our renowned restaurant, a culinary destination loved by locals and visitors alike. 
            Known for its exceptional quality, warm hospitality, and timeless flavors, our restaurant has 
            become a household name in the region. With a rich history rooted in passion for food and service, 
            we bring together traditional recipes and modern techniques to create unforgettable dining experiences.
            Whether you're here for a family dinner, a special celebration, or a casual bite, every dish we serve 
            is crafted with care and excellence. Join us and taste why we’ve earned our reputation as one of the 
            finest restaurants around.
        `;

        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row", "align-items-center");

        textContainer.appendChild(heading);
        textContainer.appendChild(paragraph);
        rowContainer.appendChild(imageElement);
        rowContainer.appendChild(textContainer);

        
        aboutUsContainer.appendChild(rowContainer);
    } else {
        console.error("About Us container not found.");
    }
}

loadAboutUsContent();
