document.addEventListener('DOMContentLoaded', function() {
    
    const categorySelect = document.getElementById('category');
    const priceSelect = document.getElementById('price');
    const sortSelect = document.getElementById('sort');
    const applyButton = document.querySelector('.filter-button');
    const productsGrid = document.querySelector('.products-grid');
    const paginationContainer = document.querySelector('.pagination');
    
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const originalOrder = [...productCards];
    
    const productsPerPage = 6;
    let currentPage = 1;
    let filteredCards = [...originalOrder];
    
    function extractPrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, ''));
    }
    
    function getProductCategory(card) {
        const categoryElement = card.querySelector('.product-category');
        return categoryElement ? categoryElement.textContent.trim() : '';
    }
    
    function getProductTitle(card) {
        const titleElement = card.querySelector('.product-title');
        return titleElement ? titleElement.textContent.trim() : '';
    }
    
    function getProductPrice(card) {
        const priceElement = card.querySelector('.product-price');
        return priceElement ? extractPrice(priceElement.textContent) : 0;
    }
    
    function filterByCategory(cards, category) {
        if (category === 'all') return cards;
        
        const categoryMap = {
            'laptops': 'Ноутбуки',
            'phones': 'Телефони',
            'watches': 'Годинники',
            'headphones': 'Навушники'
        };
        
        const selectedCategory = categoryMap[category];
        return cards.filter(card => getProductCategory(card) === selectedCategory);
    }
    
    function filterByPrice(cards, priceRange) {
        if (priceRange === 'all') return cards;
        
        return cards.filter(card => {
            const price = getProductPrice(card);
            
            switch(priceRange) {
                case '0-5000':
                    return price <= 5000;
                case '5000-15000':
                    return price > 5000 && price <= 15000;
                case '15000-30000':
                    return price > 15000 && price <= 30000;
                case '30000+':
                    return price > 30000;
                default:
                    return true;
            }
        });
    }
    
    function sortProducts(cards, sortType) {
        const sortedCards = [...cards];
        
        switch(sortType) {
            case 'price-asc':
                sortedCards.sort((a, b) => getProductPrice(a) - getProductPrice(b));
                break;
            case 'price-desc':
                sortedCards.sort((a, b) => getProductPrice(b) - getProductPrice(a));
                break;
            case 'popular':
                break;
            case 'new':
                break;
            default:
                return sortedCards;
        }
        
        return sortedCards;
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(filteredCards.length / productsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        } else {
            paginationContainer.style.display = 'flex';
        }
        
        paginationContainer.innerHTML = '';
        
        if (currentPage > 1) {
            const prevLink = document.createElement('a');
            prevLink.href = '#';
            prevLink.className = 'pagination-link';
            prevLink.textContent = 'Попередня';
            prevLink.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage--;
                displayCurrentPage();
                updatePagination();
            });
            paginationContainer.appendChild(prevLink);
        }
        
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.className = `pagination-link ${i === currentPage ? 'active' : ''}`;
            pageLink.textContent = i;
            
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                displayCurrentPage();
                updatePagination();
            });
            
            paginationContainer.appendChild(pageLink);
        }
        
        if (currentPage < totalPages) {
            const nextLink = document.createElement('a');
            nextLink.href = '#';
            nextLink.className = 'pagination-link';
            nextLink.textContent = 'Наступна';
            nextLink.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage++;
                displayCurrentPage();
                updatePagination();
            });
            paginationContainer.appendChild(nextLink);
        }
    }
    
    function displayCurrentPage() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const cardsToShow = filteredCards.slice(startIndex, endIndex);
        
        productsGrid.innerHTML = '';
        
        if (cardsToShow.length > 0) {
            cardsToShow.forEach(card => {
                productsGrid.appendChild(card);
            });
        } else {
            productsGrid.innerHTML = '<div class="no-products">Товари не знайдено</div>';
        }
        
        updateProductsCount();
    }
    
    function updateProductsDisplay() {
        let filtered = [...originalOrder];
        
        const selectedCategory = categorySelect.value;
        filtered = filterByCategory(filtered, selectedCategory);
        
        const selectedPrice = priceSelect.value;
        filtered = filterByPrice(filtered, selectedPrice);
        
        const selectedSort = sortSelect.value;
        filtered = sortProducts(filtered, selectedSort);
        
        filteredCards = filtered;
        currentPage = 1;
        
        displayCurrentPage();
        updatePagination();
    }
    
    function resetFilters() {
        categorySelect.value = 'all';
        priceSelect.value = 'all';
        sortSelect.value = 'popular';
        updateProductsDisplay();
    }
    
    applyButton.addEventListener('click', function() {
        updateProductsDisplay();
    });
    
    categorySelect.addEventListener('change', function() {
        updateProductsDisplay();
    });
    
    priceSelect.addEventListener('change', function() {
        updateProductsDisplay();
    });
    
    sortSelect.addEventListener('change', function() {
        updateProductsDisplay();
    });
    
    function addProductsCount() {
        const filterRow = document.querySelector('.filter-row');
        const countDiv = document.createElement('div');
        countDiv.className = 'products-count';
        filterRow.appendChild(countDiv);
    }
    
    function updateProductsCount() {
        const countDiv = document.querySelector('.products-count');
        if (countDiv) {
            const totalFiltered = filteredCards.length;
            const startItem = (currentPage - 1) * productsPerPage + 1;
            const endItem = Math.min(currentPage * productsPerPage, totalFiltered);
            
            if (totalFiltered > 0) {
                countDiv.textContent = `Товари ${startItem}-${endItem} з ${totalFiltered}`;
            } else {
                countDiv.textContent = `Знайдено товарів: 0`;
            }
        }
    }
    
    addProductsCount();
    updateProductsDisplay();
});