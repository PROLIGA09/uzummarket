// ===== KONFIGURATSIYA =====
const TELEGRAM_BOT_TOKEN = "8208794616:AAGowHgBG19btPSfjVe1veNPsPVfR90KevE";
const TELEGRAM_CHAT_ID = "8074394669";
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

// ===== YANGI O'ZGARUVCHILAR =====
let selectedAddressMethod = "manual";
let map = null;
let selectedLocation = null;
let marker = null;
let savedAddresses = [];
let selectedSavedAddress = null;

// ===== YANGI: GEO-LOCATION O'ZGARUVCHILARI =====
let currentLocationMarker = null;
let watchId = null;
let locationSearchActive = false;
let lastKnownLocation = null;
let locationAccuracy = 0;

// ===== HACKER HIMOYASI =====
let refreshCount = 0;
let lastRefreshTime = Date.now();
let blockedUser = false;
let f12Pressed = false;

// ===== ZOOM VA INSPECTOR BLOKLASH =====
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        return false;
    }
}, { passive: false });

document.addEventListener('keydown', function(e) {
    // Ctrl+ +/- bilan zoom bloklash
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
        e.preventDefault();
        return false;
    }

    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U bloklash
    if (e.key === 'F12') {
        e.preventDefault();
        f12Pressed = true;
        showSecurityWarning();
        return false;
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        showSecurityWarning();
        return false;
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        showSecurityWarning();
        return false;
    }

    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        showSecurityWarning();
        return false;
    }
});

// Touch eventlarda zoom bloklash
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// O'ng tugma bosilishini bloklash
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showSecurityWarning();
    return false;
});

// Developer tools ochilishini aniqlash
function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
        showSecurityWarning();
    }
}

setInterval(detectDevTools, 1000);

// Himoya xabarini ko'rsatish
function showSecurityWarning() {
    if (blockedUser) return;

    const overlay = document.getElementById('securityOverlay');
    if (!overlay) {
        const securityHTML = `
            <div id="securityOverlay">
                <div class="security-message">⚠️ XAVFSIZLIK OGOHLANTIRISHI ⚠️</div>
                <div class="security-countdown" id="securityCountdown">3</div>
                <div class="security-warning">
                    Ushbu veb-sayt himoyalangan. Siz dasturiy ta'minotni buzish yoki tahlil qilishga urinayapsiz.<br>
                    Buning uchun siz 3 soniya bloklanasiz.
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', securityHTML);
    }

    const overlayElement = document.getElementById('securityOverlay');
    overlayElement.style.display = 'flex';

    let countdown = 3;
    const countdownElement = document.getElementById('securityCountdown');

    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(timer);
            overlayElement.style.display = 'none';
            blockedUser = false;
        }
    }, 1000);

    blockedUser = true;
}

// Yangilashni monitoring qilish
window.addEventListener('beforeunload', function() {
    const currentTime = Date.now();
    if (currentTime - lastRefreshTime < 3000) {
        refreshCount++;
        lastRefreshTime = currentTime;

        if (refreshCount >= 3) {
            showSecurityWarning();
            refreshCount = 0;
        }
    } else {
        refreshCount = 0;
        lastRefreshTime = currentTime;
    }
});

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

        // Saqlangan manzillarni yuklash
        const savedSavedAddresses = localStorage.getItem('hydroline_saved_addresses');
        if (savedSavedAddresses) savedAddresses = JSON.parse(savedSavedAddresses);
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
        localStorage.setItem('hydroline_saved_addresses', JSON.stringify(savedAddresses));
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
    savedAddresses = [];
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
    },
    {
        id: 11,
        name: "Modern Rakovina",
        price: 159.99,
        bonus: 10,
        category: "RAKOVINA UCHUN",
        description: "Zamonaviy dizaynli rakovina, oson tozalash uchun silliq sirt.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Material: Keramika", "Rang: Oq", "O'lcham: 60x40cm", "Kafolat: 7 yil"]
    },
    {
        id: 12,
        name: "Premium Dush Seti",
        price: 199.99,
        bonus: 15,
        category: "DUSH UCHUN",
        description: "Premium dush seti, 6 turdagi massage, suv tejash texnologiyasi.",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        specs: ["Material: Zanglamas po'lat", "Massage: 6 tur", "Suv tejash: 30%", "Kafolat: 5 yil"]
    }
];

// ===== ASOSIY FUNKSIYALARI =====
function initializeApp() {
    console.log("Hydroline dasturi boshlanmoqda...");

    // LocalStorage'dan ma'lumotlarni yuklash
    loadFromLocalStorage();

    // Debug ma'lumotlari
    console.log("Current User:", currentUser);
    console.log("Cart:", cart);
    console.log("Favorites:", favorites);

    if (currentUser && currentUser.name) {
        console.log("Foydalanuvchi mavjud, asosiy app ko'rsatiladi");
        showMainApp();
        setTimeout(() => {
            showNotification(`Xush kelibsiz, ${currentUser.name}!`, "success");
        }, 500);
    } else {
        console.log("Foydalanuvchi mavjud emas, login sahifasi ko'rsatiladi");
        showLoginPage();
    }

    // Viloyat va tumanlarni yuklash
    populateRegions();

    // Bosh sahifa mahsulotlarini yuklash
    loadFeaturedProducts();

    // Savat badge'ini yangilash
    updateCartBadge();

    console.log("Dastur muvaffaqiyatli yuklandi!");
}

function startApp() {
    console.log("startApp funksiyasi chaqirildi");

    const userNameInput = document.getElementById("userName");
    if (!userNameInput) {
        console.error("userName input topilmadi!");
        return;
    }

    const userName = userNameInput.value.trim();
    console.log("Kiritilgan ism:", userName);

    if (!userName) {
        showNotification("Iltimos, ismingizni kiriting!", "error");
        userNameInput.focus();
        return;
    }

    currentUser = {
        name: userName,
        phone: "",
        email: "",
        loyaltyPoints: 0,
        joinDate: new Date().toISOString()
    };

    console.log("Yangi foydalanuvchi yaratildi:", currentUser);

    // Ma'lumotlarni saqlash
    saveToLocalStorage();

    // Asosiy appga o'tish
    showMainApp();

    // Xush kelibsiz xabarini ko'rsatish
    setTimeout(() => {
        showNotification(`Xush kelibsiz, ${userName}!`, "success");
    }, 300);
}

function showMainApp() {
    console.log("showMainApp funksiyasi chaqirildi");

    // Kirish sahifasini yashirish
    const loginContainer = document.getElementById("loginContainer");
    if (loginContainer) {
        console.log("Login container yashirilmoqda");
        loginContainer.style.display = "none";
    } else {
        console.error("Login container topilmadi!");
    }

    // Asosiy aplikatsiyani ko'rsatish
    const mainApp = document.getElementById("mainApp");
    if (mainApp) {
        console.log("Main app ko'rsatilmoqda");
        mainApp.style.display = "block";
    } else {
        console.error("Main app topilmadi!");
    }

    // Foydalanuvchi ma'lumotlarini yangilash
    updateUserDisplay();

    // Bosh sahifani ko'rsatish
    showHome();

    // Barcha badge'larni yangilash
    updateAllBadges();
}

function showLoginPage() {
    console.log("showLoginPage funksiyasi chaqirildi");

    // Asosiy aplikatsiyani yashirish
    const mainApp = document.getElementById("mainApp");
    if (mainApp) {
        console.log("Main app yashirilmoqda");
        mainApp.style.display = "none";
    } else {
        console.error("Main app topilmadi!");
    }

    // Kirish sahifasini ko'rsatish
    const loginContainer = document.getElementById("loginContainer");
    if (loginContainer) {
        console.log("Login container ko'rsatilmoqda");
        loginContainer.style.display = "flex";
    } else {
        console.error("Login container topilmadi!");
    }

    // Inputni tozalash va fokus qilish
    const userNameInput = document.getElementById("userName");
    if (userNameInput) {
        userNameInput.value = "";
        userNameInput.focus();
    }
}

function updateUserDisplay() {
    if (!currentUser) return;

    console.log("Foydalanuvchi ma'lumotlari yangilanmoqda:", currentUser.name);

    // Ismni barcha joylarda yangilash
    const userNameElements = [
        "currentUserName",
        "profileUserName",
        "checkoutUserName",
        "confirmationUserName"
    ];

    userNameElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = currentUser.name;
        }
    });

    // Telefon raqamni yangilash
    const phoneElements = ["profileUserPhone", "checkoutUserPhone"];
    if (currentUser.phone) {
        phoneElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = currentUser.phone;
        });

        // Checkout sahifasidagi telefon inputini to'ldirish
        const userPhoneInput = document.getElementById("userPhone");
        if (userPhoneInput) {
            userPhoneInput.value = currentUser.phone;
        }
    }

    // Loyallik ballarini yangilash
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
    console.log(`Sahifa o'zgartirilmoqda: ${pageId}`);

    if (!["profilePage", "homePage", "catalogPage", "cartPage"].includes(pageId)) {
        lastPage = pageId;
    }

    // Barcha sahifalarni yashirish
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    // Tanlangan sahifani ko'rsatish
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
        console.log(`${pageId} sahifasi ko'rsatildi`);
    } else {
        console.error(`${pageId} sahifasi topilmadi!`);
    }

    // Navigatsiyani yangilash
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
    if (index !== undefined && navItems[index]) {
        navItems[index].classList.add("active");
    }
}

