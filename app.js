// Hydroline Market - Complete JavaScript Application

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_BASE_URL: 'https://api.hydroline-market.uz',
    DELIVERY_FEE: 20000,
    TAX_RATE: 0.12,
    CURRENCY: 'so\'m',
    APP_NAME: 'Hydroline Market',
    VERSION: '1.0.0'
};

// ==================== STATE MANAGEMENT ====================
let state = {
    user: null,
    token: null,
    cart: [],
    products: [],
    categories: [],
    orders: [],
    currentPage: 'home'
};

// ==================== DOM ELEMENTS ====================
const elements = {
    cartCount: () => document.getElementById('cartCount'),
    cartItemsContainer: () => document.getElementById('cartItemsContainer'),
    productsContainer: () => document.getElementById('productsContainer'),
    categoriesContainer: () => document.getElementById('categoriesContainer'),
    userName: () => document.getElementById('userName'),
    profileFullName: () => document.getElementById('profileFullName'),
    profilePhone: () => document.getElementById('profilePhone'),
    ordersTable: () => document.getElementById('ordersTable'),
    checkoutSummary: () => document.getElementById('checkoutSummary'),
    summaryItems: () => document.getElementById('summaryItems'),
    summaryTotal: () => document.getElementById('summaryTotal'),
    summaryGrandTotal: () => document.getElementById('summaryGrandTotal')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadInitialData();
    setupEventListeners();
});

function initializeApp() {
    // Load state from localStorage
    const savedState = localStorage.getItem('hydrolineState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            state = { ...state, ...parsed };
        } catch (e) {
            console.error('Failed to parse saved state:', e);
        }
    }
    
    // Update UI based on state
    updateAuthUI();
    updateCartCount();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('hydrolineCart');
    if (savedCart) {
        try {
            state.cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Failed to parse saved cart:', e);
        }
    }
}

function saveState() {
    // Don't save token for security
    const stateToSave = { ...state };
    delete stateToSave.token;
    localStorage.setItem('hydrolineState', JSON.stringify(stateToSave));
    localStorage.setItem('hydrolineCart', JSON.stringify(state.cart));
}

// ==================== DATA LOADING ====================
async function loadInitialData() {
    try {
        // Load categories
        await loadCategories();
        
        // Load products
        await loadProducts();
        
        // Load user orders if logged in
        if (state.user) {
            await loadOrders();
        }
    } catch (error) {
        console.error('Failed to load initial data:', error);
        showNotification('Datalarni yuklashda xatolik', 'error');
    }
}

async function loadCategories() {
    // Mock data - replace with actual API call
    const mockCategories = [
        { id: 1, name: 'Oziq-ovqat', icon: 'fas fa-utensils', productCount: 150 },
        { id: 2, name: 'Ichimliklar', icon: 'fas fa-wine-bottle', productCount: 80 },
        { id: 3, name: 'Go\'sht mahsulotlari', icon: 'fas fa-drumstick-bite', productCount: 45 },
        { id: 4, name: 'Sut mahsulotlari', icon: 'fas fa-cheese', productCount: 60 },
        { id: 5, name: 'Non mahsulotlari', icon: 'fas fa-bread-slice', productCount: 35 },
        { id: 6, name: 'Sabzavotlar', icon: 'fas fa-carrot', productCount: 70 },
        { id: 7, name: 'Mevalar', icon: 'fas fa-apple-alt', productCount: 55 },
        { id: 8, name: 'Shirinliklar', icon: 'fas fa-cookie', productCount: 40 }
    ];
    
    state.categories = mockCategories;
    renderCategories();
}

