// ===== KONFIGURATSIYA =====
const TELEGRAM_BOT_TOKEN = "7692859653:AAE_8ddxOhqdjiqV8nJMQCp1ud46jvSGlDE";
const TELEGRAM_CHAT_ID = "7245353315";
const EXCHANGE_RATE = 12500;

// ===== GLOBAL O'ZGARUVCHILAR =====
let cart = [];
let currentUser = null;
let currentCategory = "all";
let lastPage = "homePage";
let currentOrder = null;
let favorites = [];
let orders = [];
let viewedProducts = [];
let addresses = [];
let notificationsEnabled = true;

// ===== LOCAL STORAGE FUNKSIYALARI =====
function loadFromLocalStorage() {
    try {
        const savedUser = localStorage.getItem('hydroline_user');
        if (savedUser) currentUser = JSON.parse(savedUser);

        const savedCart = localStorage.getItem('hydroline_cart');
        if (savedCart) cart = JSON.parse(savedCart);

        const savedFavorites = localStorage.getItem('hydroline_favorites');
        if (savedFavorites) favorites = JSON.parse(savedFavorites);

        const savedOrders = localStorage.getItem('hydroline_orders');
        if (savedOrders) orders = JSON.parse(savedOrders);

        const savedViewed = localStorage.getItem('hydroline_viewed');
        if (savedViewed) viewedProducts = JSON.parse(savedViewed);

        const savedAddresses = localStorage.getItem('hydroline_addresses');
        if (savedAddresses) addresses = JSON.parse(savedAddresses);

        const savedNotifications = localStorage.getItem('hydroline_notifications');
        if (savedNotifications) notificationsEnabled = JSON.parse(savedNotifications);
    } catch (error) {
        console.error('LocalStorage xatosi:', error);
        resetData();
    }
}

function saveToLocalStorage() {
    try {
        if (currentUser) localStorage.setItem('hydroline_user', JSON.stringify(currentUser));
        localStorage.setItem('hydroline_cart', JSON.stringify(cart));
        localStorage.setItem('hydroline_favorites', JSON.stringify(favorites));
        localStorage.setItem('hydroline_orders', JSON.stringify(orders));
        localStorage.setItem('hydroline_viewed', JSON.stringify(viewedProducts));
        localStorage.setItem('hydroline_addresses', JSON.stringify(addresses));
        localStorage.setItem('hydroline_notifications', JSON.stringify(notificationsEnabled));
    } catch (error) {
        console.error('Saqlash xatosi:', error);
    }
}

function resetData() {
    currentUser = null;
    cart = [];
    favorites = [];
    orders = [];
    viewedProducts = [];
    addresses = [];
    notificationsEnabled = true;
}

// ===== VILOYAT VA TUMANLAR =====
const regions = {
    Toshkent: ["Olmazor", "Bektemir", "Mirobod", "Mirzo Ulug'bek", "Sergeli", "Shayxontohur", "Chilonzor", "Yashnobod", "Yunusobod", "Yakkasaroy", "Uchtepa"],
    Andijon: ["Andijon shahri", "Xonobod", "Shahrixon", "Asaka", "Qo'rg'ontepa", "Baliqchi", "Oltinko'l", "Jalaquduq", "Izboskan", "Paxtaobod", "Marhamat", "Buloqboshi", "Boz", "Ulug'nor"],
    "Farg'ona": ["Farg'ona shahri", "Marg'ilon", "Qo'qon", "Quvasoy", "Beshariq", "Bog'dod", "Buvayda", "Dang'ara", "Yozyovon", "Oltiariq", "Qo'shtepa", "Rishton", "So'x", "Toshloq", "Uchko'prik", "O'zbekiston"],
    Namangan: ["Namangan shahri", "Chortoq", "Chust", "Kosonsoy", "Mingbuloq", "Norin", "Pop", "To'raqo'rg'on", "Uchqo'rg'on", "Uychi", "Yangiqo'rg'on"],
    Samarqand: ["Samarqand shahri", "Bulung'ur", "Ishtixon", "Jomboy", "Kattaqo'rg'on", "Narpay", "Nurobod", "Oqdaryo", "Paxtachi", "Payariq", "Pastdarg'om", "Qo'shrabot", "Toyloq", "Urgut"],
    Buxoro: ["Buxoro shahri", "Olot", "G'ijduvon", "Jondor", "Kogon", "Qorako'l", "Qorovulbozor", "Peshku", "Romitan", "Shofirkon", "Vobkent"],
    Xorazm: ["Urganch shahri", "Xiva", "Bog'ot", "Gurlan", "Qo'shko'pir", "Shovot", "Tuproqqal'a", "Xonqa", "Xazorasp", "Yangiariq", "Yangibozor"],
    Navoiy: ["Navoiy shahri", "Zarafshon", "Karmana", "Konimex", "Navbahor", "Nurota", "Tomdi", "Uchquduq"],
    Qashqadaryo: ["Qarshi shahri", "Shahrisabz", "Chiroqchi", "Dehqonobod", "G'uzor", "Kasbi", "Kitob", "Koson", "Mirishkor", "Muborak", "Nishon", "Qamashi", "Yakkabog'"],
    Surxondaryo: ["Termiz shahri", "Bandixon", "Boysun", "Denov", "Jarqo'rg'on", "Muzrabot", "Oltinsoy", "Qiziriq", "Qumqo'rg'on", "Sariosiyo", "Sherobod", "Sho'rchi", "Uzun"],
    Jizzax: ["Jizzax shahri", "Arnasoy", "Baxmal", "Do'stlik", "Forish", "G'allaorol", "Sharof Rashidov", "Mirzacho'l", "Paxtakor", "Yangiobod", "Zomin", "Zafarobod"],
    Sirdaryo: ["Guliston shahri", "Boyovut", "Oqoltin", "Sayxunobod", "Sardoba", "Sirdaryo shahri", "Xovos", "Yangiyer"],
    "Qoraqalpog'iston": ["Nukus shahri", "Amudaryo", "Beruniy", "Chimboy", "Ellikqal'a", "Kegeyli", "Mo'ynoq", "Nukus tumani", "Qonliko'l", "Qo'ng'irot", "Shumanay", "Taxtako'pir", "To'rtko'l", "Xo'jayli"],
};