function goBack() {
    console.log("Orqaga qaytish, oldingi sahifa:", lastPage);

    if (["profilePage", "homePage", "catalogPage", "cartPage"].includes(lastPage)) {
        switchPage(lastPage);
    } else {
        switchPage("profilePage");
    }
}

function showHome() {
    console.log("Bosh sahifa ko'rsatilmoqda");
    switchPage("homePage");
    lastPage = "homePage";
    loadFeaturedProducts();
}

function showCatalog() {
    console.log("Katalog sahifasi ko'rsatilmoqda");
    switchPage("catalogPage");
    lastPage = "catalogPage";
    loadCatalog("all");
}

function showCart() {
    console.log("Savat sahifasi ko'rsatilmoqda");
    switchPage("cartPage");
    lastPage = "cartPage";
    updateCartDisplay();
}

function showProfile() {
    console.log("Profil sahifasi ko'rsatilmoqda");
    switchPage("profilePage");
    lastPage = "profilePage";
}

// ===== MAHSULOT FUNKSIYALARI =====
function loadFeaturedProducts() {
    const container = document.getElementById("featuredProducts");
    if (!container) {
        console.error("featuredProducts container topilmadi!");
        return;
    }

    const featured = sampleProducts.slice(0, 4);
    container.innerHTML = "";

    featured.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "product-card";
        productElement.style.cssText = `
            min-width: calc(25% - 0.3rem);
            flex: 0 0 calc(25% - 0.3rem);
            height: 100%;
            display: flex;
            flex-direction: column;
        `;

        productElement.onclick = () => showProductDetail(product.id);
        productElement.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <div class="product-badge">${product.bonus}% bonus</div>
            </div>
            <div class="product-info" style="flex: 1; display: flex; flex-direction: column; padding: 0.3rem;">
                <div class="product-title" style="font-size: 0.6rem; text-align: center; margin-bottom: 0.3rem; flex-grow: 1; line-height: 1.1;">
                    ${product.name}
                </div>
                <div class="product-price" style="font-size: 0.7rem; text-align: center; font-weight: bold; color: var(--primary); margin-bottom: 0.2rem;">
                    $${product.price.toFixed(2)}
                </div>
                <div class="product-actions" style="margin-top: auto; display: flex; gap: 0.2rem;">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-cart-plus" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-eye" style="font-size: 0.6rem;"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productElement);
    });
}