async function loadProducts() {
    // Show loading
    const container = elements.productsContainer();
    if (container) {
        container.innerHTML = '<div class="col-12 text-center"><div class="spinner"></div></div>';
    }
    
    // Mock data - replace with actual API call
    const mockProducts = [
        {
            id: 1,
            name: 'Sariyog\'',
            category: 'Sut mahsulotlari',
            price: 25000,
            stock: 45,
            description: 'Tabiiy sariyog\', 200g',
            rating: 4.5,
            isNew: true,
            isPopular: true
        },
        {
            id: 2,
            name: 'Non',
            category: 'Non mahsulotlari',
            price: 4000,
            stock: 120,
            description: 'Issiq non, 1kg',
            rating: 4.8,
            isNew: false,
            isPopular: true
        },
        {
            id: 3,
            name: 'Pomidor',
            category: 'Sabzavotlar',
            price: 12000,
            stock: 85,
            description: 'Qizil pomidor, 1kg',
            rating: 4.3,
            isNew: true,
            isPopular: false
        },
        {
            id: 4,
            name: 'Olma',
            category: 'Mevalar',
            price: 15000,
            stock: 65,
            description: 'Qizil olma, 1kg',
            rating: 4.6,
            isNew: false,
            isPopular: true
        },
        {
            id: 5,
            name: 'Tovuq go\'shti',
            category: 'Go\'sht mahsulotlari',
            price: 38000,
            stock: 25,
            description: 'Tovuq go\'shti, 1kg',
            rating: 4.7,
            isNew: false,
            isPopular: true
        },
        {
            id: 6,
            name: 'Pepsi',
            category: 'Ichimliklar',
            price: 9000,
            stock: 200,
            description: 'Pepsi, 1.5L',
            rating: 4.4,
            isNew: true,
            isPopular: true
        },
        {
            id: 7,
            name: 'Shokolad',
            category: 'Shirinliklar',
            price: 18000,
            stock: 90,
            description: 'Sutli shokolad, 100g',
            rating: 4.9,
            isNew: false,
            isPopular: true
        },
        {
            id: 8,
            name: 'Pishloq',
            category: 'Sut mahsulotlari',
            price: 32000,
            stock: 30,
            description: 'Pishloq, 500g',
            rating: 4.5,
            isNew: true,
            isPopular: false
        },
        {
            id: 9,
            name: 'Kartoshka',
            category: 'Sabzavotlar',
            price: 8000,
            stock: 150,
            description: 'Yangi kartoshka, 1kg',
            rating: 4.2,
            isNew: false,
            isPopular: true
        },
        {
            id: 10,
            name: 'Yogurt',
            category: 'Sut mahsulotlari',
            price: 11000,
            stock: 75,
            description: 'Tabiiy yogurt, 1L',
            rating: 4.6,
            isNew: true,
            isPopular: true
        }
    ];
    
    // Apply sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        const sortBy = sortSelect.value;
        mockProducts.sort((a, b) => {
            switch (sortBy) {
                case 'new':
                    return b.isNew - a.isNew;
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'popular':
                default:
                    return b.rating - a.rating;
            }
        });
    }
    
    state.products = mockProducts;
    renderProducts();
}

