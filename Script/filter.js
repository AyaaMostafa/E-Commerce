document.addEventListener('DOMContentLoaded', function() {
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.querySelector('.filter-sidebar');
    
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            filterSidebar.classList.toggle('active');
        });
    }

    const applyFilterBtn = document.getElementById('applyFilter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }

    const clearFilterBtn = document.getElementById('clearFilter');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', clearFilters);
    }

    loadSavedFilters();
});

function applyFilters() {
    const filters = {
        price: null
    };

    const priceRadio = document.querySelector('.filter-sidebar input[type="radio"]:checked');
    if (priceRadio) {
        filters.price = priceRadio.value;
    }

    localStorage.setItem('filters', JSON.stringify(filters));

    if (typeof filterProducts === 'function') {
        filterProducts(filters);
    }

    document.querySelector('.filter-sidebar').classList.remove('active');
}

function clearFilters() {
    document.querySelectorAll('.filter-sidebar input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    localStorage.removeItem('filters');
    applyFilters();
}

function loadSavedFilters() {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    if (!savedFilters) return;

    if (savedFilters.price) {
        const priceRadio = document.querySelector(`.filter-sidebar input[type="radio"][value="${savedFilters.price}"]`);
        if (priceRadio) priceRadio.checked = true;
    }
}

window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.loadSavedFilters = loadSavedFilters;