function showCategory(category) {
    console.log(`Kategoriya tanlandi: ${category}`);
    switchPage("catalogPage");
    loadCatalog(category);
}

function loadCatalog(category) {
    currentCategory = category;
    const productGrid = document.getElementById("productGrid");
    const catalogTitle = document.getElementById("catalogTitle");

    if (!productGrid || !catalogTitle) {
        console.error("Product grid yoki catalog title topilmadi!");
        return;
    }

    catalogTitle.textContent = category === "all" ? "Barcha mahsulotlar" : category;

    let filteredProducts = sampleProducts;
    if (category !== "all") {
        filteredProducts = sampleProducts.filter(p => p.category === category);
    }

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Mahsulot topilmadi</h3>
                <p style="font-size: 0.85rem;">Bu kategoriyada hali mahsulotlar yo'q</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
        `;

        productCard.onclick = () => showProductDetail(product.id);
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <div class="product-badge">${product.bonus}% bonus</div>
            </div>
            <div class="product-info" style="flex: 1; display: flex; flex-direction: column; padding: 0.3rem;">
                <div class="product-title" style="font-size: 0.6rem; text-align: center; margin-bottom: 0.3rem; flex-grow: 1; line-height: 1.1;">
                    ${product.name}
                </div>
                <div class="product-price" style="font-size: 0.7rem; text-align: center; font-weight: bold; color: var(--primary); margin-bottom: 0.2rem;">
                    $${product.price.toFixed(2)}
                </div>
                <div class="product-actions" style="margin-top: auto; display: flex; gap: 0.2rem;">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-cart-plus" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-eye" style="font-size: 0.6rem;"></i>
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// ===== MAHSULOT TAFSILOTLARI =====
function showProductDetail(productId) {
    console.log("showProductDetail chaqirildi, productId:", productId);

    const product = sampleProducts.find(p => p.id === productId);
    console.log("Topilgan mahsulot:", product);

    if (!product) {
        console.error("Mahsulot topilmadi!");
        showNotification("Mahsulot topilmadi!", "error");
        return;
    }

    addToViewed(productId);

    // Mahsulot tafsilotlari
    const detailImage = document.getElementById("productDetailImage");
    if (detailImage) {
        detailImage.innerHTML = `
            <div style="background-image: url('${product.image}'); width: 100%; height: 100%; background-size: cover; background-position: center;"></div>
            <div class="product-badge" style="top: 1rem; right: 1rem; padding: 0.4rem 0.8rem; font-size: 0.9rem;">
                <i class="fas fa-tag"></i>
                <span>${product.bonus}%</span> bonus
            </div>
        `;
        detailImage.dataset.productId = productId;
    }

    // Boshqa elementlarni yangilash
    const elementsToUpdate = {
        "productDetailName": product.name,
        "productDetailPrice": `$${product.price.toFixed(2)}`,
        "productDetailCategory": product.category,
        "productDetailDesc": product.description,
        "productBonus": product.bonus
    };

    for (const [id, value] of Object.entries(elementsToUpdate)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    // Xususiyatlarni yangilash
    const specsContainer = document.getElementById("productSpecs");
    if (specsContainer && product.specs) {
        specsContainer.innerHTML = product.specs.map(spec => `
            <div class="spec-item">${spec}</div>
        `).join('');
    }

    // Sevimlilarda borligini tekshirish
    const isInFavorites = favorites.some(item => item.id === productId);
    updateFavoriteButton(isInFavorites);

    // Sahifani o'zgartirish
    switchPage("productDetailPage");
    lastPage = "catalogPage";

    console.log("Mahsulot tafsilotlari sahifasi ko'rsatildi");
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
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Savat bo'sh</h3>
                <p style="font-size: 0.85rem;">Mahsulot qo'shish uchun katalogga o'ting</p>
                <button class="btn btn-primary" onclick="showCatalog()" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
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
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})" style="margin-left: auto; padding: 0.4rem;">
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

// ===== MANZIL TANLASH FUNKSIYALARI =====
function selectAddressMethod(method) {
    selectedAddressMethod = method;

    // Tugmalarni yangilash
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.method === method) {
            btn.classList.add('active');
        }
    });

    // Formani ko'rsatish/yashirish
    document.getElementById('manualAddressForm').style.display = method === 'manual' ? 'block' : 'none';
    document.getElementById('mapAddressForm').style.display = method === 'map' ? 'block' : 'none';

    // Saqlangan manzillarni ko'rsatish
    if (savedAddresses.length > 0) {
        document.getElementById('savedAddressesSection').style.display = 'block';
        updateSavedAddressesList();
    } else {
        document.getElementById('savedAddressesSection').style.display = 'none';
    }
}

function openMapSelector() {
    // Xarita sahifasiga o'tish
    switchPage('mapPage');
    initializeMap();
}

function goBackToCheckout() {
    switchPage('checkoutPage');
    updateCheckoutDisplay();
}

function initializeMap() {
    // Leaflet xaritasini yaratish
    if (!map) {
        const mapContainer = document.getElementById('fullScreenMap');
        if (!mapContainer) return;

        map = L.map('fullScreenMap').setView([41.311081, 69.240562], 13); // Toshkent markazi

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 8
        }).addTo(map);

        // O'zbekiston chegaralarini belgilash
        L.polygon([
            [45.575, 56.680], // shimoli-g'arb
            [45.575, 73.132], // shimoli-sharq
            [36.675, 73.132], // janubi-sharq
            [36.675, 56.680], // janubi-g'arb
        ], {
            color: 'red',
            weight: 2,
            fillOpacity: 0.1
        }).addTo(map);

        // Xaritada klik qilganda marker qo'yish
        map.on('click', function(e) {
            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker(e.latlng).addTo(map);
            selectedLocation = e.latlng;

            // Manzilni topish uchun reverse geocoding
            getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
        });
    }
}

function getAddressFromCoordinates(lat, lng) {
    // Nominatim API yordamida manzilni olish
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                document.getElementById('mapAddress').value = data.display_name;
            } else {
                document.getElementById('mapAddress').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
        })
        .catch(error => {
            console.error('Manzil olishda xatolik:', error);
            document.getElementById('mapAddress').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        });
}

function confirmMapLocation() {
    if (selectedLocation) {
        // Checkout sahifasiga qaytish
        switchPage('checkoutPage');
        updateCheckoutDisplay();

        // Map form ichidagi textareani to'ldirish
        document.getElementById('mapAddress').value = document.getElementById('mapAddress').value ||
            `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
    } else {
        showNotification("Iltimos, avval xaritada manzilni belgilang!", "error");
    }
}