// ==================== RENDERING FUNCTIONS ====================
function renderCategories() {
    const container = elements.categoriesContainer();
    if (!container) return;
    
    container.innerHTML = state.categories.map(category => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="category-card animate-fadeInUp" onclick="filterByCategory(${category.id})">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h5 class="category-title">${category.name}</h5>
                <p class="text-muted mb-0">${category.productCount} mahsulot</p>
            </div>
        </div>
    `).join('');
}

function renderProducts() {
    const container = elements.productsContainer();
    if (!container) return;
    
    container.innerHTML = state.products.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card animate-fadeInUp">
                ${product.isNew ? '<span class="product-badge">Yangi</span>' : ''}
                ${product.stock < 10 ? '<span class="product-badge" style="background: #F59E0B;">Kam qoldiq</span>' : ''}
                
                <h5 class="product-title">${product.name}</h5>
                <p class="text-muted small">${product.category}</p>
                <p class="product-description">${product.description}</p>
                
                <div class="product-rating mb-3">
                    ${generateStars(product.rating)}
                    <span class="ms-2 small">${product.rating}</span>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <span class="product-stock ${getStockClass(product.stock)}">
                        ${getStockText(product.stock)}
                    </span>
                </div>
                
                <div class="d-flex gap-2">
                    <button class="btn-add-to-cart flex-grow-1" 
                            onclick="addToCart(${product.id})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        Savatga
                    </button>
                    <button class="btn-product-action" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-product-action" onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const container = elements.cartItemsContainer();
    if (!container) return;
    
    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                <h4>Savat bo'sh</h4>
                <p class="text-muted">Hozircha savatingizda mahsulot yo'q</p>
                <button class="btn btn-primary-premium" onclick="scrollToProducts()">
                    <i class="fas fa-shopping-bag me-2"></i>Xarid qilishni boshlash
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.cart.map(item => `
        <div class="cart-item animate-fadeIn">
            <div class="cart-item-info">
                <h6 class="cart-item-title">${item.name}</h6>
                <p class="text-muted small mb-2">${item.category || 'Umumiy'}</p>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       min="1" max="${item.stock || 99}" 
                       onchange="updateQuantity(${item.id}, parseInt(this.value))">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            
            <div class="cart-item-total ms-3">
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
            
            <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = totalPrice + CONFIG.DELIVERY_FEE;
    
    if (elements.summaryItems()) {
        elements.summaryItems().textContent = `${totalItems} dona`;
    }
    if (elements.summaryTotal()) {
        elements.summaryTotal().textContent = formatPrice(totalPrice);
    }
    if (elements.summaryGrandTotal()) {
        elements.summaryGrandTotal().textContent = formatPrice(grandTotal);
    }
}

function renderCheckoutSummary() {
    const container = elements.checkoutSummary();
    if (!container) return;
    
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = CONFIG.DELIVERY_FEE;
    const grandTotal = totalPrice + deliveryFee;
    
    container.innerHTML = `
        <div class="checkout-summary">
            <div class="d-flex justify-content-between mb-2">
                <span>Mahsulotlar (${totalItems} dona):</span>
                <span>${formatPrice(totalPrice)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Yetkazib berish:</span>
                <span>${formatPrice(deliveryFee)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between fw-bold">
                <span>Umumiy summa:</span>
                <span class="text-success">${formatPrice(grandTotal)}</span>
            </div>
        </div>
    `;
}

function renderOrders() {
    const container = elements.ordersTable();
    if (!container) return;
    
    if (state.orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-history fa-3x text-muted mb-3"></i>
                    <h5>Buyurtmalar mavjud emas</h5>
                    <p class="text-muted">Hozircha hech qanday buyurtma bermagansiz</p>
                    <button class="btn btn-primary-premium" onclick="scrollToProducts()">
                        <i class="fas fa-shopping-bag me-2"></i>Xarid qilishni boshlash
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = state.orders.map((order, index) => `
        <tr class="animate-fadeIn">
            <td>#${order.id}</td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="d-flex flex-column">
                    ${order.items.slice(0, 2).map(item => `
                        <small>${item.name} × ${item.quantity}</small>
                    `).join('')}
                    ${order.items.length > 2 ? 
                        `<small class="text-muted">+ ${order.items.length - 2} ta mahsulot</small>` : ''}
                </div>
            </td>
            <td>${formatPrice(order.total)}</td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                ${order.status === 'pending' ? `
                    <button class="btn btn-sm btn-outline-danger ms-1" onclick="cancelOrder(${order.id})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock === 0) {
        showNotification('Bu mahsulot qolmagan', 'error');
        return;
    }
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('Maxsulotdan ko\'p miqdorda qolmagan', 'warning');
            return;
        }
        existingItem.quantity++;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            quantity: 1
        });
    }
    
    updateCartCount();
    renderCart();
    saveState();
    showNotification('Savatga qo\'shildi', 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    saveState();
    showNotification('Savatdan olib tashlandi', 'info');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = state.cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = state.products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
        showNotification(`Fa-qat ${product.stock} dona mavjud`, 'warning');
        return;
    }
    
    item.quantity = newQuantity;
    updateCartCount();
    renderCart();
    saveState();
}

function clearCart() {
    if (state.cart.length === 0) return;
    
    if (confirm('Savatni tozalashni tasdiqlaysizmi?')) {
        state.cart = [];
        updateCartCount();
        renderCart();
        saveState();
        showNotification('Savat tozalandi', 'info');
    }
}

function updateCartCount() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = elements.cartCount();
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'inline' : 'none';
    }
}

// ==================== AUTHENTICATION FUNCTIONS ====================
function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showRegister() {
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function showProfile() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    // Fill profile form
    document.getElementById('profileFirstName').value = state.user.firstName || '';
    document.getElementById('profileLastName').value = state.user.lastName || '';
    document.getElementById('profileEmail').value = state.user.email || '';
    document.getElementById('profilePhone').textContent = state.user.phone || '';
    
    if (elements.profileFullName()) {
        elements.profileFullName().textContent = `${state.user.firstName} ${state.user.lastName}`;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function login() {
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!phone || !password) {
        showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'error');
        return;
    }
    
    // Mock authentication - replace with actual API call
    if (phone === '+998901234567' && password === '123456') {
        state.user = {
            id: 1,
            firstName: 'Foydalanuvchi',
            lastName: 'Hydroline',
            phone: phone,
            email: 'user@hydroline.uz',
            role: 'user'
        };
        state.token = 'mock-jwt-token-123456';
        
        updateAuthUI();
        saveState();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) modal.hide();
        
        showNotification('Muvaffaqiyatli kirildi', 'success');
        loadOrders();
    } else {
        showNotification('Telefon raqam yoki parol noto\'g\'ri', 'error');
    }
}