// ===== DASTLABKI MAHSULOTLAR =====
const sampleProducts = [{
        id: 1,
        name: "Premium Rakovina Mixer",
        price: 89.99,
        bonus: 15,
        category: "RAKOVINA UCHUN",
        description: "Zamonaviy dizaynga ega premium rakovina mixer. Mis material, teginishsiz sensor, sovuq va issiq suvni aralashtirish.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Material: Mis", "Rang: Xrom", "Sensor: Teginishsiz", "Kuchlanish: 220V", "Kafolat: 5 yil"]
    },
    {
        id: 2,
        name: "Dush Kabinasi",
        price: 349.99,
        bonus: 20,
        category: "DUSH UCHUN",
        description: "Shisha dush kabinasi, 8 turdagi massage rejimi, LED yoritish, suv tejovchi texnologiya.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["O'lcham: 90x90x210cm", "Material: Shisha", "Massage: 8 tur", "Yoritish: LED", "Kafolat: 3 yil"]
    },
    {
        id: 3,
        name: "Granit Rakovina",
        price: 249.99,
        bonus: 12,
        category: "RAKOVINA",
        description: "Tabiiy granit materialidan tayyorlangan rakovina. Yuqori chidamlilik, moyaga chidamli sirt.",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Material: Granit", "O'lcham: 50x40cm", "Rang: Kulrang", "Moyaga chidamli", "Kafolat: 10 yil"]
    },
    {
        id: 4,
        name: "Oshxona Mixer",
        price: 129.99,
        bonus: 10,
        category: "OSHXONA UCHUN",
        description: "Oshxona uchun professional mixer. Hosildorligi yuqori, 3 turdagi o'rnatish, aero-miks texnologiyasi.",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Quvvat: 750W", "Idish: 5L", "Tezlik: 7 tur", "Material: Zanglamas po'lat", "Kafolat: 2 yil"]
    },
    {
        id: 5,
        name: "Dush Paneli",
        price: 179.99,
        bonus: 8,
        category: "DUSH UCHUN",
        description: "12 turdagi suv rejimiga ega dush paneli. Termostat, suv tejash, o'z-o'zini tozalash.",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Rejim: 12 tur", "Termostat: Bor", "Material: Plastik", "O'rnatish: Oson", "Kafolat: 5 yil"]
    },
    {
        id: 6,
        name: "Rakovina Aksessuar Seti",
        price: 39.99,
        bonus: 5,
        category: "AKSESSUARLAR",
        description: "9 donadan iborat rakovina aksessuarlari to'plami. Zanglamas po'lat, o'zgaruvchan dizayn.",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Donasi: 9 dona", "Material: Zanglamas po'lat", "Dizayn: O'zgaruvchan", "Kafolat: 1 yil"]
    },
    {
        id: 7,
        name: "Smart Suv Filtr",
        price: 299.99,
        bonus: 25,
        category: "Barcha kategoriyalar",
        description: "Aqlli suv filtr tizimi. TDS sensor, mineral qo'shish, mobil ilova bilan boshqarish.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Filtr: 7 bosqich", "Sensor: TDS", "Boshqarish: Mobil ilova", "Kafolat: 3 yil"]
    },
    {
        id: 8,
        name: "Hammom Braketi",
        price: 29.99,
        bonus: 3,
        category: "AKSESSUARLAR",
        description: "Universal hammom braketi. Barcha standart dushlar uchun, teginishsiz sozlash.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Material: Alyuminiy", "Universal: Ha", "Sozlash: Teginishsiz", "Kafolat: 1 yil"]
    },
    {
        id: 9,
        name: "Oshxona Rakovinasi",
        price: 189.99,
        bonus: 15,
        category: "OSHXONA UCHUN",
        description: "Ikki bo'shliqli oshxona rakovinasi. Kompakt dizayn, moyaga chidamli sirt.",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Bo'shliq: 2 ta", "Material: Fayans", "O'lcham: 80x50cm", "Kafolat: 5 yil"]
    },
    {
        id: 10,
        name: "Dush Golovkasi",
        price: 49.99,
        bonus: 7,
        category: "DUSH UCHUN",
        description: "Massajli dush golovkasi. 5 turdagi suv strusi, rezinali shlang, oson tozalash.",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Strusa: 5 tur", "Material: Plastik", "Shlang: Rezina", "Kafolat: 2 yil"]
    }
];

// ===== ASOSIY FUNKSIYALAR =====
function initializeApp() {
    loadFromLocalStorage();

    if (currentUser && currentUser.name) {
        showMainApp();
        showNotification(`Xush kelibsiz, ${currentUser.name}!`, "success");
    } else {
        showLoginPage();
    }

    populateRegions();
    loadFeaturedProducts();
    updateCartBadge();
}