function resetMapLocation() {
    if (marker) {
        map.removeLayer(marker);
        marker = null;
        selectedLocation = null;
        document.getElementById('mapAddress').value = "";
    }
}

function updateSavedAddressesList() {
    const container = document.getElementById('savedAddressesList');
    if (!container) return;

    container.innerHTML = '';

    savedAddresses.forEach((address, index) => {
        const addressItem = document.createElement('div');
        addressItem.className = 'saved-address-item';
        addressItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="radio" name="savedAddress" id="address${index}" ${selectedSavedAddress === index ? 'checked' : ''} 
                       onchange="selectSavedAddress(${index})">
                <label for="address${index}" style="flex: 1; cursor: pointer;">
                    <div style="font-weight: 600;">${address.name}</div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">${address.region}, ${address.district}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${address.address}</div>
                </label>
                <button class="btn btn-danger" onclick="deleteSavedAddress(${index}, event)" style="padding: 0.3rem; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(addressItem);
    });
}

function selectSavedAddress(index) {
    selectedSavedAddress = index;
    const address = savedAddresses[index];

    if (address) {
        // Formani to'ldirish
        document.getElementById('regionSelect').value = address.region;
        updateDistricts();
        setTimeout(() => {
            document.getElementById('districtSelect').value = address.district;
            document.getElementById('fullAddress').value = address.address;
        }, 100);

        showNotification(`"${address.name}" manzili tanlandi`, "success");
    }
}

function deleteSavedAddress(index, event) {
    event.stopPropagation();

    if (confirm("Bu manzilni o'chirishni istaysizmi?")) {
        savedAddresses.splice(index, 1);
        if (selectedSavedAddress === index) {
            selectedSavedAddress = null;
        }
        updateSavedAddressesList();
        saveToLocalStorage();
        showNotification("Manzil o'chirildi", "success");
    }
}

// ===== BUYURTMA BERISH =====
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
    const checkoutUserEmail = document.getElementById("checkoutUserEmail");

    if (!checkoutItems || !checkoutTotal || !checkoutItemsCount || !checkoutUserEmail) return;

    // Emailni ko'rsatish
    if (currentUser && currentUser.email) {
        checkoutUserEmail.textContent = currentUser.email;
    } else {
        checkoutUserEmail.textContent = "Kiritilmagan";
    }

    // Savatdagi mahsulotlarni ko'rsatish
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
                <div style="font-weight: 600; color: var(--text-primary); font-size: 0.85rem;">${item.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-light);">${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
            <div style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">$${itemTotal.toFixed(2)}</div>
        `;
        checkoutItems.appendChild(itemElement);
    });

    checkoutTotal.textContent = `$${totalPrice.toFixed(2)}`;
    checkoutItemsCount.textContent = `${totalItems} ta`;
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
    // Manzilni tekshirish
    let region, district, fullAddress;
    let latitude = null;
    let longitude = null;
    let mapImageUrl = null;

    if (selectedAddressMethod === 'manual') {
        region = document.getElementById("regionSelect").value;
        district = document.getElementById("districtSelect").value;
        fullAddress = document.getElementById("fullAddress").value.trim();

        if (!region || !district || !fullAddress) {
            showNotification("Iltimos, barcha manzil maydonlarini to'ldiring!", "error");
            return;
        }
    } else if (selectedAddressMethod === 'map') {
        const mapAddress = document.getElementById("mapAddress").value.trim();
        if (!mapAddress) {
            showNotification("Iltimos, xaritadan manzil belgilang!", "error");
            return;
        }
        region = "Xaritadan belgilangan";
        district = "Xaritadan belgilangan";
        fullAddress = mapAddress;

        // Agar xarita lokatsiyasi tanlangan bo'lsa
        if (selectedLocation) {
            latitude = selectedLocation.lat;
            longitude = selectedLocation.lng;
        }
    }

    // Telefon raqamni tekshirish
    const userPhone = document.getElementById("userPhone").value.trim();
    if (!userPhone) {
        showNotification("Iltimos, telefon raqamingizni kiriting!", "error");
        return;
    }

    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(userPhone)) {
        showNotification("Iltimos, to'g'ri telefon raqam kiriting (+998901234567 formatida)", "error");
        return;
    }

    // Saqlangan manzilni taklif qilish
    const saveAddress = confirm("Bu manzilni saqlab qo'ymoqchimisiz? Keyingi buyurtmalarda foydalanishingiz mumkin.");
    if (saveAddress) {
        const addressName = prompt("Manzil nomini kiriting (masalan: Uy, Ish):", "Uy");
        if (addressName) {
            const newAddress = {
                name: addressName,
                region: region,
                district: district,
                address: fullAddress,
                latitude: latitude,
                longitude: longitude,
                createdAt: new Date().toISOString()
            };

            savedAddresses.push(newAddress);
            localStorage.setItem('hydroline_saved_addresses', JSON.stringify(savedAddresses));
            showNotification("Manzil saqlandi!", "success");
        }
    }

    // Qolgan validatsiyalar
    const orderComment = document.getElementById("orderComment").value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    if (!agreeTerms) {
        showNotification("Iltimos, foydalanish shartlari bilan roziligingizni bildiring!", "error");
        return;
    }

    // Yuklanmoqda bildirishnomasi
    showNotification("Buyurtma yuborilmoqda...", "warning");

    // Buyurtma ma'lumotlarini tayyorlash
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

    // Telegram xabari tayyorlash
    let message = `
