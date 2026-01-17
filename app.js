// DOM elementlarni tanlab olish
const categoriesContainer = document.querySelector('.categories');

// Kategoriyalar ma'lumotlari va ularning mahsulotlari
const categoriesData = [
    {
        id: 1,
        name: "Telefonlar",
        description: "Smartfonlar, qulay telefonlar va aksessuarlar",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        count: 245,
        products: [
            { id: 101, name: "iPhone 15 Pro", price: "12 499 000 so'm", brand: "Apple" },
            { id: 102, name: "Samsung Galaxy S24", price: "10 999 000 so'm", brand: "Samsung" },
            { id: 103, name: "Xiaomi Redmi Note 13", price: "4 299 000 so'm", brand: "Xiaomi" }
        ]
    },
    {
        id: 2,
        name: "Noutbuklar",
        description: "Ish, o'yin va ta'lim uchun noutbuklar",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        count: 189,
        products: [
            { id: 201, name: "MacBook Air M2", price: "15 999 000 so'm", brand: "Apple" },
            { id: 202, name: "Asus ROG Strix G15", price: "18 499 000 so'm", brand: "Asus" },
            { id: 203, name: "HP Pavilion 15", price: "9 299 000 so'm", brand: "HP" }
        ]
    },
    {
        id: 3,
        name: "Televizorlar",
        description: "4K, 8K, Smart TV va boshqa televizor turlari",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        count: 132,
        products: [
            { id: 301, name: "Samsung QLED 65''", price: "22 999 000 so'm", brand: "Samsung" },
            { id: 302, name: "LG OLED 55''", price: "19 499 000 so'm", brand: "LG" },
            { id: 303, name: "Xiaomi Smart TV 50''", price: "8 799 000 so'm", brand: "Xiaomi" }
        ]
    },
    {
        id: 4,
        name: "Planchetlar",
        description: "iOS va Android planchetlar",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        count: 98,
        products: [
            { id: 401, name: "iPad Pro 12.9''", price: "16 499 000 so'm", brand: "Apple" },
            { id: 402, name: "Samsung Galaxy Tab S9", price: "13 999 000 so'm", brand: "Samsung" },
            { id: 403, name: "Lenovo Tab P12", price: "7 299 000 so'm", brand: "Lenovo" }
        ]
    },
    {
        id: 5,
        name: "Smart-soatlar",
        description: "Fitnes, sog'liqni kuzatish va aqlli funksiyalar",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        count: 167,
        products: [
            { id: 501, name: "Apple Watch Series 9", price: "6 499 000 so'm", brand: "Apple" },
            { id: 502, name: "Samsung Galaxy Watch 6", price: "5 299 000 so'm", brand: "Samsung" },
            { id: 503, name: "Xiaomi Mi Band 8", price: "899 000 so'm", brand: "Xiaomi" }
        ]
    },
    {
        id: 6,
        name: "Naushniklar",
        description: "Simli va simsiz naushniklar",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        count: 210,
        products: [
            { id: 601, name: "AirPods Pro 2", price: "3 499 000 so'm", brand: "Apple" },
            { id: 602, name: "Sony WH-1000XM5", price: "4 999 000 so'm", brand: "Sony" },
            { id: 603, name: "JBL Tune 510BT", price: "899 000 so'm", brand: "JBL" }
        ]
    }
];

// Sahifani yuklash funksiyasi
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    loadCategories();
});

// Sahifani boshlang'ich sozlash
function initPage() {
    // Sahifa sarlavhasiga effekt qo'shamiz
    const pageTitle = document.querySelector('h1');
    if (pageTitle) {
        pageTitle.innerHTML = pageTitle.textContent.split('').map((char, i) => 
            `<span style="animation-delay: ${i * 0.05}s">${char}</span>`
        ).join('');
    }
    
    // Filtr tugmalarini qo'shamiz
    createFilterButtons();
}

// Filtr tugmalarini yaratish
function createFilterButtons() {
    const filterButtons = document.createElement('div');
    filterButtons.className = 'filter-buttons';
    filterButtons.innerHTML = `
        <button class="filter-btn active" data-filter="all">Hammasi</button>
        <button class="filter-btn" data-filter="count">Ko'p mahsulotli</button>
        <button class="filter-btn" data-filter="name">Alifbo bo'yicha</button>
    `;
    
    // Sahifaga qo'shamiz
    const container = document.querySelector('.container');
    const title = document.querySelector('h1');
    container.insertBefore(filterButtons, title.nextSibling);
    
    // Filtr tugmalariga hodisa qo'shamiz
    filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Faqat bitta tugma faol bo'ladi
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            filterCategories(filterType);
        });
    });
}

