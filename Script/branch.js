document.addEventListener('DOMContentLoaded', function() {
    const branches = [
        {
            name: "Downtown Branch",
            address: "123 Main St, Cairo",
            hours: "9:00 AM - 11:00 PM",
            phone: "010-1234-5678",
            image: "/Resources/downtown-branch.jpg"
        },
        {
            name: "New Cairo Branch",
            address: "456 Nile St, New Cairo",
            hours: "10:00 AM - 12:00 AM",
            phone: "010-8765-4321",
            image: "/Resources/new-cairo-branch.jpg"
        }
    ];

    const content = `
        <div class="branches-content">
            <div class="row g-4">
                ${branches.map(branch => `
                    <div class="col-md-6">
                        <div class="branch-card h-100">
                            <div class="row g-0">
                                <div class="col-md-5">
                                    <img src="${branch.image}" 
                                         alt="${branch.name}" 
                                         class="img-fluid rounded-start h-100">
                                </div>
                                <div class="col-md-7">
                                    <div class="card-body h-100 d-flex flex-column">
                                        <h3 class="card-title">${branch.name}</h3>
                                        <div class="card-text mb-2">
                                            <p class="mb-1"><i class="bi bi-geo-alt"></i> ${branch.address}</p>
                                            <p class="mb-1"><i class="bi bi-clock"></i> ${branch.hours}</p>
                                            <p class="mb-3"><i class="bi bi-telephone"></i> ${branch.phone}</p>
                                        </div>
                                        <a href="#" class="btn btn-primary mt-auto align-self-start">View Map</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const container = document.getElementById('branchesContainer');
    if (container) {
        container.innerHTML = content;
    }
});