🛒 YANGI BUYURTMA

👤 Mijoz: ${currentUser.name}
📞 Telefon: ${userPhone}
📧 Email: ${currentUser.email || "Kiritilmagan"}

📍 Manzil:
Viloyat: ${region}
Tuman: ${district}
To'liq manzil: ${fullAddress}
Manzil usuli: ${selectedAddressMethod === 'manual' ? 'Qo\'lda kiritish' : 'Xaritadan belgilash'}

`;

    // Agar GPS lokatsiya mavjud bo'lsa
    if (latitude && longitude) {
        message += `📍 GPS LOKATSIYA:
Kenglik: ${latitude.toFixed(6)}
Uzunlik: ${longitude.toFixed(6)}
Aniqlik: ${locationAccuracy ? Math.round(locationAccuracy) + ' metr' : 'Noma\'lum'}

🗺️ Xarita havolalari:
Google Maps: https://www.google.com/maps?q=${latitude},${longitude}
OpenStreetMap: https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}

`;
    }

    message += `
📦 Mahsulotlar:
${orderItems}

💰 Umumiy summa: $${totalAmount.toFixed(2)}
🎁 Umumiy bonus: $${totalBonusAmount.toFixed(2)} (${totalBonusAmount > 0 ? ((totalBonusAmount / totalAmount) * 100).toFixed(1) : 0}%)
💳 To'lov usuli: ${getPaymentMethodName(paymentMethod)}
📝 Izoh: ${orderComment || "Yo'q"}

⏰ Buyurtma vaqti: ${new Date().toLocaleString("uz-UZ")}
    `;

    try {
        // Birinchi navbatda matnli xabarni yuborish
        const textResponse = await sendToTelegram(message);

        if (textResponse.ok && latitude && longitude) {
            // Ikkinchi navbatda lokatsiyani yuborish
            const locationResponse = await sendLocationToTelegram(latitude, longitude);
        }

        if (textResponse.ok) {
            currentOrder = {
                id: Date.now(),
                date: new Date().toLocaleString("uz-UZ"),
                customerName: currentUser.name,
                customerPhone: userPhone,
                customerEmail: currentUser.email || "",
                region: region,
                district: district,
                address: fullAddress,
                latitude: latitude,
                longitude: longitude,
                accuracy: locationAccuracy,
                addressMethod: selectedAddressMethod,
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

async function sendLocationToTelegram(latitude, longitude) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                latitude: latitude,
                longitude: longitude,
            }),
        });

        const data = await response.json();

        return {
            ok: data.ok,
            data: data,
        };
    } catch (error) {
        console.error("Location send xatosi:", error);
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

function editProfileFromCheckout() {
    editProfile();
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
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Manzillar yo'q</h3>
                <p style="font-size: 0.85rem;">Sizda hali saqlangan manzillar yo'q</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    addresses.forEach((address, index) => {
        const addressItem = document.createElement("div");
        addressItem.className = "section";
        addressItem.style.marginBottom = "0.75rem";
        addressItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <div>
                    <h4 style="margin-bottom: 0.2rem; color: var(--text-primary); font-size: 0.9rem;">${address.name}</h4>
                    <div style="font-size: 0.75rem; color: var(--text-light);">
                        ${address.region}, ${address.district}
                    </div>
                </div>
                <button class="btn btn-danger" onclick="deleteAddress(${index})" style="padding: 0.4rem; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.8rem;">
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

    // Formani tozalash
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

    // Oldingi klasslarni olib tashlash
    notification.className = "notification";
    notificationIcon.className = "notification-icon";

    // Yangi klass qo'shish
    notification.classList.add(type);
    notificationIcon.classList.add(type);

    notification.style.display = "flex";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// ===== QIDIRUV FUNKSIYASI =====
function loadSearchResults(filteredProducts) {
    const productGrid = document.getElementById("productGrid");
    const catalogTitle = document.getElementById("catalogTitle");

    if (!productGrid || !catalogTitle) return;

    catalogTitle.textContent = `Qidiruv natijalari (${filteredProducts.length})`;

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Natija topilmadi</h3>
                <p style="font-size: 0.85rem;">"${document.getElementById("searchInput").value}" uchun hech narsa topilmadi</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
        productCard.onclick = () => showProductDetail(product.id);
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                <div class="product-badge">${product.bonus}% bonus</div>
            </div>
            <div class="product-info" style="flex: 1; display: flex; flex-direction: column; padding: 0.3rem;">
                <div class="product-title" style="font-size: 0.6rem; text-align: center; margin-bottom: 0.3rem; flex-grow: 1; line-height: 1.1;">
                    ${product.name}
                </div>
                <div class="product-price" style="font-size: 0.7rem; text-align: center; font-weight: bold; color: var(--primary); margin-bottom: 0.2rem;">
                    $${product.price.toFixed(2)}
                </div>
                <div class="product-actions" style="margin-top: auto; display: flex; gap: 0.2rem;">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); addToCart(${product.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-cart-plus" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); showProductDetail(${product.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-eye" style="font-size: 0.6rem;"></i>
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

// ===== GEO-LOCATION FUNKSIYALARI =====
function getCurrentLocationFromCheckout() {
    console.log("Checkout sahifasidan joriy lokatsiyani aniqlash");
    getCurrentLocation('checkout');
}

function getCurrentLocationFromMap() {
    console.log("Xarita sahifasidan joriy lokatsiyani aniqlash");
    getCurrentLocation('map');
}

function getCurrentLocation(source = 'checkout') {
    console.log(`Joriy lokatsiyani aniqlash so'rovi (manba: ${source})`);

    if (!navigator.geolocation) {
        showLocationStatus("Sizning qurilmangiz geolokatsiyani qo'llab-quvvatlamaydi", "error", source);
        return;
    }

    // Yuklanmoqda modalini ko'rsatish
    openModal("locationLoadingModal");
    locationSearchActive = true;

    // Geolocation sozlamalari
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (position) => handleLocationSuccess(position, source),
        (error) => handleLocationError(error, source),
        options
    );

    // Agar kerak bo'lsa, uzluksiz kuzatishni boshlash
    startWatchingLocation(source);
}