// Kategoriyalarni filtr qilish
function filterCategories(filterType) {
    let sortedData = [...categoriesData];
    
    switch(filterType) {
        case 'count':
            sortedData.sort((a, b) => b.count - a.count);
            break;
        case 'name':
            sortedData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // "all" - o'zgartirmaymiz
            break;
    }
    
    loadCategories(sortedData);
}

// Kategoriyalarni yuklash
function loadCategories(data = categoriesData) {
    categoriesContainer.innerHTML = '';
    
    data.forEach((category, index) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.setAttribute('data-id', category.id);
        categoryElement.setAttribute('data-name', category.name);
        categoryElement.setAttribute('data-index', index + 1);
        
        categoryElement.innerHTML = `
            <img src="${category.image}" alt="${category.name}" loading="lazy">
            <span>${category.name} <small>(${category.count} mahsulot)</small></span>
        `;
        
        // Kategoriyaga bosilganda mahsulotlar sahifasiga o'tish
        categoryElement.addEventListener('click', () => openCategoryProducts(category));
        
        categoriesContainer.appendChild(categoryElement);
    });
}

// ==============================================
// ASOSIY FUNKSIYA: Kategoriya bosilganda mahsulotlar sahifasiga o'tish
// ==============================================
function openCategoryProducts(category) {
    console.log(`${category.name} kategoriyasi tanlandi!`);
    console.log(`Mahsulotlar soni: ${category.count}`);
    
    // 1. Avval foydalanuvchiga xabar beramiz
    showNotification(`${category.name} kategoriyasi tanlandi. Mahsulotlar yuklanmoqda...`);
    
    // 2. Mahsulotlar sahifasini yaratamiz
    createProductsPage(category);
    
    // 3. URL ni o'zgartiramiz (browser history ga qo'shamiz)
    updateUrl(category.id, category.name);
    
    // 4. Analytics yoki tracking funksiyasi (agar kerak bo'lsa)
    trackCategoryClick(category);
}

// ==============================================
// Yordamchi funksiyalar
// ==============================================

// 1. Xabar ko'rsatish funksiyasi
function showNotification(message) {
    // Avvalgi xabarni olib tashlaymiz
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Yangi xabar yaratamiz
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Stil beramiz
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(to right, #2ecc71, #27ae60);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    // Yopish tugmasi
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
    `;
    
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = 'rgba(255,255,255,0.2)';
    });
    
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = 'none';
    });
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Animatsiya uchun CSS qo'shamiz
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Sahifaga qo'shamiz
    document.body.appendChild(notification);
    
    // 3 soniyadan keyin avtomatik yopiladi
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// 2. Mahsulotlar sahifasini yaratish funksiyasi
function createProductsPage(category) {
    // Hozirgi sahifani yashiramiz
    const container = document.querySelector('.container');
    container.style.opacity = '0.5';
    container.style.pointerEvents = 'none';
    
    // Mahsulotlar panelini yaratamiz
    const productsPanel = document.createElement('div');
    productsPanel.id = 'products-panel';
    productsPanel.innerHTML = `
        <div class="products-header">
            <button class="back-btn">
                <i class="fas fa-arrow-left"></i> Orqaga
            </button>
            <h2>${category.name} - Mahsulotlar</h2>
            <button class="close-panel">&times;</button>
        </div>
        <div class="products-container">
            <div class="category-info">
                <img src="${category.image}" alt="${category.name}">
                <div>
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <p class="count">Jami mahsulotlar: ${category.count}</p>
                </div>
            </div>
            <div class="products-list">
                <h3>Top mahsulotlar</h3>
                <div class="products-grid" id="products-grid">
                    <!-- Mahsulotlar bu yerda yuklanadi -->
                </div>
            </div>
        </div>
    `;
    
    // Stil beramiz
    productsPanel.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 80%;
        max-width: 800px;
        height: 100vh;
        background: white;
        box-shadow: -5px 0 25px rgba(0,0,0,0.1);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.4s ease;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    `;
    
    // Sahifaga qo'shamiz
    document.body.appendChild(productsPanel);
    
    // Panelni ochamiz
    setTimeout(() => {
        productsPanel.style.transform = 'translateX(0)';
    }, 10);
    
    // Mahsulotlarni yuklaymiz
    setTimeout(() => {
        loadProductsToPanel(category.products);
    }, 300);
    
    // Orqaga tugmasi
    const backBtn = productsPanel.querySelector('.back-btn');
    backBtn.addEventListener('click', closeProductsPanel);
    
    // Yopish tugmasi
    const closeBtn = productsPanel.querySelector('.close-panel');
    closeBtn.addEventListener('click', closeProductsPanel);
    
    // Panel tashqarisiga bosilganda yopish
    productsPanel.addEventListener('click', function(e) {
        if (e.target === productsPanel) {
            closeProductsPanel();
        }
    });
}

// 3. Mahsulotlarni panelga yuklash
function loadProductsToPanel(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">${product.name.charAt(0)}</div>
            <h4>${product.name}</h4>
            <p class="brand">${product.brand}</p>
            <p class="price">${product.price}</p>
            <button class="view-product">Batafsil</button>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Mahsulot karta stillari
    const style = document.createElement('style');
    style.textContent = `
        .product-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: transform 0.3s;
            text-align: center;
        }
        .product-card:hover {
            transform: translateY(-5px);
        }
        .product-img {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin: 0 auto 15px;
        }
        .product-card h4 {
            margin: 10px 0;
            color: #2c3e50;
        }
        .product-card .brand {
            color: #7f8c8d;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .product-card .price {
            color: #e74c3c;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .view-product {
            background: linear-gradient(to right, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            width: 100%;
        }
        .view-product:hover {
            background: linear-gradient(to right, #2980b9, #3498db);
        }
        
        .products-header {
            background: linear-gradient(to right, #2c3e50, #3498db);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .back-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .close-panel {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s;
        }
        
        .close-panel:hover {
            background: rgba(255,255,255,0.2);
        }
        
        .products-container {
            padding: 20px;
        }
        
        .category-info {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .category-info img {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
    `;
    
    document.head.appendChild(style);
}

// 4. Mahsulotlar panelini yopish
function closeProductsPanel() {
    const productsPanel = document.getElementById('products-panel');
    if (!productsPanel) return;
    
    productsPanel.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (productsPanel.parentNode) {
            productsPanel.remove();
            
            // Asosiy sahifani tiklaymiz
            const container = document.querySelector('.container');
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
            
            // URL ni asl holatiga qaytaramiz
            history.replaceState(null, '', window.location.pathname);
        }
    }, 400);
}