function startApp() {
    const userName = document.getElementById("userName").value.trim();

    if (!userName) {
        showNotification("Iltimos, ismingizni kiriting!", "error");
        document.getElementById("userName").focus();
        return;
    }

    currentUser = {
        name: userName,
        phone: "",
        email: "",
        loyaltyPoints: 0,
        joinDate: new Date().toISOString()
    };

    saveToLocalStorage();
    showMainApp();
    showNotification(`Xush kelibsiz, ${userName}!`, "success");
}

function showMainApp() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainApp").style.display = "block";

    updateUserDisplay();
    showHome();
    updateAllBadges();
}

function showLoginPage() {
    document.getElementById("mainApp").style.display = "none";
    document.getElementById("loginContainer").style.display = "flex";
    document.getElementById("userName").value = "";
    document.getElementById("userName").focus();
}

function updateUserDisplay() {
    if (!currentUser) return;

    const elements = [
        "currentUserName", "profileUserName", "checkoutUserName", "confirmationUserName"
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = currentUser.name;
    });

    const phoneElements = ["profileUserPhone", "checkoutUserPhone"];
    if (currentUser.phone) {
        phoneElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = currentUser.phone;
        });
        document.getElementById("userPhone").value = currentUser.phone;
    }

    document.getElementById("loyaltyPoints").textContent = `${currentUser.loyaltyPoints || 0} ball`;
    document.getElementById("loyaltyPointsBadge").textContent = currentUser.loyaltyPoints || 0;
}

function updateAllBadges() {
    updateCartBadge();
    updateFavoritesBadge();
    updateOrdersBadge();
    updateViewedBadge();
}

// ===== SAHIFA NAVIGATSIYASI =====
function switchPage(pageId) {
    if (!["profilePage", "homePage", "catalogPage", "cartPage"].includes(pageId)) {
        lastPage = pageId;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    updateNavigation(pageId);
}

function updateNavigation(pageId) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    const pageMap = {
        "homePage": 0,
        "catalogPage": 1,
        "cartPage": 2,
        "profilePage": 3,
        "ordersPage": 3,
        "favoritesPage": 3,
        "viewedPage": 3,
        "addressesPage": 3,
        "loyaltyPage": 3
    };

    const index = pageMap[pageId];
    if (index !== undefined) {
        navItems[index].classList.add("active");
    }
}

function goBack() {
    if (["profilePage", "homePage", "catalogPage", "cartPage"].includes(lastPage)) {
        switchPage(lastPage);
    } else {
        switchPage("profilePage");
    }
}

function showHome() {
    switchPage("homePage");
    lastPage = "homePage";
    loadFeaturedProducts();
}

function showCatalog() {
    switchPage("catalogPage");
    lastPage = "catalogPage";
    loadCatalog("all");
}

function showCart() {
    switchPage("cartPage");
    lastPage = "cartPage";
    updateCartDisplay();
}

function showProfile() {
    switchPage("profilePage");
    lastPage = "profilePage";
}

// ===== MAHSULOT FUNKSIYALARI =====
function loadFeaturedProducts() {
    const container = document.getElementById("featuredProducts");
    if (!container) return;

    const featured = sampleProducts.slice(0, 4);
    container.innerHTML = "";

    featured.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "product-card";
        productElement.style.minWidth = "200px";
        productElement.onclick = () => showProductDetail(product.id);
        productElement.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <div class="product-badge">${product.bonus}% bonus</div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productElement);
    });
}

function showCategory(category) {
    switchPage("catalogPage");
    loadCatalog(category);
}

function loadCatalog(category) {
    currentCategory = category;
    const productGrid = document.getElementById("productGrid");
    const catalogTitle = document.getElementById("catalogTitle");

    if (!productGrid || !catalogTitle) return;

    catalogTitle.textContent = category === "all" ? "Barcha mahsulotlar" : category;

    let filteredProducts = sampleProducts;
    if (category !== "all") {
        filteredProducts = sampleProducts.filter(p => p.category === category);
    }

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Mahsulot topilmadi</h3>
                <p>Bu kategoriyada hali mahsulotlar yo'q</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.onclick = () => showProductDetail(product.id);
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <div class="product-badge">${product.bonus}% bonus</div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Savatchaga
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i> Ko'rish
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function showProductDetail(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    addToViewed(productId);

    document.getElementById("productDetailImage").innerHTML = `
        <div style="background-image: url('${product.image}'); width: 100%; height: 100%; background-size: cover; background-position: center;"></div>
        <div class="product-badge">
            <i class="fas fa-tag"></i>
            <span>${product.bonus}%</span> bonus
        </div>
    `;

    document.getElementById("productDetailName").textContent = product.name;
    document.getElementById("productDetailPrice").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("productDetailCategory").textContent = product.category;
    document.getElementById("productDetailDesc").textContent = product.description;
    document.getElementById("productBonus").textContent = product.bonus;

    document.getElementById("productDetailImage").dataset.productId = productId;

    const specsContainer = document.getElementById("productSpecs");
    if (specsContainer && product.specs) {
        specsContainer.innerHTML = product.specs.map(spec => `
            <div class="spec-item">${spec}</div>
        `).join('');
    }

    const isInFavorites = favorites.some(item => item.id === productId);
    updateFavoriteButton(isInFavorites);

    switchPage("productDetailPage");
    lastPage = "catalogPage";
}

function updateFavoriteButton(isFavorite) {
    const button = document.querySelector(".btn-favorite");
    if (!button) return;

    if (isFavorite) {
        button.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
        button.style.color = "red";
        button.style.borderColor = "red";
    } else {
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = "";
        button.style.borderColor = "";
    }
}

function toggleFavorite() {
    const productId = parseInt(document.getElementById("productDetailImage").dataset.productId);
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = favorites.findIndex(item => item.id === productId);

    if (existingIndex !== -1) {
        favorites.splice(existingIndex, 1);
        showNotification("Mahsulot sevimlilardan olib tashlandi", "warning");
        updateFavoriteButton(false);
    } else {
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            bonus: product.bonus,
            image: product.image,
            category: product.category,
            addedDate: new Date().toLocaleString("uz-UZ")
        });
        showNotification("Mahsulot sevimlilarga qo'shildi!", "success");
        updateFavoriteButton(true);
    }

    updateFavoritesBadge();
    saveToLocalStorage();
}