function handleLocationSuccess(position, source) {
    console.log("Lokatsiya muvaffaqiyatli olingan:", position);

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    locationAccuracy = position.coords.accuracy;

    // Aniqlik ma'lumotlarini yangilash
    updateAccuracyInfo(locationAccuracy);

    // O'zbekiston chegaralarini tekshirish
    if (!isLocationInUzbekistan(latitude, longitude)) {
        showLocationStatus("Siz O'zbekiston hududida emassiz", "warning", source);
        setTimeout(() => closeModal("locationLoadingModal"), 2000);
        return;
    }

    // Joylashuvni saqlash
    lastKnownLocation = { lat: latitude, lng: longitude };

    if (source === 'map' && document.getElementById("mapPage").classList.contains("active")) {
        // Xarita sahifasida bo'lsak
        handleMapLocation(latitude, longitude);
    } else {
        // Checkout sahifasida bo'lsak
        handleCheckoutLocation(latitude, longitude);
    }

    // Modalni yopish
    setTimeout(() => {
        closeModal("locationLoadingModal");
        locationSearchActive = false;
    }, 1500);
}

function handleMapLocation(latitude, longitude) {
    if (!map) return;

    // Xaritani markazlashtirish
    map.setView([latitude, longitude], 16);

    // Oldingi markerlarni tozalash
    if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
    }
    if (marker) {
        map.removeLayer(marker);
    }

    // Yangi marker yaratish
    currentLocationMarker = L.marker([latitude, longitude], {
        icon: L.divIcon({
            className: 'current-location-marker',
            html: `<div style="background: #4361ee; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(67, 97, 238, 0.8);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        }),
        zIndexOffset: 1000
    }).addTo(map);

    // Tanlangan joyni yangilash
    selectedLocation = { lat: latitude, lng: longitude };
    marker = currentLocationMarker;

    // Manzilni olish
    getAddressFromCoordinates(latitude, longitude);

    // Aniqlik doirasi
    L.circle([latitude, longitude], {
        color: '#4361ee',
        fillColor: '#4361ee',
        fillOpacity: 0.1,
        radius: locationAccuracy
    }).addTo(map);

    showLocationStatus(`Joylashuv aniqlangan! Aniqlik: ${Math.round(locationAccuracy)} metr`, "success", 'map');
}

function handleCheckoutLocation(latitude, longitude) {
    selectedLocation = { lat: latitude, lng: longitude };

    // Manzilni olish
    getAddressForCheckout(latitude, longitude);

    // Xarita formida ko'rsatish
    document.getElementById('mapAddress').value = `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

    showLocationStatus("Joylashuv aniqlangan va saqlandi", "success", 'checkout');

    // Saqlangan manzillar ro'yxatiga qo'shish taklifi
    setTimeout(() => {
        if (confirm("Bu lokatsiyani saqlangan manzillar ro'yxatiga qo'shmoqchimisiz?")) {
            saveCurrentLocationToAddresses(latitude, longitude);
        }
    }, 1000);
}

function saveCurrentLocationToAddresses(latitude, longitude) {
    // Geolocation dan manzilni olish
    getAddressFromCoordinates(latitude, longitude).then(address => {
        const newAddress = {
            name: "Mening joyim",
            region: "GPS orqali aniqlangan",
            district: "GPS orqali aniqlangan",
            address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude: latitude,
            longitude: longitude,
            accuracy: locationAccuracy,
            createdAt: new Date().toISOString(),
            type: "gps"
        };

        addresses.push(newAddress);
        saveToLocalStorage();
        showNotification("Lokatsiya saqlangan manzillar ro'yxatiga qo'shildi!", "success");
    });
}

function getAddressForCheckout(latitude, longitude) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                const address = data.display_name;
                document.getElementById('mapAddress').value = address;

                // Agar manzilda viloyat va tuman ma'lumotlari bo'lsa
                if (data.address) {
                    let region = '';
                    let district = '';

                    // Viloyatni aniqlash
                    if (data.address.state) region = data.address.state;
                    else if (data.address.province) region = data.address.province;

                    // Tuman/shaharni aniqlash
                    if (data.address.county) district = data.address.county;
                    else if (data.address.city) district = data.address.city;
                    else if (data.address.town) district = data.address.town;
                    else if (data.address.village) district = data.address.village;

                    // Formani to'ldirish
                    if (region && district) {
                        document.getElementById('regionSelect').value = region;
                        updateDistricts();
                        setTimeout(() => {
                            document.getElementById('districtSelect').value = district;
                        }, 100);
                    }
                }
            } else {
                document.getElementById('mapAddress').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            }
        })
        .catch(error => {
            console.error('Manzil olishda xatolik:', error);
            document.getElementById('mapAddress').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        });
}

function handleLocationError(error, source) {
    console.error("Lokatsiya xatosi:", error);

    let errorMessage = "Joylashuv aniqlanmadi";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Lokatsiya ruxsati rad etildi. Iltimos, brauzer sozlamalaridan ruxsat bering.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Lokatsiya ma'lumotlari mavjud emas.";
            break;
        case error.TIMEOUT:
            errorMessage = "Lokatsiya olish vaqti tugadi. Qayta urinib ko'ring.";
            break;
        default:
            errorMessage = "Noma'lum xatolik yuz berdi.";
    }

    showLocationStatus(errorMessage, "error", source);

    setTimeout(() => {
        closeModal("locationLoadingModal");
        locationSearchActive = false;
    }, 3000);
}