// 5. URL ni yangilash funksiyasi
function updateUrl(categoryId, categoryName) {
    // URL parametrini yaratamiz
    const url = new URL(window.location);
    url.searchParams.set('category', categoryId);
    url.searchParams.set('name', encodeURIComponent(categoryName));
    
    // Browser history ga qo'shamiz
    history.pushState({ categoryId, categoryName }, '', url);
    
    // Browser back tugmasi uchun hodisa
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.categoryId) {
            // Agar state mavjud bo'lsa, kategoriyani ochamiz
            const category = categoriesData.find(c => c.id === event.state.categoryId);
            if (category) {
                openCategoryProducts(category);
            }
        } else {
            // Asosiy sahifaga qaytsak, panelni yopamiz
            closeProductsPanel();
        }
    });
}

// 6. Tracking funksiyasi (analitika uchun)
function trackCategoryClick(category) {
    // Bu yerda analytics kodlari bo'lishi mumkin
    // Misol uchun: Google Analytics, Yandex.Metrica yoki o'z tracking tizimingiz
    
    console.group('📊 Kategoriya Analytics');
    console.log(`Kategoriya: ${category.name}`);
    console.log(`ID: ${category.id}`);
    console.log(`Mahsulotlar soni: ${category.count}`);
    console.log(`Vaqt: ${new Date().toLocaleTimeString()}`);
    console.groupEnd();
    
    // LocalStorage ga saqlash (foydalanuvchi faolligi uchun)
    const recentCategories = JSON.parse(localStorage.getItem('recentCategories') || '[]');
    recentCategories.unshift({
        id: category.id,
        name: category.name,
        timestamp: new Date().toISOString()
    });
    
    // Faqat oxirgi 5 tasini saqlaymiz
    localStorage.setItem('recentCategories', JSON.stringify(recentCategories.slice(0, 5)));
}

// 7. Sahifa yuklanganda URL parametrlarini tekshirish
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    
    if (categoryId) {
        const category = categoriesData.find(c => c.id === parseInt(categoryId));
        if (category) {
            // Kechiktirib ochamiz (sahifa to'liq yuklanishi uchun)
            setTimeout(() => {
                openCategoryProducts(category);
            }, 500);
        }
    }
}

// Sahifa yuklanganda URL parametrlarini tekshirish
document.addEventListener('DOMContentLoaded', checkUrlParams);