// ===== SAVATCHA FUNKSIYALARI =====
function addToCart(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            bonus: product.bonus || 0,
            quantity: 1,
            image: product.image
        });
    }

    updateCartDisplay();
    updateCartBadge();
    saveToLocalStorage();
    showNotification("Mahsulot savatchaga qo'shildi!", "success");
}

function addToCartFromDetail() {
    const productId = parseInt(document.getElementById("productDetailImage").dataset.productId);
    const quantity = parseInt(document.getElementById("detailQuantity").textContent) || 1;

    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            bonus: product.bonus || 0,
            quantity: quantity,
            image: product.image
        });
    }

    updateCartDisplay();
    updateCartBadge();
    saveToLocalStorage();
    showNotification(`${quantity} ta mahsulot savatchaga qo'shildi!`, "success");
}

function changeDetailQuantity(change) {
    const quantityElement = document.getElementById("detailQuantity");
    let quantity = parseInt(quantityElement.textContent) || 1;
    quantity += change;

    if (quantity < 1) quantity = 1;
    if (quantity > 99) quantity = 99;

    quantityElement.textContent = quantity;
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");
    const itemsCountElement = document.getElementById("itemsCount");
    const finalPriceElement = document.getElementById("finalPrice");

    if (!cartItemsContainer || !totalPriceElement || !itemsCountElement || !finalPriceElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Savat bo'sh</h3>
                <p>Mahsulot qo'shish uchun katalogga o'ting</p>
                <button class="btn btn-primary" onclick="showCatalog()">
                    <i class="fas fa-th-large"></i> Katalogni ko'rish
                </button>
            </div>
        `;
        totalPriceElement.textContent = "$0.00";
        itemsCountElement.textContent = "0 ta";
        finalPriceElement.textContent = "$0.00";
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cartItemsContainer.innerHTML = "";

    cart.forEach(item => {
        totalItems += item.quantity;
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})" style="margin-left: auto; padding: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    itemsCountElement.textContent = `${totalItems} ta`;
    finalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCartDisplay();
    updateCartBadge();
    saveToLocalStorage();
}

function removeFromCart(productId) {
    if (confirm("Bu mahsulotni savatdan o'chirishni istaysizmi?")) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        updateCartBadge();
        saveToLocalStorage();
        showNotification("Mahsulot savatdan olib tashlandi", "success");
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification("Savat allaqachon bo'sh", "info");
        return;
    }

    if (confirm("Hammasini o'chirishni istaysizmi?")) {
        cart = [];
        updateCartDisplay();
        updateCartBadge();
        saveToLocalStorage();
        showNotification("Savat tozalandi", "success");
    }
}

function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;

    if (totalItems === 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "flex";
    }
}

// ===== SEVIMLILAR FUNKSIYALARI =====
function updateFavoritesBadge() {
    const badge = document.getElementById("favoritesCount");
    if (badge) badge.textContent = favorites.length;
}

function showFavorites() {
    switchPage("favoritesPage");
    updateFavoritesList();
}

function updateFavoritesList() {
    const container = document.getElementById("favoritesList");
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart" style="color: red;"></i>
                <h3>Sevimlilar bo'sh</h3>
                <p>Yoqtirgan mahsulotlaringizni bu yerda saqlashingiz mumkin</p>
                <button class="btn btn-primary" onclick="showCatalog()">
                    <i class="fas fa-th-large"></i> Mahsulotlarni ko'rish
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    favorites.forEach((item, index) => {
        const favoriteItem = document.createElement("div");
        favoriteItem.className = "product-card";
        favoriteItem.innerHTML = `
            <div class="product-image" style="background-image: url('${item.image}')">
                <div class="product-badge">${item.bonus}% bonus</div>
            </div>
            <div class="product-info">
                <div class="product-title">${item.name}</div>
                <div class="product-price">$${item.price.toFixed(2)}</div>
                <div class="product-category">${item.category}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="showProductDetail(${item.id})">
                        <i class="fas fa-eye"></i> Ko'rish
                    </button>
                    <button class="btn btn-outline" onclick="addToCart(${item.id})">
                        <i class="fas fa-cart-plus"></i> Savatchaga
                    </button>
                    <button class="btn btn-danger" onclick="removeFromFavorites(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">
                    <i class="far fa-clock"></i> ${item.addedDate}
                </div>
            </div>
        `;
        container.appendChild(favoriteItem);
    });
}

function removeFromFavorites(index) {
    if (confirm("Bu mahsulotni sevimlilardan o'chirishni istaysizmi?")) {
        favorites.splice(index, 1);
        updateFavoritesList();
        updateFavoritesBadge();
        saveToLocalStorage();
        showNotification("Mahsulot sevimlilardan o'chirildi", "success");
    }
}

function clearFavorites() {
    if (favorites.length === 0) {
        showNotification("Sevimlilar allaqachon bo'sh", "info");
        return;
    }

    if (confirm("Barcha sevimlilarni o'chirishni istaysizmi?")) {
        favorites = [];
        updateFavoritesList();
        updateFavoritesBadge();
        saveToLocalStorage();
        showNotification("Barcha sevimlilar tozalandi", "success");
    }
}

// ===== KO'RILGAN MAHSULOTLAR FUNKSIYALARI =====
function addToViewed(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = viewedProducts.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
        viewedProducts.splice(existingIndex, 1);
    }

    viewedProducts.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        bonus: product.bonus,
        image: product.image,
        category: product.category,
        viewedDate: new Date().toLocaleString("uz-UZ")
    });

    if (viewedProducts.length > 20) {
        viewedProducts = viewedProducts.slice(0, 20);
    }

    updateViewedBadge();
    saveToLocalStorage();
}

function updateViewedBadge() {
    const badge = document.getElementById("viewedCount");
    if (badge) badge.textContent = viewedProducts.length;
}

function showViewed() {
    switchPage("viewedPage");
    updateViewedList();
}

function updateViewedList() {
    const container = document.getElementById("viewedList");
    if (!container) return;

    if (viewedProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-eye"></i>
                <h3>Ko'rilganlar yo'q</h3>
                <p>Siz hali hech qanday mahsulotni ko'rmagansiz</p>
                <button class="btn btn-primary" onclick="showCatalog()">
                    <i class="fas fa-th-large"></i> Mahsulotlarni ko'rish
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    viewedProducts.forEach(item => {
        const viewedItem = document.createElement("div");
        viewedItem.className = "product-card";
        viewedItem.innerHTML = `
            <div class="product-image" style="background-image: url('${item.image}')">
                <div class="product-badge">${item.bonus}% bonus</div>
            </div>
            <div class="product-info">
                <div class="product-title">${item.name}</div>
                <div class="product-price">$${item.price.toFixed(2)}</div>
                <div class="product-category">${item.category}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="showProductDetail(${item.id})">
                        <i class="fas fa-eye"></i> Ko'rish
                    </button>
                    <button class="btn btn-outline" onclick="addToCart(${item.id})">
                        <i class="fas fa-cart-plus"></i> Savatchaga
                    </button>
                    <button class="btn btn-outline" onclick="addToFavoritesFromViewed(${item.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">
                    <i class="far fa-clock"></i> ${item.viewedDate}
                </div>
            </div>
        `;
        container.appendChild(viewedItem);
    });
}

function addToFavoritesFromViewed(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = favorites.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
        showNotification("Bu mahsulot allaqachon sevimlilarda", "warning");
        return;
    }

    favorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        bonus: product.bonus,
        image: product.image,
        category: product.category,
        addedDate: new Date().toLocaleString("uz-UZ")
    });

    updateFavoritesBadge();
    saveToLocalStorage();
    showNotification("Mahsulot sevimlilarga qo'shildi!", "success");
}

// ===== BUYURTMALAR FUNKSIYALARI =====
function updateOrdersBadge() {
    const badge = document.getElementById("ordersCount");
    if (badge) badge.textContent = orders.length;
}

function showOrders() {
    switchPage("ordersPage");
    updateOrdersList();
}

function filterOrders(status) {
    const tabs = document.querySelectorAll(".filter-tab");
    tabs.forEach(tab => tab.classList.remove("active"));
    event.target.classList.add("active");
    updateOrdersList(status);
}

function updateOrdersList(filter = "all") {
    const container = document.getElementById("ordersList");
    if (!container) return;

    let filteredOrders = orders;
    if (filter === "active") {
        filteredOrders = orders.filter(order => ["Yangi", "Qabul qilindi", "Tayyorlanmoqda", "Yo'lda"].includes(order.status));
    } else if (filter === "completed") {
        filteredOrders = orders.filter(order => ["Yetkazib berildi", "Bekor qilindi"].includes(order.status));
    }

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Buyurtmalar yo'q</h3>
                <p>Siz hali hech qanday buyurtma bermagansiz</p>
                <button class="btn btn-primary" onclick="showCatalog()">
                    <i class="fas fa-shopping-cart"></i> Xarid qilishni boshlash
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    filteredOrders.forEach((order, index) => {
                const orderItem = document.createElement("div");
                orderItem.className = "section";
                orderItem.style.marginBottom = "1rem";
                orderItem.innerHTML = `
            <div class="order-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="margin-bottom: 0.25rem; color: var(--text-primary);">Buyurtma #${order.id.toString().slice(-6)}</h4>
                    <div style="font-size: 0.85rem; color: var(--text-light);">
                        <i class="far fa-calendar"></i> ${order.date}
                    </div>
                </div>
                <div style="background: ${getStatusColor(order.status)}; color: white; padding: 0.375rem 0.75rem; border-radius: 1rem; font-size: 0.85rem; font-weight: 600;">
                    ${order.status}
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                        <span>${item.name} × ${item.quantity}</span>
                        <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="border-top: 2px solid var(--gray-200); padding-top: 1rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem;">
                    <span>Jami:</span>
                    <span>$${order.totalAmount.toFixed(2)}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.25rem;">
                    <i class="fas fa-credit-card"></i> ${getPaymentMethodName(order.paymentMethod)}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-light);">
                    <i class="fas fa-map-marker-alt"></i> ${order.region}, ${order.district}
                </div>
                ${order.comment ? `
                    <div style="margin-top: 0.5rem; padding: 0.75rem; background: var(--gray-100); border-radius: var(--radius); font-size: 0.85rem; color: var(--text-secondary);">
                        <i class="fas fa-comment"></i> ${order.comment}
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" style="flex: 1;" onclick="repeatOrder(${index})">
                    <i class="fas fa-redo"></i> Qayta buyurtma
                </button>
                <button class="btn btn-primary" style="flex: 1;" onclick="trackOrder(${index})">
                    <i class="fas fa-shipping-fast"></i> Kuzatish
                </button>
            </div>
        `;
        container.appendChild(orderItem);
    });
}