function showLocationStatus(message, type, source) {
    let statusElement;

    if (source === 'checkout') {
        statusElement = document.getElementById('checkoutLocationStatus');
    } else if (source === 'map') {
        statusElement = document.getElementById('mapLocationStatus');
    } else {
        return;
    }

    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = 'location-status';
    statusElement.classList.add(type);
    statusElement.style.display = 'block';

    // 5 soniyadan keyin yashirish
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 5000);
}

function startWatchingLocation(source) {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            if (locationSearchActive) {
                updateAccuracyInfo(position.coords.accuracy);
            }
        },
        (error) => {
            console.error('Kuzatish xatosi:', error);
        },
        options
    );
}

function updateAccuracyInfo(accuracy) {
    const accuracyInfo = document.getElementById('locationAccuracyInfo');
    const accuracyValue = document.getElementById('accuracyValue');

    if (accuracyInfo && accuracyValue) {
        accuracyValue.textContent = Math.round(accuracy);
        accuracyInfo.style.display = 'block';

        // Aniqlik darajasiga qarab rang o'zgartirish
        let accuracyClass = 'low';
        if (accuracy < 50) accuracyClass = 'high';
        else if (accuracy < 200) accuracyClass = 'medium';

        accuracyInfo.className = accuracyClass;
    }
}

function cancelLocationSearch() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    locationSearchActive = false;
    closeModal("locationLoadingModal");
}

function isLocationInUzbekistan(latitude, longitude) {
    // O'zbekiston chegaralari (soddalashtirilgan)
    const uzbekistanBounds = {
        north: 45.575, // Shimoliy chegara
        south: 36.675, // Janubiy chegara
        west: 56.680, // G'arbiy chegara
        east: 73.132 // Sharqiy chegara
    };

    return (
        latitude >= uzbekistanBounds.south &&
        latitude <= uzbekistanBounds.north &&
        longitude >= uzbekistanBounds.west &&
        longitude <= uzbekistanBounds.east
    );
}

// ===== PROFILDAN MANZIL TANLASH =====
function useSavedAddress() {
    // Saqlangan manzillar ro'yxatini ko'rsatish
    if (savedAddresses.length > 0) {
        document.getElementById('savedAddressesSelection').style.display = 'block';
        updateAddressesSelectionList();
    } else {
        showNotification("Sizda saqlangan manzillar yo'q!", "info");
        useNewAddress();
    }
}

function updateAddressesSelectionList() {
    const container = document.getElementById('addressesSelectionList');
    if (!container) return;

    container.innerHTML = '';

    savedAddresses.forEach((address, index) => {
        const addressItem = document.createElement('div');
        addressItem.className = 'saved-address-item';
        addressItem.innerHTML = `
            <div style="padding: 0.75rem; border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 0.5rem; cursor: pointer;" 
                 onclick="selectAddressForOrder(${index})">
                <div style="font-weight: 600; margin-bottom: 0.3rem;">${address.name}</div>
                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.2rem;">
                    ${address.region}, ${address.district}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">${address.address}</div>
            </div>
        `;
        container.appendChild(addressItem);
    });
}

function selectAddressForOrder(index) {
    const address = savedAddresses[index];
    if (address) {
        // Formani to'ldirish
        document.getElementById('regionSelect').value = address.region;
        updateDistricts();
        setTimeout(() => {
            document.getElementById('districtSelect').value = address.district;
            document.getElementById('fullAddress').value = address.address;
        }, 100);

        closeModal('addressSelectionModal');
        showNotification(`"${address.name}" manzili tanlandi`, "success");
    }
}

function useNewAddress() {
    closeModal('addressSelectionModal');
    // Qo'lda kiritish usulini tanlash
    selectAddressMethod('manual');
}