function register() {
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const phone = document.getElementById('registerPhone').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!firstName || !lastName || !phone || !password) {
        showNotification('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Parollar mos kelmadi', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Parol kamida 6 ta belgidan iborat bo\'lishi kerak', 'error');
        return;
    }
    
    // Mock registration - replace with actual API call
    state.user = {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        email,
        role: 'user'
    };
    state.token = 'mock-jwt-token-' + Date.now();
    
    updateAuthUI();
    saveState();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (modal) modal.hide();
    
    showNotification('Muvaffaqiyatli ro\'yxatdan o\'tdingiz', 'success');
}

function logout() {
    if (confirm('Chiqishni tasdiqlaysizmi?')) {
        state.user = null;
        state.token = null;
        updateAuthUI();
        saveState();
        showNotification('Chiqildi', 'info');
    }
}

function updateAuthUI() {
    const userName = elements.userName();
    if (userName) {
        if (state.user) {
            userName.textContent = `${state.user.firstName}`;
            document.querySelectorAll('.dropdown-item[onclick="showLogin()"]').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.dropdown-item[onclick="showRegister()"]').forEach(el => el.style.display = 'none');
        } else {
            userName.textContent = 'Kirish';
            document.querySelectorAll('.dropdown-item[onclick="showProfile()"]').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.dropdown-item[onclick="showOrders()"]').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.dropdown-item[onclick="logout()"]').forEach(el => el.style.display = 'none');
        }
    }
}

// ==================== ORDER FUNCTIONS ====================
async function loadOrders() {
    if (!state.user) return;
    
    // Mock orders - replace with actual API call
    state.orders = [
        {
            id: 1001,
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            items: [
                { id: 1, name: 'Sariyog\'', quantity: 2, price: 25000 },
                { id: 6, name: 'Pepsi', quantity: 1, price: 9000 }
            ],
            total: 59000,
            status: 'delivered',
            address: 'Toshkent shahri, Yunusobod tumani'
        },
        {
            id: 1002,
            date: new Date(Date.now() - 86400000 * 1).toISOString(),
            items: [
                { id: 5, name: 'Tovuq go\'shti', quantity: 1, price: 38000 },
                { id: 8, name: 'Pishloq', quantity: 1, price: 32000 }
            ],
            total: 70000,
            status: 'processing',
            address: 'Toshkent shahri, Mirzo Ulug\'bek tumani'
        },
        {
            id: 1003,
            date: new Date().toISOString(),
            items: [
                { id: 3, name: 'Pomidor', quantity: 3, price: 12000 },
                { id: 4, name: 'Olma', quantity: 2, price: 15000 },
                { id: 9, name: 'Kartoshka', quantity: 5, price: 8000 }
            ],
            total: 106000,
            status: 'pending',
            address: 'Toshkent shahri, Yashnobod tumani'
        }
    ];
    
    renderOrders();
}

function showOrders() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('ordersModal'));
    modal.show();
}

function checkout() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    if (state.cart.length === 0) {
        showNotification('Savat bo\'sh', 'warning');
        return;
    }
    
    renderCheckoutSummary();
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

function placeOrder() {
    const city = document.getElementById('checkoutCity').value;
    const district = document.getElementById('checkoutDistrict').value;
    const address = document.getElementById('checkoutAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (!city || !district || !address) {
        showNotification('Iltimos, barcha manzil maydonlarini to\'ldiring', 'error');
        return;
    }
    
    // Create order
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...state.cart],
        total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + CONFIG.DELIVERY_FEE,
        status: 'pending',
        address: `${city}, ${district}, ${address}`,
        paymentMethod: paymentMethod
    };
    
    state.orders.unshift(newOrder);
    state.cart = [];
    
    updateCartCount();
    saveState();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (modal) modal.hide();
    
    showNotification('Buyurtma muvaffaqiyatli qabul qilindi!', 'success');
    
    // Mock payment processing
    if (paymentMethod !== 'cash') {
        setTimeout(() => {
            if (confirm(`To'lovni amalga oshirish uchun ${paymentMethod.toUpperCase()} tizimiga o'tasizmi?`)) {
                window.open(`https://${paymentMethod}.uz/payment`, '_blank');
            }
        }, 1000);
    }
}

