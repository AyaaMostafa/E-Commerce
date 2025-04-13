let content = document.getElementById("content");
let header = document.getElementById("header");
let footer = document.getElementById("footer");
let atam = document.getElementById("atam");
let home = document.getElementById("home");


function loadHeaderFooter() {
    fetch("../Pages/header/header.html")
        .then(res => res.text())
        .then(html => {
            header.innerHTML = html;
        })
        .catch(error => console.error('Error loading header:', error));

    fetch('../Pages/footer/footer.html')
        .then(res => res.text())
        .then(html => {
            footer.innerHTML = html;
        })
        .catch(error => console.error('Error loading footer:', error));

    // هنا filter خللي بالك
    fetch('../Pages/filter/filter.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('filter-sidebar').innerHTML = html;
        })
        .catch(error => console.error('Error loading filter:', error));

}

function loadPage(page) {
    fetch(`../Pages/${page}/${page}.html`)
        .then(res => res.text())
        .then(html => {

            content.innerHTML = "";
            content.innerHTML = html;

            // Remove the old style if it exists
            let oldStyle = document.getElementById("page-style");
            if (oldStyle) oldStyle.remove();

            // Append new CSS for the page
            let style = document.createElement("link");
            style.id = "page-style";  // Set the id to easily identify and remove it later
            style.rel = "stylesheet";
            style.href = `../Style/${page}.css`;  // Assuming `page` is a variable representing the CSS file name
            document.head.appendChild(style);


            let oldScript = document.getElementById("page-script");
            if (oldScript) oldScript.remove();

            // append script file
            let script = document.createElement("script");
            script.id = "page-script"
            script.src = `../Script/${page}.js?v=${Date.now()}`;
            script.type = "module";
            document.body.appendChild(script);
        })
        .catch(error => {
            content.innerHTML = `<p class="text-danger">Error loading page: ${page}</p>`;
            console.error(error);
        });
}

window.onload = () => {
    loadHeaderFooter();
    loadPage("home");
};

document.addEventListener("click", function (e) {
    const target = e.target;

    if (target.classList.contains("food-link") || target.classList.contains("footer-link")) {
        e.preventDefault();
        const page = target.getAttribute("data-page");
      
        if (!content.innerHTML.includes(page)) {
            loadPage(page);
        }
    }
});

document.addEventListener("click", function (e) {
    // Home or Atam clicks
    if (e.target.id === "home" || e.target.id === "atam") {
        e.preventDefault();
        loadPage("home");
    }
});