// ===== BUYURTMALAR FUNKSIYALARI =====
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
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Buyurtmalar yo'q</h3>
                <p style="font-size: 0.85rem;">Siz hali hech qanday buyurtma bermagansiz</p>
                <button class="btn btn-primary" onclick="showCatalog()" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
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
                orderItem.style.marginBottom = "0.75rem";
                orderItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <div>
                    <h4 style="margin-bottom: 0.2rem; color: var(--text-primary); font-size: 0.9rem;">Buyurtma #${order.id.toString().slice(-6)}</h4>
                    <div style="font-size: 0.75rem; color: var(--text-light);">
                        <i class="far fa-calendar"></i> ${order.date}
                    </div>
                </div>
                <div style="background: ${getStatusColor(order.status)}; color: white; padding: 0.3rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600;">
                    ${order.status}
                </div>
            </div>
            
            <div style="margin-bottom: 0.75rem;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.8rem;">
                        <span style="flex: 1; margin-right: 0.5rem;">${item.name} × ${item.quantity}</span>
                        <span style="font-weight: 600; white-space: nowrap;">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="border-top: 1px solid var(--gray-200); padding-top: 0.75rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; margin-bottom: 0.4rem;">
                    <span>Jami:</span>
                    <span>$${order.totalAmount.toFixed(2)}</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 0.2rem;">
                    <i class="fas fa-credit-card"></i> ${getPaymentMethodName(order.paymentMethod)}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-light);">
                    <i class="fas fa-map-marker-alt"></i> ${order.region}, ${order.district}
                </div>
                ${order.comment ? `
                    <div style="margin-top: 0.5rem; padding: 0.5rem; background: var(--gray-100); border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--text-secondary);">
                        <i class="fas fa-comment"></i> ${order.comment}
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" style="flex: 1; padding: 0.5rem; font-size: 0.8rem;" onclick="repeatOrder(${index})">
                    <i class="fas fa-redo"></i> Qayta buyurtma
                </button>
                <button class="btn btn-primary" style="flex: 1; padding: 0.5rem; font-size: 0.8rem;" onclick="trackOrder(${index})">
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

// ===== SEVIMLILAR FUNKSIYALARI =====
function showFavorites() {
    switchPage("favoritesPage");
    updateFavoritesList();
}

function updateFavoritesList() {
    const container = document.getElementById("favoritesList");
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-heart" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3; color: red;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Sevimlilar bo'sh</h3>
                <p style="font-size: 0.85rem;">Yoqtirgan mahsulotlaringizni bu yerda saqlashingiz mumkin</p>
                <button class="btn btn-primary" onclick="showCatalog()" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
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
        favoriteItem.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
        favoriteItem.innerHTML = `
            <div class="product-image" style="background-image: url('${item.image}')">
                <div class="product-badge">${item.bonus}% bonus</div>
            </div>
            <div class="product-info" style="flex: 1; display: flex; flex-direction: column; padding: 0.3rem;">
                <div class="product-title" style="font-size: 0.6rem; text-align: center; margin-bottom: 0.3rem; flex-grow: 1; line-height: 1.1;">
                    ${item.name}
                </div>
                <div class="product-price" style="font-size: 0.7rem; text-align: center; font-weight: bold; color: var(--primary); margin-bottom: 0.2rem;">
                    $${item.price.toFixed(2)}
                </div>
                <div class="product-actions" style="margin-top: auto; display: flex; gap: 0.2rem;">
                    <button class="btn btn-primary" onclick="showProductDetail(${item.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-eye" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-outline" onclick="addToCart(${item.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-cart-plus" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-danger" onclick="removeFromFavorites(${index})" style="padding: 0.2rem; font-size: 0.55rem; min-width: 22px; min-height: 22px;">
                        <i class="fas fa-trash" style="font-size: 0.6rem;"></i>
                    </button>
                </div>
                <div style="font-size: 0.55rem; color: var(--text-light); margin-top: 0.3rem; text-align: center;">
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

// ===== KO'RILGAN MAHSULOTLAR =====
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

function showViewed() {
    switchPage("viewedPage");
    updateViewedList();
}

function updateViewedList() {
    const container = document.getElementById("viewedList");
    if (!container) return;

    if (viewedProducts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-light);">
                <i class="fas fa-eye" style="font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Ko'rilganlar yo'q</h3>
                <p style="font-size: 0.85rem;">Siz hali hech qanday mahsulotni ko'rmagansiz</p>
                <button class="btn btn-primary" onclick="showCatalog()" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.85rem;">
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
        viewedItem.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
        viewedItem.innerHTML = `
            <div class="product-image" style="background-image: url('${item.image}')">
                <div class="product-badge">${item.bonus}% bonus</div>
            </div>
            <div class="product-info" style="flex: 1; display: flex; flex-direction: column; padding: 0.3rem;">
                <div class="product-title" style="font-size: 0.6rem; text-align: center; margin-bottom: 0.3rem; flex-grow: 1; line-height: 1.1;">
                    ${item.name}
                </div>
                <div class="product-price" style="font-size: 0.7rem; text-align: center; font-weight: bold; color: var(--primary); margin-bottom: 0.2rem;">
                    $${item.price.toFixed(2)}
                </div>
                <div class="product-actions" style="margin-top: auto; display: flex; gap: 0.2rem;">
                    <button class="btn btn-primary" onclick="showProductDetail(${item.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-eye" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-outline" onclick="addToCart(${item.id})" style="padding: 0.2rem; font-size: 0.55rem; flex: 1; min-height: 22px;">
                        <i class="fas fa-cart-plus" style="font-size: 0.6rem;"></i>
                    </button>
                    <button class="btn btn-outline" onclick="addToFavoritesFromViewed(${item.id})" style="padding: 0.2rem; font-size: 0.55rem; min-width: 22px; min-height: 22px;">
                        <i class="fas fa-heart" style="font-size: 0.6rem;"></i>
                    </button>
                </div>
                <div style="font-size: 0.55rem; color: var(--text-light); margin-top: 0.3rem; text-align: center;">
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

function viewOrders() {
    showOrders();
}

// ===== QO'SHIMCHA FUNKSIYALAR =====
function updateFavoritesBadge() {
    const badge = document.getElementById("favoritesCount");
    if (badge) badge.textContent = favorites.length;
}

function updateOrdersBadge() {
    const badge = document.getElementById("ordersCount");
    if (badge) badge.textContent = orders.length;
}

function updateViewedBadge() {
    const badge = document.getElementById("viewedCount");
    if (badge) badge.textContent = viewedProducts.length;
}

// ===== DASTLABKI YUKLASH =====
document.addEventListener("DOMContentLoaded", function() {
    console.log("Hydroline do'koni yuklandi!");

    // Dasturni boshlash
    initializeApp();

    // Inputga Enter bosganda kirish
    document.getElementById("userName").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            console.log("Enter bosildi, startApp chaqiriladi");
            startApp();
        }
    });

    // Qidiruv funksiyasi
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

    // Modal overlay bosilganda yopish
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", function() {
            const modal = this.closest(".modal");
            if (modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    });

    // Geolocation permission check
    if ('permissions' in navigator) {
        navigator.permissions.query({name: 'geolocation'})
            .then(permissionStatus => {
                console.log('Geolocation ruxsati:', permissionStatus.state);
                
                permissionStatus.onchange = function() {
                    console.log('Geolocation ruxsati o\'zgardi:', this.state);
                };
            });
    }

    // Checkout sahifasida map method tanlangan bo'lsa, xaritani yaratish
    document.getElementById('mapAddressForm').addEventListener('click', function() {
        if (selectedAddressMethod === 'map' && !map) {
            setTimeout(initializeMap, 500);
        }
    });
});

// Konsolni bloklash
console.log = function() {};
console.error = function() {};
console.warn = function() {};
console.info = function() {};
console.debug = function() {};