// Hydroline Market - Complete Application
// DARHOL ISHGA TUSHADI, YUKLANMOQDA BO'LMAYDI

// ==================== GLOBAL STATE ====================
const state = {
    user: null,
    cart: [],
    products: [],
    categories: [],
    orders: [],
    currentPage: 1,
    itemsPerPage: 8,
    totalProducts: 0
};

// ==================== INITIALIZATION ====================
// Sayt yuklanganda darhol ishga tushadi
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hydroline Market loading...');
    
    // Load saved data from localStorage
    loadFromStorage();
    
    // Update UI
    updateCartUI();
    updateAuthUI();
    
    // Load initial data (darhol, kutishsiz)
    loadCategories();
    loadProducts();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Hydroline Market loaded successfully!');
});

// ==================== STORAGE FUNCTIONS ====================
function loadFromStorage() {
    // Load user
    const userData = localStorage.getItem('hydroline_user');
    if (userData) {
        state.user = JSON.parse(userData);
    }
    
    // Load cart
    const cartData = localStorage.getItem('hydroline_cart');
    if (cartData) {
        state.cart = JSON.parse(cartData);
    }
    
    // Load orders
    const ordersData = localStorage.getItem('hydroline_orders');
    if (ordersData) {
        state.orders = JSON.parse(ordersData);
    }
}