function getStatusColor(status) {
    const colors = {
        "Yangi": "var(--primary)",
        "Qabul qilindi": "var(--warning)",
        "Tayyorlanmoqda": "var(--warning)",
        "Yo'lda": "var(--info)",
        "Yetkazib berildi": "var(--success)",
        "Bekor qilindi": "var(--danger)"
    };
    return colors[status] || "var(--gray-500)";
}

function repeatOrder(orderIndex) {
    const order = orders[orderIndex];
    if (!order) return;
    
    cart = [];
    order.items.forEach(item => {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            bonus: item.bonus || 0,
            quantity: item.quantity,
            image: item.image
        });
    });
    
    updateCartDisplay();
    updateCartBadge();
    saveToLocalStorage();
    showNotification("Mahsulotlar savatchaga qo'shildi!", "success");
    showCart();
}

function trackOrder(orderIndex) {
    showNotification("Bu buyurtmani kuzatish funksiyasi tez orada qo'shiladi!", "info");
}

// ===== VILOYAT VA TUMANLAR =====
function populateRegions() {
    const regionSelect = document.getElementById("regionSelect");
    const modalRegionSelect = document.getElementById("modalRegionSelect");
    
    if (regionSelect) {
        regionSelect.innerHTML = '<option value="">Viloyatni tanlang</option>';
        Object.keys(regions).forEach(region => {
            regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
        });
    }
    
    if (modalRegionSelect) {
        modalRegionSelect.innerHTML = '<option value="">Viloyatni tanlang</option>';
        Object.keys(regions).forEach(region => {
            modalRegionSelect.innerHTML += `<option value="${region}">${region}</option>`;
        });
    }
}

