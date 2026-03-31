document.addEventListener('DOMContentLoaded', function() {
    
    const categorySelect = document.getElementById('category');
    const priceSelect = document.getElementById('price');
    const sortSelect = document.getElementById('sort');
    const applyButton = document.querySelector('.filter-button');
    const productsGrid = document.querySelector('.products-grid');
    const paginationContainer = document.querySelector('.pagination');
    
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const totalPriceSumSpan = document.getElementById('total-price-sum');
    
    const productsPerPage = 6;
    let currentPage = 1;
    let filteredProducts = [];

    let cart = JSON.parse(localStorage.getItem('userCart')) || [];

    const Catalog = [
        { id: 'laptop', category: 'laptops', name: 'Ноутбук Dell XPS 15', img: 'pics/laptop.png', description: 'Потужний ноутбук для роботи та розваг', price: 52999, popularRank: 1, isNew: false },
        { id: 'laptop2', category: 'laptops', name: 'MacBook Pro 14"', img: 'pics/laptop2.png', description: 'Чіп M3, 16GB RAM, 1TB SSD', price: 74999, popularRank: 2, isNew: true },
        { id: 'laptop3', category: 'laptops', name: 'Lenovo LOQ 15ARP9 Luna Grey', img: 'pics/laptop3.png', description: 'Чіп Ryzen 5 7235HS, 16GB RAM, 512GB SSD', price: 36999, popularRank: 5, isNew: true },
        { id: 'laptop4', category: 'laptops', name: 'Lenovo LOQ Essential 15IRX11 Luna Grey', img: 'pics/laptop4.png', description: 'Чіп IntelCore i5-13450HX, 16GB RAM, 512GB SSD', price: 55999, popularRank: 6, isNew: false },
        { id: 'pc', category: 'pc', name: 'Expert PC Ultimate (A5600.32.S10.5060.A6344)', img: 'pics/pc.png', description: 'Чіп Ryzen 5 5600, 32GB RAM, 1TB SSD', price: 47999, popularRank: 7, isNew: false },
        { id: 'pc2', category: 'pc', name: 'Expert PC Ultimate (A5600.32.S1.5060T.A6307)', img: 'pics/pc2.png', description: 'Чіп Ryzen 5 5600, 32GB RAM, 1TB SSD', price: 55999, popularRank: 8, isNew: true },
        { id: 'phone', category: 'phones', name: 'iPhone 15 Pro', img: 'pics/phone.png', description: '6.1" дисплей, потрійна камера, A17 Pro чіп', price: 45999, popularRank: 3, isNew: false },
        { id: 'phone2', category: 'phones', name: 'Samsung Galaxy S24 Ultra', img: 'pics/phone2.png', description: '6.8" Dynamic AMOLED, S Pen, 200MP камера', price: 49999, popularRank: 4, isNew: true },
        { id: 'phone3', category: 'phones', name: 'Xiaomi Redmi 15C 8/256Gb Midnight Black', img: 'pics/phone3.png', description: '6,9" дисплей, подвійна камера', price: 5999, popularRank: 11, isNew: false },
        { id: 'phone4', category: 'phones', name: 'OPPO A6 Pro 8/256Gb Stellar Blue', img: 'pics/phone4.png', description: '6,57" дисплей, подвійна камера', price: 13999, popularRank: 12, isNew: false },
        { id: 'phone5', category: 'phones', name: 'Apple iPhone 17e 256Gb Soft Pink', img: 'pics/phone5.png', description: '6.1" дисплей, A19 чіп', price: 34999, popularRank: 9, isNew: true },
        { id: 'phone6', category: 'phones', name: 'Samsung Galaxy A36 5G 8/256Gb Awesome Black', img: 'pics/phone6.png', description: '6,7" дисплей, потрійна камера', price: 14899, popularRank: 10, isNew: true },
        { id: 'watch', category: 'watches', name: 'Apple Watch Series 9', img: 'pics/watch.png', description: 'Відстеження здоров\'я, сповіщення', price: 16999, popularRank: 13, isNew: false },
        { id: 'watch2', category: 'watches', name: 'Samsung Galaxy Watch6', img: 'pics/watch2.png', description: 'Вимірювання сну, пульсу, спортивні режими', price: 12499, popularRank: 14, isNew: false },
        { id: 'headphones', category: 'headphones', name: 'AirPods Max', img: 'pics/headphones.png', description: 'Повнорозмірні навушники з активним шумозаглушенням', price: 22999, popularRank: 15, isNew: false },
        { id: 'headphones2', category: 'headphones', name: 'Sony WH-1000XM5', img: 'pics/headphones2.png', description: 'Найкраще шумозаглушення, 30 год роботи', price: 14999, popularRank: 16, isNew: false },
        { id: 'headphones3', category: 'headphones', name: 'HyperX Cloud Stinger 2 Core Wired', img: 'pics/headphones3.png', description: 'Гарнітура дротова ігрова', price: 1800, popularRank: 17, isNew: false },
        { id: 'headphones4', category: 'headphones', name: 'Logitech G321 LightSpeed White', img: 'pics/headphones4.png', description: 'Гарнітура бездротова ігрова', price: 2999, popularRank: 18, isNew: true }
    ];

    const categoryNames = { 'laptops': 'Ноутбуки', 'phones': 'Телефони', 'watches': 'Годинники', 'headphones': 'Навушники', 'pc': 'ПК' };

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const formattedPrice = product.price.toLocaleString('uk-UA') + ' грн';
        const categoryLabel = categoryNames[product.category] || 'Товар';

        card.innerHTML = `
            <div class="product-image"><img src="${product.img}" alt="${product.name}"></div>
            <div class="product-info">
                <span class="product-category">${categoryLabel}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price-block">
                    <span class="product-price">${formattedPrice}</span>
                    <button class="product-button add-to-cart-btn" data-id="${product.id}">В кошик</button>
                </div>
            </div>
        `;
        return card;
    }

    function addToCart(productId) {
        const product = Catalog.find(item => item.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCartAndRefresh();
        cartModal.classList.add('active');
    }

    function changeQuantity(productId, amount) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        cartItem.quantity += amount;

        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }

        saveCartAndRefresh();
    }

    function saveCartAndRefresh() {
        localStorage.setItem('userCart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        
        let totalCount = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-text">Кошик порожній</p>';
        } else {
            cart.forEach(item => {
                totalCount += item.quantity;
                totalPrice += item.price * item.quantity;

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${item.price.toLocaleString('uk-UA')} грн</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        cartCountSpan.textContent = totalCount;
        totalPriceSumSpan.textContent = totalPrice.toLocaleString('uk-UA') + ' грн';
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = e.target.getAttribute('data-id');
            addToCart(id);
        }
        
        if (e.target.classList.contains('plus-btn')) {
            const id = e.target.getAttribute('data-id');
            changeQuantity(id, 1);
        }
        
        if (e.target.classList.contains('minus-btn')) {
            const id = e.target.getAttribute('data-id');
            changeQuantity(id, -1);
        }
    });

    cartIconBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });

    function filterAndSortProducts() {
        let result = [...Catalog];
        const selectedCategory = categorySelect.value;
        if (selectedCategory !== 'all') result = result.filter(p => p.category === selectedCategory);
        
        const selectedPrice = priceSelect.value;
        if (selectedPrice !== 'all') {
            result = result.filter(p => {
                switch(selectedPrice) {
                    case '0-5000': return p.price <= 5000;
                    case '5000-15000': return p.price > 5000 && p.price <= 15000;
                    case '15000-30000': return p.price > 15000 && p.price <= 30000;
                    case '30000+': return p.price > 30000;
                    default: return true;
                }
            });
        }
        
        const selectedSort = sortSelect.value;
        switch(selectedSort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'popular': result.sort((a, b) => a.popularRank - b.popularRank); break;
            case 'new': result.sort((a, b) => (b.isNew - a.isNew)); break;
        }
        
        filteredProducts = result;
        currentPage = 1;
        displayCurrentPage();
        updatePagination();
    }

    function displayCurrentPage() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        productsGrid.innerHTML = '';
        
        if (productsToShow.length > 0) {
            productsToShow.forEach(product => productsGrid.appendChild(createProductCard(product)));
        } else {
            productsGrid.innerHTML = '<div class="no-products">Товари не знайдено</div>';
        }
        updateProductsCount();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (totalPages <= 1) { paginationContainer.style.display = 'none'; return; } 
        else { paginationContainer.style.display = 'flex'; }
        
        paginationContainer.innerHTML = '';
        
        if (currentPage > 1) {
            const prevLink = document.createElement('a'); prevLink.className = 'pagination-link'; prevLink.textContent = 'Попередня';
            prevLink.addEventListener('click', (e) => { e.preventDefault(); currentPage--; displayCurrentPage(); updatePagination(); });
            paginationContainer.appendChild(prevLink);
        }
        
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a'); pageLink.className = `pagination-link ${i === currentPage ? 'active' : ''}`; pageLink.textContent = i;
            pageLink.addEventListener('click', (e) => { e.preventDefault(); currentPage = i; displayCurrentPage(); updatePagination(); });
            paginationContainer.appendChild(pageLink);
        }
        
        if (currentPage < totalPages) {
            const nextLink = document.createElement('a'); nextLink.className = 'pagination-link'; nextLink.textContent = 'Наступна';
            nextLink.addEventListener('click', (e) => { e.preventDefault(); currentPage++; displayCurrentPage(); updatePagination(); });
            paginationContainer.appendChild(nextLink);
        }
    }

    function updateProductsCount() {
        const filterRow = document.querySelector('.filter-row');
        let countDiv = document.querySelector('.products-count');
        if (!countDiv) {
            countDiv = document.createElement('div'); countDiv.className = 'products-count';
            filterRow.appendChild(countDiv);
        }
        const totalFiltered = filteredProducts.length;
        const startItem = totalFiltered > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
        const endItem = Math.min(currentPage * productsPerPage, totalFiltered);
        
        countDiv.textContent = totalFiltered > 0 ? `Товари ${startItem}-${endItem} з ${totalFiltered}` : `Знайдено товарів: 0`;
    }

    applyButton.addEventListener('click', filterAndSortProducts);
    categorySelect.addEventListener('change', filterAndSortProducts);
    priceSelect.addEventListener('change', filterAndSortProducts);
    sortSelect.addEventListener('change', filterAndSortProducts);

    filterAndSortProducts();
    updateCartUI();
});