// ==================== UI FUNCTIONS ====================
function showCart() {
    renderCart();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function scrollToCategories() {
    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) return;
    
    const filtered = state.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    // Highlight search results
    showNotification(`${filtered.length} ta mahsulot topildi`, 'info');
}

function filterByCategory(categoryId) {
    const category = state.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    showNotification(`${category.name} kategoriyasi tanlandi`, 'info');
    // Implement actual filtering
}

// ==================== UTILITY FUNCTIONS ====================
function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0
    }).format(price).replace('UZS', 'so\'m');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function getStockClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
}

function getStockText(stock) {
    if (stock === 0) return 'Qolmagan';
    if (stock < 10) return `Qolgan: ${stock} dona`;
    return 'Mavjud';
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Kutilmoqda',
        'processing': 'Jarayonda',
        'delivered': 'Yetkazilgan',
        'cancelled': 'Bekor qilingan'
    };
    return statusMap[status] || status;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Search input enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            register();
        });
    }
    
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateProfile();
        });
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            placeOrder();
        });
    }
    
    // Sort change
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', loadProducts);
    }
    
    // Prevent form submission on enter in quantity inputs
    document.addEventListener('keypress', (e) => {
        if (e.target.classList.contains('quantity-input') && e.key === 'Enter') {
            e.preventDefault();
        }
    });
}

// ==================== ADDITIONAL FUNCTIONS ====================
function updateProfile() {
    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const email = document.getElementById('profileEmail').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    
    if (!firstName || !lastName) {
        showNotification('Ism va familiya maydonlari to\'ldirilishi shart', 'error');
        return;
    }
    
    // Update user
    state.user.firstName = firstName;
    state.user.lastName = lastName;
    state.user.email = email;
    
    if (newPassword && newPassword.length >= 6) {
        // In real app, send password update request
        showNotification('Profil yangilandi. Yangi parol saqlandi', 'success');
    } else {
        showNotification('Profil yangilandi', 'success');
    }
    
    updateAuthUI();
    saveState();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (modal) modal.hide();
}

function viewProduct(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    // Show product details in a modal or redirect to product page
    alert(`${product.name}\n\nNarxi: ${formatPrice(product.price)}\nTavsif: ${product.description}\nQoldiq: ${product.stock} dona`);
}

function addToWishlist(productId) {
    if (!state.user) {
        showLogin();
        return;
    }
    
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    // Implement wishlist functionality
    showNotification('Sevimlilarga qo\'shildi', 'success');
}

function viewOrder(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;
    
    const itemsList = order.items.map(item => 
        `${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join('\n');
    
    alert(`Buyurtma #${order.id}\n\nSana: ${formatDate(order.date)}\nHolati: ${getStatusText(order.status)}\nManzil: ${order.address}\n\nMahsulotlar:\n${itemsList}\n\nUmumiy: ${formatPrice(order.total)}`);
}

function cancelOrder(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending') return;
    
    if (confirm('Buyurtmani bekor qilishni tasdiqlaysizmi?')) {
        order.status = 'cancelled';
        renderOrders();
        saveState();
        showNotification('Buyurtma bekor qilindi', 'info');
    }
}

// ==================== WINDOW FUNCTIONS ====================
// Make functions available globally
window.addToCart = addToCart;
window.showCart = showCart;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showProfile = showProfile;
window.showOrders = showOrders;
window.logout = logout;
window.checkout = checkout;
window.clearCart = clearCart;
window.scrollToProducts = scrollToProducts;
window.scrollToCategories = scrollToCategories;
window.searchProducts = searchProducts;
window.filterByCategory = filterByCategory;
window.togglePassword = togglePassword;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.viewProduct = viewProduct;
window.addToWishlist = addToWishlist;
window.viewOrder = viewOrder;
window.cancelOrder = cancelOrder;