function updateDistricts() {
    const regionSelect = document.getElementById("regionSelect");
    const districtSelect = document.getElementById("districtSelect");
    
    if (!regionSelect || !districtSelect) return;
    
    const selectedRegion = regionSelect.value;
    
    if (selectedRegion && regions[selectedRegion]) {
        districtSelect.disabled = false;
        districtSelect.innerHTML = '<option value="">Tuman/Shaharni tanlang</option>';
        
        regions[selectedRegion].forEach(district => {
            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    } else {
        districtSelect.disabled = true;
        districtSelect.innerHTML = '<option value="">Avval viloyatni tanlang</option>';
    }
}

function updateModalDistricts() {
    const modalRegionSelect = document.getElementById("modalRegionSelect");
    const modalDistrictSelect = document.getElementById("modalDistrictSelect");
    
    if (!modalRegionSelect || !modalDistrictSelect) return;
    
    const selectedRegion = modalRegionSelect.value;
    
    if (selectedRegion && regions[selectedRegion]) {
        modalDistrictSelect.disabled = false;
        modalDistrictSelect.innerHTML = '<option value="">Tuman/Shaharni tanlang</option>';
        
        regions[selectedRegion].forEach(district => {
            modalDistrictSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    } else {
        modalDistrictSelect.disabled = true;
        modalDistrictSelect.innerHTML = '<option value="">Avval viloyatni tanlang</option>';
    }
}

// ===== BUYURTMA BERISH FUNKSIYALARI =====
function showCheckoutPage() {
    if (cart.length === 0) {
        showNotification("Iltimos, avval mahsulot qo'shing!", "error");
        return;
    }
    
    switchPage("checkoutPage");
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutItemsCount = document.getElementById("checkoutItemsCount");
    
    if (!checkoutItems || !checkoutTotal || !checkoutItemsCount) return;
    
    let totalItems = 0;
    let totalPrice = 0;
    
    checkoutItems.innerHTML = "";
    
    cart.forEach(item => {
        totalItems += item.quantity;
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const itemElement = document.createElement("div");
        itemElement.className = "menu-item";
        itemElement.innerHTML = `
            <div>
                <div style="font-weight: 600; color: var(--text-primary);">${item.name}</div>
                <div style="font-size: 0.85rem; color: var(--text-light);">${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
            <div style="font-weight: 700; color: var(--primary);">$${itemTotal.toFixed(2)}</div>
        `;
        checkoutItems.appendChild(itemElement);
    });
    
    checkoutTotal.textContent = `$${totalPrice.toFixed(2)}`;
    checkoutItemsCount.textContent = `${totalItems} ta`;
}

function getPaymentMethodName(method) {
    const methods = {
        cash: "Naqd pul",
        card: "Bank kartasi",
        click: "Click",
        payme: "Payme"
    };
    return methods[method] || method;
}

async function submitOrder() {
    const region = document.getElementById("regionSelect").value;
    const district = document.getElementById("districtSelect").value;
    const fullAddress = document.getElementById("fullAddress").value.trim();
    const userPhone = document.getElementById("userPhone").value.trim();
    const orderComment = document.getElementById("orderComment").value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const agreeTerms = document.getElementById("agreeTerms").checked;
    
    if (!region) {
        showNotification("Iltimos, viloyatni tanlang!", "error");
        return;
    }
    
    if (!district) {
        showNotification("Iltimos, tuman/shaharni tanlang!", "error");
        return;
    }
    
    if (!fullAddress) {
        showNotification("Iltimos, to'liq manzilni kiriting!", "error");
        return;
    }
    
    if (!userPhone) {
        showNotification("Iltimos, telefon raqamingizni kiriting!", "error");
        return;
    }
    
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(userPhone)) {
        showNotification("Iltimos, to'g'ri telefon raqam kiriting (+998901234567 formatida)", "error");
        return;
    }
    
    if (!agreeTerms) {
        showNotification("Iltimos, foydalanish shartlari bilan roziligingizni bildiring!", "error");
        return;
    }
    
    showNotification("Buyurtma yuborilmoqda...", "warning");
    
    let orderItems = "";
    let totalAmount = 0;
    let totalBonusAmount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        const bonusAmount = (itemTotal * (item.bonus || 0)) / 100;
        totalBonusAmount += bonusAmount;
        
        orderItems += `• ${item.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}`;
        if (item.bonus && item.bonus > 0) {
            orderItems += ` (${item.bonus}% bonus: +$${bonusAmount.toFixed(2)})`;
        }
        orderItems += `\n`;
    });
    
    const message = `
🛒 YANGI BUYURTMA

👤 Mijoz: ${currentUser.name}
📞 Telefon: ${userPhone}

📍 Manzil:
Viloyat: ${region}
Tuman: ${district}
To'liq manzil: ${fullAddress}

📦 Mahsulotlar:
${orderItems}

💰 Umumiy summa: $${totalAmount.toFixed(2)}
🎁 Umumiy bonus: $${totalBonusAmount.toFixed(2)} (${totalBonusAmount > 0 ? ((totalBonusAmount / totalAmount) * 100).toFixed(1) : 0}%)
💳 To'lov usuli: ${getPaymentMethodName(paymentMethod)}
📝 Izoh: ${orderComment || "Yo'q"}

⏰ Buyurtma vaqti: ${new Date().toLocaleString("uz-UZ")}
    `;
    
    try {
        const response = await sendToTelegram(message);
        
        if (response.ok) {
            currentOrder = {
                id: Date.now(),
                date: new Date().toLocaleString("uz-UZ"),
                customerName: currentUser.name,
                customerPhone: userPhone,
                region: region,
                district: district,
                address: fullAddress,
                items: [...cart],
                totalAmount: totalAmount,
                totalBonus: totalBonusAmount,
                paymentMethod: paymentMethod,
                comment: orderComment,
                status: "Yangi",
            };
            
            orders.unshift(currentOrder);
            
            currentUser.phone = userPhone;
            updateUserDisplay();
            
            const newPoints = Math.floor(totalAmount);
            currentUser.loyaltyPoints += newPoints;
            
            cart = [];
            
            updateCartDisplay();
            updateCartBadge();
            updateOrdersBadge();
            updateAllBadges();
            
            saveToLocalStorage();
            
            showNotification("Buyurtma muvaffaqiyatli qabul qilindi!", "success");
            
            if (newPoints > 0) {
                setTimeout(() => {
                    showNotification(`Sizga ${newPoints} ball qo'shildi! Jami: ${currentUser.loyaltyPoints} ball`, "success");
                }, 1000);
            }
            
            showOrderConfirmation();
        } else {
            throw new Error("Telegram API xatosi");
        }
    } catch (error) {
        console.error("Xatolik:", error);
        showNotification("Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.", "error");
    }
}

async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "HTML",
            }),
        });
        
        const data = await response.json();
        
        return {
            ok: data.ok,
            data: data,
        };
    } catch (error) {
        console.error("Fetch xatosi:", error);
        return {
            ok: false,
            error: error,
        };
    }
}

