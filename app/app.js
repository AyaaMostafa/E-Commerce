let content = document.getElementById("content");
let header = document.getElementById("header");
let footer = document.getElementById("footer");

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
}

function loadPage(page) {
    fetch(`../Pages/${page}/${page}.html`)
        .then(res => res.text())
        .then(html => {
            content.innerHTML = html;

            let oldStyle = document.getElementById("page-style");
            if (oldStyle) oldStyle.remove();

            // Append new CSS for the page
            let style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = `../Style/${page}.css`;
            document.head.appendChild(style);

            // append script file
            let script = document.createElement("script");
            script.src = `../Script/${page}.js`;
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