function saveToStorage() {
    if (state.user) {
        localStorage.setItem('hydroline_user', JSON.stringify(state.user));
    }
    localStorage.setItem('hydroline_cart', JSON.stringify(state.cart));
    localStorage.setItem('hydroline_orders', JSON.stringify(state.orders));
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// ==================== DATA FUNCTIONS ====================
function loadCategories() {
    // Mock categories - real API ga o'zgartiriladi
    const categories = [
        { id: 1, name: 'Oziq-ovqat', icon: 'fas fa-utensils', count: 150 },
        { id: 2, name: 'Ichimliklar', icon: 'fas fa-wine-bottle', count: 80 },
        { id: 3, name: 'Go\'sht mahsulotlari', icon: 'fas fa-drumstick-bite', count: 45 },
        { id: 4, name: 'Sut mahsulotlari', icon: 'fas fa-cheese', count: 60 },
        { id: 5, name: 'Non mahsulotlari', icon: 'fas fa-bread-slice', count: 35 },
        { id: 6, name: 'Sabzavotlar', icon: 'fas fa-carrot', count: 70 },
        { id: 7, name: 'Mevalar', icon: 'fas fa-apple-alt', count: 55 },
        { id: 8, name: 'Shirinliklar', icon: 'fas fa-cookie', count: 40 }
    ];
    
    state.categories = categories;
    renderCategories();
}

function loadProducts() {
    // Mock products - real API ga o'zgartiriladi
    const products = [
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
        products.sort((a, b) => {
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
    
    state.products = products;
    state.totalProducts = products.length;
    renderProducts();
}

// ==================== RENDER FUNCTIONS ====================
function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    
    const html = state.categories.map(cat => `
        <div class="col-6 col-md-3">
            <div class="category-card" onclick="filterCategory(${cat.id})">
                <div class="category-icon">
                    <i class="${cat.icon}"></i>
                </div>
                <h5 class="mt-3">${cat.name}</h5>
                <p class="text-muted mb-0">${cat.count} mahsulot</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (state.products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4>Mahsulotlar topilmadi</h4>
                <p class="text-muted">Hozircha mahsulotlar mavjud emas</p>
            </div>
        `;
        return;
    }
    
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const productsToShow = state.products.slice(start, end);
    
    const html = productsToShow.map(product => {
        const badge = product.isNew ? '<span class="badge bg-success">Yangi</span>' : 
                     product.stock < 10 ? '<span class="badge bg-warning text-dark">Kam qoldiq</span>' : '';
        
        const stockClass = product.stock === 0 ? 'status-out-of-stock' : 
                          product.stock < 10 ? 'status-low-stock' : 'status-in-stock';
        
        const stockText = product.stock === 0 ? 'Qolmagan' : 
                         product.stock < 10 ? `${product.stock} dona qoldi` : 'Mavjud';
        
        const stars = '★★★★★'.slice(0, Math.floor(product.rating)) + 
                     (product.rating % 1 >= 0.5 ? '½' : '') +
                     '☆☆☆☆☆'.slice(Math.ceil(product.rating));
        
        return `
            <div class="col-md-3 col-sm-6 mb-4">
                <div class="card product-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${product.name}</h5>
                            ${badge}
                        </div>
                        <p class="text-muted small mb-2">${product.category}</p>
                        <p class="card-text">${product.description}</p>
                        
                        <div class="mb-2">
                            <span class="text-warning">${stars}</span>
                            <small class="text-muted ms-1">${product.rating}</small>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="text-primary mb-0">${formatPrice(product.price)}</h4>
                            <span class="product-status ${stockClass}">${stockText}</span>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})" 
                                    ${product.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus me-2"></i>Savatga
                            </button>
                            <button class="btn btn-outline-primary" onclick="viewProduct(${product.id})">
                                <i class="fas fa-eye me-2"></i>Ko'rish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;
    
    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h4>Savat bo'sh</h4>
                <p class="text-muted">Hozircha savatingizda mahsulot yo'q</p>
                <button class="btn btn-primary" onclick="scrollToProducts()">
                    <i class="fas fa-shopping-bag me-2"></i>Xarid qilishni boshlash
                </button>
            </div>
        `;
        return;
    }
    
    const html = state.cart.map(item => {
        const total = item.price * item.quantity;
        
        return `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                    <div class="col-md-3">
                        <span class="fw-bold">${formatPrice(item.price)}</span>
                    </div>
                    <div class="col-md-3">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-3">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <span class="fw-bold">${formatPrice(total)}</span>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    updateCartSummary();
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    if (!container) return;
    
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 20000;
    const total = subtotal + delivery;
    
    container.innerHTML = `
        <div>
            <div class="d-flex justify-content-between mb-2">
                <span>Mahsulotlar (${totalItems} dona):</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Yetkazib berish:</span>
                <span>${formatPrice(delivery)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between fw-bold fs-5">
                <span>Umumiy summa:</span>
                <span class="text-success">${formatPrice(total)}</span>
            </div>
        </div>
    `;
}

function renderOrders() {
    const container = document.getElementById('ordersTable');
    if (!container) return;
    
    if (state.orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="fas fa-history fa-3x text-muted mb-3"></i>
                    <h5>Buyurtmalar mavjud emas</h5>
                    <p class="text-muted">Hozircha hech qanday buyurtma bermagansiz</p>
                </td>
            </tr>
        `;
        return;
    }
    
    const html = state.orders.map(order => {
        const statusClass = getOrderStatusClass(order.status);
        const statusText = getOrderStatusText(order.status);
        const itemsText = order.items.map(item => `${item.name} × ${item.quantity}`).join(', ');
        
        return `
            <tr>
                <td>#${order.id}</td>
                <td>${formatDate(order.date)}</td>
                <td><small>${itemsText}</small></td>
                <td>${formatPrice(order.total)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewOrder(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) {
        showAlert('Mahsulot topilmadi', 'danger');
        return;
    }
    
    if (product.stock === 0) {
        showAlert('Bu mahsulot qolmagan', 'warning');
        return;
    }
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showAlert('Maxsulotdan ko\'p miqdorda qolmagan', 'warning');
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
    
    updateCartUI();
    saveToStorage();
    showAlert('Savatga qo\'shildi', 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartUI();
    saveToStorage();
    showAlert('Savatdan olib tashlandi', 'info');
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
        showAlert(`Fa-qat ${product.stock} dona mavjud`, 'warning');
        return;
    }
    
    item.quantity = newQuantity;
    updateCartUI();
    saveToStorage();
}

function clearCart() {
    if (state.cart.length === 0) return;
    
    if (confirm('Savatni tozalashni tasdiqlaysizmi?')) {
        state.cart = [];
        updateCartUI();
        saveToStorage();
        showAlert('Savat tozalandi', 'info');
    }
}

function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all cart count elements
    ['floatingCartCount', 'mobileCartCount', 'navCartCount'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    });
    
    // Update cart summary if cart modal is open
    updateCartSummary();
}

function updateCartSummary() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 20000;
    const grandTotal = totalPrice + delivery;
    
    const summaryItems = document.getElementById('summaryItems');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryGrandTotal = document.getElementById('summaryGrandTotal');
    
    if (summaryItems) summaryItems.textContent = `${totalItems} dona`;
    if (summaryTotal) summaryTotal.textContent = formatPrice(totalPrice);
    if (summaryGrandTotal) summaryGrandTotal.textContent = formatPrice(grandTotal);
}

// ==================== AUTH FUNCTIONS ====================
function login() {
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!phone || !password) {
        showAlert('Iltimos, barcha maydonlarni to\'ldiring', 'danger');
        return;
    }
    
    // Mock login - real API ga o'zgartiriladi
    if (phone === '+998901234567' && password === '123456') {
        state.user = {
            id: 1,
            firstName: 'Foydalanuvchi',
            lastName: 'Hydroline',
            phone: phone,
            email: 'user@hydroline.uz'
        };
        
        saveToStorage();
        updateAuthUI();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) modal.hide();
        
        showAlert('Muvaffaqiyatli kirildi', 'success');
    } else {
        showAlert('Telefon raqam yoki parol noto\'g\'ri', 'danger');
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
        showAlert('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Parollar mos kelmadi', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak', 'danger');
        return;
    }
    
    // Mock registration
    state.user = {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        email,
        role: 'user'
    };
    
    saveToStorage();
    updateAuthUI();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (modal) modal.hide();
    
    showAlert('Muvaffaqiyatli ro\'yxatdan o\'tdingiz', 'success');
}

function updateProfile() {
    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const email = document.getElementById('profileEmail').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    
    if (!firstName || !lastName) {
        showAlert('Ism va familiya maydonlari to\'ldirilishi shart', 'danger');
        return;
    }
    
    state.user.firstName = firstName;
    state.user.lastName = lastName;
    state.user.email = email;
    
    saveToStorage();
    updateAuthUI();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (modal) modal.hide();
    
    showAlert('Profil yangilandi', 'success');
}

function logout() {
    if (confirm('Chiqishni tasdiqlaysizmi?')) {
        state.user = null;
        saveToStorage();
        updateAuthUI();
        showAlert('Chiqildi', 'info');
        closeNavbar();
    }
}

function updateAuthUI() {
    const userName = document.getElementById('userName');
    const profileFullName = document.getElementById('profileFullName');
    const profilePhone = document.getElementById('profilePhone');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (state.user) {
        if (userName) userName.textContent = `${state.user.firstName}`;
        if (profileFullName) profileFullName.textContent = `${state.user.firstName} ${state.user.lastName}`;
        if (profilePhone) profilePhone.textContent = state.user.phone;
        if (profileFirstName) profileFirstName.value = state.user.firstName;
        if (profileLastName) profileLastName.value = state.user.lastName;
        if (profileEmail) profileEmail.value = state.user.email || '';
    } else {
        if (userName) userName.textContent = 'Kirish';
        if (profileFullName) profileFullName.textContent = 'Foydalanuvchi';
        if (profilePhone) profilePhone.textContent = '';
    }
}

// ==================== ORDER FUNCTIONS ====================
function placeOrder() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    if (state.cart.length === 0) {
        showAlert('Savat bo\'sh', 'warning');
        return;
    }
    
    const city = document.getElementById('checkoutCity').value;
    const district = document.getElementById('checkoutDistrict').value;
    const address = document.getElementById('checkoutAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (!city || !district || !address) {
        showAlert('Iltimos, barcha manzil maydonlarini to\'ldiring', 'danger');
        return;
    }
    
    // Create order
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...state.cart],
        total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 20000,
        status: 'pending',
        address: `${city}, ${district}, ${address}`,
        paymentMethod: paymentMethod
    };
    
    state.orders.unshift(newOrder);
    state.cart = [];
    
    updateCartUI();
    saveToStorage();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (modal) modal.hide();
    
    showAlert('Buyurtma muvaffaqiyatli qabul qilindi!', 'success');
    
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
function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
    closeNavbar();
}

function showRegister() {
    // Close login modal if open
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
    closeNavbar();
}

function showCart() {
    renderCart();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
    closeNavbar();
}

function showProfile() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
    closeNavbar();
}

function showOrders() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    renderOrders();
    const modal = new bootstrap.Modal(document.getElementById('ordersModal'));
    modal.show();
    closeNavbar();
}

function checkout() {
    if (!state.user) {
        showLogin();
        return;
    }
    
    if (state.cart.length === 0) {
        showAlert('Savat bo\'sh', 'warning');
        return;
    }
    
    renderCheckoutSummary();
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
    closeNavbar();
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    closeNavbar();
}

function scrollToCategories() {
    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    closeNavbar();
}

function closeNavbar() {
    const navbar = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbar && navbar.classList.contains('show')) {
        navbar.classList.remove('show');
        if (navbarToggler) {
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = 'auto';
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatPrice(price) {
    return price.toLocaleString('uz-UZ') + ' so\'m';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ');
}

function getOrderStatusClass(status) {
    const classes = {
        'pending': 'badge-pending',
        'processing': 'badge-processing',
        'delivered': 'badge-delivered',
        'cancelled': 'badge-cancelled'
    };
    return classes[status] || 'badge-secondary';
}

function getOrderStatusText(status) {
    const texts = {
        'pending': 'Kutilmoqda',
        'processing': 'Jarayonda',
        'delivered': 'Yetkazilgan',
        'cancelled': 'Bekor qilingan'
    };
    return texts[status] || status;
}

function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = `
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add CSS for animation
    if (!document.querySelector('style#alert-animation')) {
        const style = document.createElement('style');
        style.id = 'alert-animation';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }
    }, 5000);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('button');
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

// ==================== SEARCH AND FILTER ====================
function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        loadProducts(); // Reset to all products
        return;
    }
    
    const filtered = state.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    const container = document.getElementById('productsContainer');
    if (container && filtered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>"${query}" bo'yicha natija topilmadi</h4>
                <p class="text-muted">Boshqa so'z bilan qidirib ko'ring</p>
            </div>
        `;
    } else if (container) {
        // Temporarily show filtered results
        const originalProducts = state.products;
        state.products = filtered;
        renderProducts();
        state.products = originalProducts;
    }
}

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        showAlert(`"${query}" bo'yicha qidirilmoqda...`, 'info');
    }
}

function filterCategory(categoryId) {
    const category = state.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    showAlert(`${category.name} kategoriyasi tanlandi`, 'info');
    scrollToProducts();
}

function loadMoreProducts() {
    state.currentPage++;
    loadProducts();
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
window.filterCategory = filterCategory;
window.togglePassword = togglePassword;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.viewProduct = function(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    alert(`${product.name}\n\nNarxi: ${formatPrice(product.price)}\nTavsif: ${product.description}\nQoldiq: ${product.stock} dona`);
};
window.viewOrder = function(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;
    
    const itemsList = order.items.map(item => 
        `${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join('\n');
    
    alert(`Buyurtma #${order.id}\n\nSana: ${formatDate(order.date)}\nHolati: ${getOrderStatusText(order.status)}\nManzil: ${order.address}\n\nMahsulotlar:\n${itemsList}\n\nUmumiy: ${formatPrice(order.total)}`);
};
window.loadMoreProducts = loadMoreProducts;
window.closeNavbar = closeNavbar;
window.showAllCategories = function() {
    showAlert('Barcha kategoriyalar yuklanmoqda...', 'info');
};

// ==================== INITIAL DATA ====================
// If no orders exist, create some sample orders
if (!state.orders || state.orders.length === 0) {
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
        }
    ];
    saveToStorage();
}