function showOrderConfirmation() {
    if (!currentOrder) return;
    
    document.getElementById("orderNumber").textContent = `#${currentOrder.id.toString().slice(-6)}`;
    document.getElementById("summaryTotal").textContent = `$${currentOrder.totalAmount.toFixed(2)}`;
    document.getElementById("summaryAddress").textContent = `${currentOrder.region}, ${currentOrder.district}`;
    document.getElementById("summaryPayment").textContent = getPaymentMethodName(currentOrder.paymentMethod);
    document.getElementById("orderTime").textContent = currentOrder.date;
    
    switchPage("orderConfirmationPage");
}

function continueShopping() {
    showHome();
}

// ===== PROFIL FUNKSIYALARI =====
function editProfile() {
    if (!currentUser) return;
    
    document.getElementById("editPhone").value = currentUser.phone || "";
    document.getElementById("editEmail").value = currentUser.email || "";
    openModal("profileModal");
}

function saveProfile() {
    const phone = document.getElementById("editPhone").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    
    if (phone && !phone.match(/^\+998\d{9}$/)) {
        showNotification("Iltimos, to'g'ri telefon raqam kiriting!", "error");
        return;
    }
    
    currentUser.phone = phone;
    currentUser.email = email;
    
    updateUserDisplay();
    saveToLocalStorage();
    closeModal("profileModal");
    showNotification("Profil ma'lumotlari yangilandi!", "success");
}

function changeName() {
    if (!currentUser) return;
    
    document.getElementById("newUserName").value = currentUser.name;
    openModal("nameModal");
}

function saveNewName() {
    const newName = document.getElementById("newUserName").value.trim();
    
    if (!newName) {
        showNotification("Iltimos, yangi ism kiriting!", "error");
        return;
    }
    
    currentUser.name = newName;
    updateUserDisplay();
    saveToLocalStorage();
    closeModal("nameModal");
    showNotification("Ism muvaffaqiyatli o'zgartirildi!", "success");
}

function showAddresses() {
    switchPage("addressesPage");
    updateAddressesList();
}

