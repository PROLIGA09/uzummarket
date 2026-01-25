// ===== HYDROLINE PRO - PREMIUM APPLICATION =====

// Konfiguratsiya
const CONFIG = {
    TELEGRAM_BOT_TOKEN: "7692859653:AAE_8ddxOhqdjiqV8nJMQCp1ud46jvSGlDE",
    TELEGRAM_CHAT_ID: "7245353315",
    EXCHANGE_RATE: 12500,
    APP_NAME: "Hydroline Pro"
};

// Global holatlar
let state = {
    currentUser: null,
    cart: [],
    favorites: [],
    orders: [],
    viewedProducts: [],
    currentPage: 'loginPage',
    currentCategory: 'all',
    lastPage: 'homePage',
    currentOrder: null
};

// LocalStorage boshqaruvi
const storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(`hydroline_pro_${key}`, JSON.stringify(data));
        } catch (e) {
            console.error('Saqlashda xatolik:', e);
        }
    },

    load: (key) => {
        try {
            const data = localStorage.getItem(`hydroline_pro_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Yuklashda xatolik:', e);
            return null;
        }
    },

    clear: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('hydroline_pro_')) {
                localStorage.removeItem(key);
            }
        });
    }
};

// Namuna mahsulotlar (Premium versiya)
const products = [{
        id: 1,
        name: "Premium Dush Seti",
        price: 45.99,
        category: "DUSH UCHUN",
        rating: 4.8,
        sold: 124,
        description: "Zamonaviy dizayndagi premium dush seti. Termostatik aralashgich, krom qoplama.",
        image: "https://images.unsplash.com/photo-1584620781857-5e6c07e3c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        features: ["Termostat", "Krom qoplama", "O'rnatish kitti bilan"],
        badge: "YANGI"
    },
    {
        id: 2,
        name: "Oshxona Rakovinasi",
        price: 89.50,
        category: "OSHXONA UCHUN",
        rating: 4.9,
        sold: 89,
        description: "Granit kompozit materialdan tayyorlangan premium oshxona rakovinasi.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        features: ["Granit kompozit", "Shovqinsiz", "Lekaga chidamli"],
        badge: "MASHHUR"
    },
    {
        id: 3,
        name: "Smart Aralashgich",
        price: 129.99,
        category: "RAKOVINA UCHUN",
        rating: 4.7,
        sold: 56,
        description: "Sensorli boshqaruvga ega smart aralashgich. Haroratni aniqlik bilan sozlash.",
        image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        features: ["Sensorli", "Energiya tejovchi", "LCD displey"],
        badge: "SMART"
    },
    {
        id: 4,
        name: "Hammom Rakovinasi",
        price: 65.75,
        category: "RAKOVINA",
        rating: 4.6,
        sold: 203,
        description: "Oval shakldagi keramik rakovina. O'rnatish uchun qulay dizayn.",
        image: "https://images.unsplash.com/photo-1584620781857-5e6c07e3c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        features: ["Keramika", "Oval shakl", "Oson tozalash"],
        badge: null
    },
    {
        id: 5,
        name: "Premium Dush Kolonkasi",
        price: 199.99,
        category: "DUSH UCHUN",
        rating: 4.9,
        sold: 34,
        description: "Lyuks sinfdagi dush kolonkasi. 5 ta rejim, LED yoritgich.",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        features: ["5 rejim", "LED yoritgich", "Alyuminiy ramka"],
        badge: "PREMIUM"
    },
    {
        id: 6,
        name: "Santehnika Aksessuarlari",
        price: 29.99,
        category: "AKSESSUARLAR",
        rating: 4.5,
        sold: 456,
        description: "Santehnika o'rnatish uchun zarur bo'lgan barcha aksessuarlar to'plami.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        features: ["30 dona", "304 po'lat", "Korrozionga chidamli"],
        badge: "TOP"
    }
];

// Dasturni ishga tushirish
function initializeApp() {
    // Holatlarni yuklash
    loadState();

    // Agar foydalanuvchi mavjud bo'lsa
    if (state.currentUser) {
        showMainApp();
    } else {
        showLoginPage();
    }

    // DOM eventlarini o'rnatish
    setupEventListeners();
}

// Holatlarni yuklash
function loadState() {
    state.currentUser = storage.load('user');
    state.cart = storage.load('cart') || [];
    state.favorites = storage.load('favorites') || [];
    state.orders = storage.load('orders') || [];
    state.viewedProducts = storage.load('viewed') || [];
}

// Holatlarni saqlash
function saveState() {
    storage.save('user', state.currentUser);
    storage.save('cart', state.cart);
    storage.save('favorites', state.favorites);
    storage.save('orders', state.orders);
    storage.save('viewed', state.viewedProducts);
}

// Login sahifasini ko'rsatish
function showLoginPage() {
    hideAllPages();
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('mainHeader').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'none';
    document.getElementById('bottomNav').style.display = 'none';
}

// Asosiy ilovani ko'rsatish
function showMainApp() {
    hideAllPages();
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('mainHeader').style.display = 'block';
    document.getElementById('searchContainer').style.display = 'flex';
    document.getElementById('bottomNav').style.display = 'flex';

    updateUserDisplay();
    updateCartCount();
    showHome();
}

// Barcha sahifalarni yashirish
function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// Login qilish
function startApp() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();

    if (!userName) {
        showError(userNameInput, 'Iltimos, ismingizni kiriting');
        return;
    }

    // Yangi foydalanuvchi yaratish
    state.currentUser = {
        id: Date.now(),
        name: userName,
        phone: '',
        email: '',
        loyaltyPoints: 100, // Start with 100 points
        createdAt: new Date().toISOString()
    };

    saveState();
    showMainApp();
    showNotification(`Xush kelibsiz, ${userName}!`, 'success');
}

// Xatolik ko'rsatish
function showError(input, message) {
    input.classList.add('error');

    // Error tooltip yaratish
    let error = input.parentElement.querySelector('.error-message');
    if (!error) {
        error = document.createElement('div');
        error.className = 'error-message';
        input.parentElement.appendChild(error);
    }

    error.textContent = message;

    // 3 soniyadan keyin olib tashlash
    setTimeout(() => {
        input.classList.remove('error');
        error.remove();
    }, 3000);
}

// Foydalanuvchi ma'lumotlarini yangilash
function updateUserDisplay() {
    if (!state.currentUser) return;

    const elements = [
        'currentUserName',
        'profileUserName',
        'checkoutUserName',
        'confirmationUserName'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = state.currentUser.name;
        }
    });

    // Telefon raqamni ko'rsatish
    if (state.currentUser.phone) {
        const phoneElements = [
            'profileUserPhone',
            'checkoutUserPhone'
        ];

        phoneElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = state.currentUser.phone;
                element.innerHTML = `<i class="fas fa-phone"></i> ${state.currentUser.phone}`;
            }
        });
    }

    // Loyallik ballarini yangilash
    updateLoyaltyDisplay();
}

// Savat sonini yangilash
function updateCartCount() {
    const count = state.cart.reduce((total, item) => total + item.quantity, 0);

    const elements = [
        'cartCount',
        'navCartCount',
        'itemsCount'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = count;
        }
    });

    // Savat bo'sh bo'lsa yashirish
    document.querySelectorAll('.cart-count, .nav-badge').forEach(el => {
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Sahifa navigatsiyasi
function navigateTo(pageId) {
    hideAllPages();
    document.getElementById(pageId).classList.add('active');
    state.currentPage = pageId;

    // Navigatsiyani yangilash
    updateNavigation();

    // Sahifa spesifik yuklash
    switch (pageId) {
        case 'homePage':
            loadHomePage();
            break;
        case 'catalogPage':
            loadCatalog();
            break;
        case 'cartPage':
            loadCartPage();
            break;
        case 'profilePage':
            loadProfilePage();
            break;
    }
}

// Navigatsiyani yangilash
function updateNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    let navIndex = -1;
    switch (state.currentPage) {
        case 'homePage':
            navIndex = 0;
            break;
        case 'catalogPage':
            navIndex = 1;
            break;
        case 'cartPage':
            navIndex = 2;
            break;
        case 'profilePage':
            navIndex = 3;
            break;
    }

    if (navIndex >= 0) {
        document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
    }
}

// Asosiy sahifalar
function showHome() {
    navigateTo('homePage');
    state.lastPage = 'homePage';
}

function showCatalog() {
    navigateTo('catalogPage');
    state.lastPage = 'catalogPage';
}

function showCart() {
    navigateTo('cartPage');
    state.lastPage = 'cartPage';
}

function showProfile() {
    navigateTo('profilePage');
    state.lastPage = 'profilePage';
}

// Orqaga qaytish
function goBack() {
    if (state.lastPage) {
        navigateTo(state.lastPage);
    } else {
        navigateTo('homePage');
    }
}

// Kategoriya ko'rsatish
function showCategory(category) {
    state.currentCategory = category;
    showCatalog();
    loadCatalog(category);
}

// Bosh sahifani yuklash
function loadHomePage() {
    // Tavsiya etilgan mahsulotlarni ko'rsatish
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        const featuredProducts = products.slice(0, 4);
        featuredContainer.innerHTML = featuredProducts.map(product => `
            <div class="product-card" onclick="showProductDetail(${product.id})">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image" style="background-image: url('${product.image}')"></div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating} (${product.sold})
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Katalogni yuklash
function loadCatalog(category = 'all') {
    const productGrid = document.getElementById('productGrid');
    const catalogTitle = document.getElementById('catalogTitle');
    
    // Sarlavhani yangilash
    if (category === 'all') {
        catalogTitle.textContent = 'Barcha mahsulotlar';
    } else {
        catalogTitle.textContent = category;
    }
    
    // Mahsulotlarni filtrlash
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Mahsulotlarni chiqarish
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i> ${product.rating} (${product.sold})
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agar mahsulot yo'q bo'lsa
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-500);">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Hech narsa topilmadi</div>
                <div style="font-size: 0.9rem; opacity: 0.7;">Bu kategoriyada hali mahsulotlar yo'q</div>
            </div>
        `;
    }
}

// Mahsulot tafsilotlarini ko'rsatish
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Ko'rilganlarga qo'shish
    addToViewed(productId);
    
    // Tafsilotlar sahifasini to'ldirish
    // ... (oldingi kodni qo'llash)
    
    navigateTo('productDetailPage');
    state.lastPage = 'catalogPage';
}

// Savatga qo'shish
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveState();
    showNotification(`${product.name} savatchaga qo'shildi`, 'success');
}

// Savat sahifasini yuklash
function loadCartPage() {
    const cartItems = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray-500);">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Savat bo'sh</div>
                <div style="font-size: 0.9rem; opacity: 0.7;">Mahsulot qo'shish uchun katalogni ko'ring</div>
            </div>
        `;
        totalPriceElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = state.cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="btn btn-sm btn-outline" onclick="updateCartItem(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline" onclick="updateCartItem(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Savat elementini yangilash
function updateCartItem(productId, change) {
    const item = state.cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        state.cart = state.cart.filter(item => item.id !== productId);
        showNotification('Mahsulot savatdan olib tashlandi', 'warning');
    }
    
    updateCartCount();
    saveState();
    loadCartPage();
}

// Savatdan olib tashlash
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartCount();
    saveState();
    loadCartPage();
    showNotification('Mahsulot savatdan olib tashlandi', 'warning');
}

// Savatni tozalash
function clearCart() {
    if (state.cart.length === 0) return;
    
    if (confirm('Savatni tozalashni istaysizmi?')) {
        state.cart = [];
        updateCartCount();
        saveState();
        loadCartPage();
        showNotification('Savat tozalandi', 'success');
    }
}

// Profil sahifasini yuklash
function loadProfilePage() {
    // Loyallik ballarini yangilash
    updateLoyaltyDisplay();
    
    // Countlarni yangilash
    document.getElementById('ordersCount').textContent = state.orders.length;
    document.getElementById('favoritesCount').textContent = state.favorites.length;
    document.getElementById('viewedCount').textContent = state.viewedProducts.length;
    document.getElementById('loyaltyPointsBadge').textContent = state.currentUser?.loyaltyPoints || 0;
}

// Loyallik ballarini ko'rsatish
function updateLoyaltyDisplay() {
    if (!state.currentUser) return;
    
    const points = state.currentUser.loyaltyPoints || 0;
    
    document.getElementById('loyaltyPoints').textContent = points;
    
    const displayElement = document.getElementById('loyaltyPointsDisplay');
    if (displayElement) {
        displayElement.textContent = `${points} ball`;
    }
}

// Xabarlar
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    // Xabar matni
    notificationText.textContent = message;
    
    // Ikonka
    const icon = notification.querySelector('i');
    if (icon) {
        switch(type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-triangle';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle';
                break;
        }
    }
    
    // CSS klasslari
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Ko'rsatish
    notification.style.display = 'flex';
    
    // 3 soniyadan keyin yashirish
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Event listenerlarni o'rnatish
function setupEventListeners() {
    // Login sahifasi Enter tugmasi
    const userNameInput = document.getElementById('userName');
    if (userNameInput) {
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startApp();
            }
        });
    }
    
    // Qidiruv
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            if (term.length > 2) {
                searchProducts(term);
            } else if (term.length === 0) {
                loadCatalog(state.currentCategory);
            }
        });
    }
}

// Qidiruv
function searchProducts(term) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
    
    const productGrid = document.getElementById('productGrid');
    const catalogTitle = document.getElementById('catalogTitle');
    
    if (productGrid && catalogTitle) {
        catalogTitle.textContent = `Qidiruv: "${term}" (${filtered.length})`;
        
        productGrid.innerHTML = filtered.map(product => `
            <div class="product-card" onclick="showProductDetail(${product.id})">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image" style="background-image: url('${product.image}')"></div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (filtered.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Hech narsa topilmadi</div>
                    <div style="font-size: 0.9rem; opacity: 0.7;">"${term}" uchun hech qanday mahsulot topilmadi</div>
                </div>
            `;
        }
    }
}

// Chiqish
function logout() {
    if (confirm('Haqiqatan ham chiqmoqchimisiz?')) {
        state.currentUser = null;
        storage.clear();
        showLoginPage();
        showNotification('Muvaffaqiyatli chiqdingiz', 'success');
    }
}

// Mahsulotni ko'rilganlarga qo'shish
function addToViewed(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Agar allaqachon ko'rilganlarda bo'lsa
    const existingIndex = state.viewedProducts.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
        state.viewedProducts.splice(existingIndex, 1);
    }
    
    // Boshiga qo'shish
    state.viewedProducts.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        viewedAt: new Date().toISOString()
    });
    
    // Faqat 10 ta saqlash
    if (state.viewedProducts.length > 10) {
        state.viewedProducts = state.viewedProducts.slice(0, 10);
    }
    
    saveState();
}

// Mahsulot filterlari
function filterProducts(filter) {
    let filtered = [...products];
    
    switch(filter) {
        case 'popular':
            filtered.sort((a, b) => b.sold - a.sold);
            break;
        case 'new':
            filtered = filtered.filter(p => p.badge === 'YANGI' || p.badge === 'NEW');
            break;
    }
    
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        productGrid.innerHTML = filtered.map(product => `
            <div class="product-card" onclick="showProductDetail(${product.id})">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image" style="background-image: url('${product.image}')"></div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Filter tugmalarini aktiv qilish
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// DOM yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hydroline Pro - Premium versiya yuklandi');
    initializeApp();
});

// Qo'shimcha funksiyalar (Profil, Buyurtma, va h.k.)
// ... (oldingi funksiyalarni qo'llash)