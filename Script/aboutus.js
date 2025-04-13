
document.addEventListener('DOMContentLoaded', () => {
    const aboutContent = `
        <div class="simple-about">
            <div class="about-hero">
                <img 
                    src="/Resources/3eb003d5-606c-4c12-8441-0512f7b85ec0.jpg" 
                    alt="Our Restaurant" 
                    class="hero-img"
                />
            </div>
            <div class="about-text container py-4">
                <h1 class="text-center mb-4">About ATAM</h1>
                <p>Founded in 1995, ATAM Restaurant has been serving authentic Egyptian cuisine with a modern twist.</p>
                <p>What started as a small family restaurant has grown into a beloved establishment known for its warm hospitality.</p>
                <p>We take pride in preserving Egypt's rich culinary heritage while innovating for today's palate.</p>
            </div>
        </div>
    `;

    const container = document.getElementById('aboutContainer');
    if (container) {
        container.innerHTML = aboutContent;
    } else {
        console.error('Error: #aboutContainer not found.');
    }
});