function updateAddressesList() {
    const container = document.getElementById("addressesList");
    if (!container) return;
    
    if (addresses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Manzillar yo'q</h3>
                <p>Sizda hali saqlangan manzillar yo'q</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = "";
    
    addresses.forEach((address, index) => {
        const addressItem = document.createElement("div");
        addressItem.className = "section";
        addressItem.style.marginBottom = "1rem";
        addressItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="margin-bottom: 0.25rem; color: var(--text-primary);">${address.name}</h4>
                    <div style="font-size: 0.85rem; color: var(--text-light);">
                        ${address.region}, ${address.district}
                    </div>
                </div>
                <button class="btn btn-danger" onclick="deleteAddress(${index})" style="padding: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                ${address.address}
            </div>
        `;
        container.appendChild(addressItem);
    });
}

function openAddAddress() {
    openModal("addressModal");
}

function saveAddress() {
    const name = document.getElementById("addressName").value.trim();
    const region = document.getElementById("modalRegionSelect").value;
    const district = document.getElementById("modalDistrictSelect").value;
    const fullAddress = document.getElementById("modalFullAddress").value.trim();
    
    if (!name || !region || !district || !fullAddress) {
        showNotification("Iltimos, barcha maydonlarni to'ldiring!", "error");
        return;
    }
    
    const newAddress = {
        name: name,
        region: region,
        district: district,
        address: fullAddress,
        createdAt: new Date().toISOString()
    };
    
    addresses.push(newAddress);
    saveToLocalStorage();
    closeModal("addressModal");
    updateAddressesList();
    
    document.getElementById("addressName").value = "";
    document.getElementById("modalRegionSelect").value = "";
    document.getElementById("modalDistrictSelect").value = "";
    document.getElementById("modalDistrictSelect").disabled = true;
    document.getElementById("modalFullAddress").value = "";
    
    showNotification("Yangi manzil qo'shildi!", "success");
}

function deleteAddress(index) {
    if (confirm("Bu manzilni o'chirishni istaysizmi?")) {
        addresses.splice(index, 1);
        saveToLocalStorage();
        updateAddressesList();
        showNotification("Manzil o'chirildi", "success");
    }
}

function showLoyalty() {
    switchPage("loyaltyPage");
    updateLoyaltyDisplay();
}

function updateLoyaltyDisplay() {
    if (currentUser) {
        document.getElementById("loyaltyPointsDisplay").textContent = `${currentUser.loyaltyPoints || 0} ball`;
        const dollarsValue = (currentUser.loyaltyPoints || 0).toFixed(2);
        
        const subtitle = document.querySelector(".loyalty-subtitle");
        if (subtitle) {
            subtitle.textContent = `Ball qanday to'planadi: ${currentUser.loyaltyPoints || 0} ball = $${dollarsValue} qiymatiga teng`;
        }
    }
}

function toggleNotifications() {
    notificationsEnabled = !notificationsEnabled;
    saveToLocalStorage();
    
    const toggleSwitch = document.querySelector(".toggle-switch");
    if (toggleSwitch) {
        toggleSwitch.style.transform = notificationsEnabled ? "translateX(22px)" : "translateX(2px)";
    }
    
    showNotification(
        notificationsEnabled ? "Bildirishnomalar yoqildi" : "Bildirishnomalar o'chirildi",
        notificationsEnabled ? "success" : "warning"
    );
}

function logout() {
    if (confirm("Haqiqatan ham chiqmoqchimisiz?")) {
        resetData();
        showLoginPage();
        showNotification("Siz tizimdan chiqdingiz", "success");
    }
}

// ===== MODAL FUNKSIYALARI =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// ===== XABAR FUNKSIYALARI =====
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");
    const notificationIcon = document.querySelector(".notification-icon");
    
    if (!notification || !notificationText || !notificationIcon) return;
    
    notificationText.textContent = message;
    
    notification.className = "notification";
    notificationIcon.className = "notification-icon";
    
    notification.classList.add(type);
    notificationIcon.classList.add(type);
    
    notification.style.display = "flex";
    
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// ===== DASTLABKI SOZLAMALAR =====
document.addEventListener("DOMContentLoaded", function() {
    console.log("Hydroline do'koni yuklandi!");
    
    initializeApp();
    
    document.getElementById("userName").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            startApp();
        }
    });
    
    document.getElementById("searchInput").addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 2) {
            const filtered = sampleProducts.filter(
                product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm)
            );
            
            if (document.getElementById("catalogPage").classList.contains("active")) {
                loadSearchResults(filtered);
            }
        } else if (searchTerm.length === 0 && 
                   document.getElementById("catalogPage").classList.contains("active")) {
            loadCatalog(currentCategory);
        }
    });
    
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", function() {
            const modal = this.closest(".modal");
            if (modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    });
});

function loadSearchResults(filteredProducts) {
    const productGrid = document.getElementById("productGrid");
    const catalogTitle = document.getElementById("catalogTitle");
    
    if (!productGrid || !catalogTitle) return;
    
    catalogTitle.textContent = `Qidiruv natijalari (${filteredProducts.length})`;
    
    productGrid.innerHTML = "";
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Natija topilmadi</h3>
                <p>"${document.getElementById("searchInput").value}" uchun hech narsa topilmadi</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.onclick = () => showProductDetail(product.id);
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <div class="product-badge">${product.bonus}% bonus</div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Savatchaga
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i> Ko'rish
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function toggleFilters() {
    showNotification("Filtr funksiyasi tez orada qo'shiladi!", "info");
}

function toggleSort() {
    showNotification("Saralash funksiyasi tez orada qo'shiladi!", "info");
}

function toggleFilter() {
    showNotification("Filtr funksiyasi tez orada qo'shiladi!", "info");
}