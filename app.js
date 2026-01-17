// ===== KONFIGURATSIYA =====
const TELEGRAM_BOT_TOKEN = "7692859653:AAE_8ddxOhqdjiqV8nJMQCp1ud46jvSGlDE";
const TELEGRAM_CHAT_ID = "8074394669";

// ===== GLOBAL O'ZGARUVCHILAR =====
let cart = [];
let currentUser = null;
let currentCategory = "all";
let lastPage = "homePage";
let currentOrder = null;

// Viloyat va tumanlar ma'lumotlari
const regions = {
    Toshkent: [
        "Olmazor",
        "Bektemir",
        "Mirobod",
        "Mirzo Ulug'bek",
        "Sergeli",
        "Shayxontohur",
        "Chilonzor",
        "Yashnobod",
        "Yunusobod",
        "Yakkasaroy",
        "Uchtepa",
    ],
    Andijon: [
        "Andijon shahri",
        "Xonobod",
        "Shahrixon",
        "Asaka",
        "Qo'rg'ontepa",
        "Baliqchi",
        "Oltinko'l",
        "Jalaquduq",
        "Izboskan",
        "Paxtaobod",
        "Marhamat",
        "Buloqboshi",
        "Boz",
        "Ulug'nor",
    ],
    "Farg'ona": [
        "Farg'ona shahri",
        "Marg'ilon",
        "Qo'qon",
        "Quvasoy",
        "Beshariq",
        "Bog'dod",
        "Buvayda",
        "Dang'ara",
        "Yozyovon",
        "Oltiariq",
        "Qo'shtepa",
        "Rishton",
        "So'x",
        "Toshloq",
        "Uchko'prik",
        "O'zbekiston",
    ],
    Namangan: [
        "Namangan shahri",
        "Chortoq",
        "Chust",
        "Kosonsoy",
        "Mingbuloq",
        "Norin",
        "Pop",
        "To'raqo'rg'on",
        "Uchqo'rg'on",
        "Uychi",
        "Yangiqo'rg'on",
    ],
    Samarqand: [
        "Samarqand shahri",
        "Bulung'ur",
        "Ishtixon",
        "Jomboy",
        "Kattaqo'rg'on",
        "Narpay",
        "Nurobod",
        "Oqdaryo",
        "Paxtachi",
        "Payariq",
        "Pastdarg'om",
        "Qo'shrabot",
        "Toyloq",
        "Urgut",
    ],
    Buxoro: [
        "Buxoro shahri",
        "Olot",
        "G'ijduvon",
        "Jondor",
        "Kogon",
        "Qorako'l",
        "Qorovulbozor",
        "Peshku",
        "Romitan",
        "Shofirkon",
        "Vobkent",
    ],
    Xorazm: [
        "Urganch shahri",
        "Xiva",
        "Bog'ot",
        "Gurlan",
        "Qo'shko'pir",
        "Shovot",
        "Tuproqqal'a",
        "Xonqa",
        "Xazorasp",
        "Yangiariq",
        "Yangibozor",
    ],
    Navoiy: [
        "Navoiy shahri",
        "Zarafshon",
        "Karmana",
        "Konimex",
        "Navbahor",
        "Nurota",
        "Tomdi",
        "Uchquduq",
    ],
    Qashqadaryo: [
        "Qarshi shahri",
        "Shahrisabz",
        "Chiroqchi",
        "Dehqonobod",
        "G'uzor",
        "Kasbi",
        "Kitob",
        "Koson",
        "Mirishkor",
        "Muborak",
        "Nishon",
        "Qamashi",
        "Yakkabog'",
    ],
    Surxondaryo: [
        "Termiz shahri",
        "Bandixon",
        "Boysun",
        "Denov",
        "Jarqo'rg'on",
        "Muzrabot",
        "Oltinsoy",
        "Qiziriq",
        "Qumqo'rg'on",
        "Sariosiyo",
        "Sherobod",
        "Sho'rchi",
        "Uzun",
    ],
    Jizzax: [
        "Jizzax shahri",
        "Arnasoy",
        "Baxmal",
        "Do'stlik",
        "Forish",
        "G'allaorol",
        "Sharof Rashidov",
        "Mirzacho'l",
        "Paxtakor",
        "Yangiobod",
        "Zomin",
        "Zafarobod",
    ],
    Sirdaryo: [
        "Guliston shahri",
        "Boyovut",
        "Oqoltin",
        "Sayxunobod",
        "Sardoba",
        "Sirdaryo shahri",
        "Xovos",
        "Yangiyer",
    ],
    "Qoraqalpog'iston": [
        "Nukus shahri",
        "Amudaryo",
        "Beruniy",
        "Chimboy",
        "Ellikqal'a",
        "Kegeyli",
        "Mo'ynoq",
        "Nukus tumani",
        "Qonliko'l",
        "Qo'ng'irot",
        "Shumanay",
        "Taxtako'pir",
        "To'rtko'l",
        "Xo'jayli",
    ],
};

// ===== DASTLABKI MAHSULOTLAR =====
const sampleProducts = [{
        id: 1,
        name: "Nike Air Max 270",
        price: 450000,
        category: "Oyoq kiyimlar",
        description: "Nike Air Max 270 - bu eng yangi va qulay kundalik krossovkalar. Havoni his qilish uchun maxsus tayyorlangan.",
        image: "https://www.bmwgroup-classic.com/content/grpw/websites/bmwgroup-classic_com/en/company/museum/motorcycle-racing/popup/bmw-wr-500-weltrekordgespann/_jcr_content/main/globalimage_copy_cop.coreimg.82.1920.jpeg/1693487596933/rf-9898-1.jpeg",
    },
    {
        id: 2,
        name: "Adidas T-shirt",
        price: 120000,
        category: "Kiyimlar",
        description: "100% paxtadan tayyorlangan, nafas oladigan Adidas futbolka. Kundalik foydalanish uchun juda qulay.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 3,
        name: "iPhone 14 Pro",
        price: 8500000,
        category: "Elektronika",
        description: "Apple iPhone 14 Pro - eng yangi texnologiyalar bilan jihozlangan smartfon. 256GB xotira, 48MP asosiy kamera.",
        image: "https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 4,
        name: 'Samsung 55" 4K Smart TV',
        price: 3500000,
        category: "Elektronika",
        description: "Samsung 55 dyumli 4K Smart TV. Crystal Processor 4K, HDR10+, Smart TV platformasi.",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHZ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 5,
        name: "Uy pardasi to'plami",
        price: 250000,
        category: "Uy-ro'zg'or",
        description: "3 donadan iborat uy pardasi to'plami. 100% paxta, yuvilganda bo'shlashtirmaydi, ranglari o'chmaydi.",
        image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkc2hlZXRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 6,
        name: "Chanel Chance Parfum",
        price: 180000,
        category: "Go'zallik",
        description: "Chanel Chance parfyumeriyasi - yangi va jozibali hid. 50ml, original Fransiyadan.",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 7,
        name: "Levi's Jeans",
        price: 220000,
        category: "Kiyimlar",
        description: "Levi's 501 klassik jeans. 100% paxta, amerikancha uslubda tayyorlangan.",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 8,
        name: "Samsung Galaxy S23",
        price: 7200000,
        category: "Elektronika",
        description: "Samsung Galaxy S23 Ultra - 200MP kamera, 8K video yozish, Snapdragon 8 Gen 2 protsessori.",
        image: "https://images.unsplash.com/photo-1678911820854-35c8b0e20949?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMHMyM3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
];

// ===== ASOSIY FUNKSIYALAR =====

// Dasturni boshlash
function startApp() {
    const userName = document.getElementById("userName").value.trim();

    if (!userName) {
        showNotification("Iltimos, ismingizni kiriting!", "error");
        return;
    }

    // Foydalanuvchini saqlash
    currentUser = {
        name: userName,
        phone: "",
        email: "",
        loyaltyPoints: 0,
    };

    // Sahifalarni ko'rsatish
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("mainHeader").style.display = "block";
    document.getElementById("searchContainer").style.display = "flex";
    document.getElementById("bottomNav").style.display = "flex";

    // Foydalanuvchi ma'lumotlarini ko'rsatish
    updateUserDisplay();

    // Bosh sahifaga o'tish
    showHome();

    // Viloyatlarni ro'yxatga kiritish
    populateRegions();

    showNotification(`Xush kelibsiz, ${userName}!`, "success");
}

// Foydalanuvchi ma'lumotlarini yangilash
function updateUserDisplay() {
    if (!currentUser) return;

    document.getElementById("currentUserName").textContent = currentUser.name;
    document.getElementById("profileUserName").textContent = currentUser.name;
    document.getElementById("checkoutUserName").textContent = currentUser.name;
    document.getElementById("confirmationUserName").textContent =
        currentUser.name;

    if (currentUser.phone) {
        document.getElementById("profileUserPhone").textContent = currentUser.phone;
        document.getElementById("checkoutUserPhone").textContent =
            currentUser.phone;
        document.getElementById("userPhone").value = currentUser.phone;
    }
}

// Sahifani almashtirish
function switchPage(pageId) {
    // Oldingi sahifani eslab qolish
    if (
        pageId !== "profilePage" &&
        pageId !== "homePage" &&
        pageId !== "catalogPage" &&
        pageId !== "cartPage"
    ) {
        lastPage = pageId;
    }

    // Barcha sahifalarni yashirish
    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
    });

    // Tanlangan sahifani ko'rsatish
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    // Navigatsiya tugmalarini yangilash
    updateNavigation(pageId);
}

// Navigatsiyani yangilash
function updateNavigation(pageId) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    // Asosiy sahifalar uchun
    if (pageId === "homePage") {
        navItems[0].classList.add("active");
    } else if (pageId === "catalogPage") {
        navItems[1].classList.add("active");
    } else if (pageId === "cartPage") {
        navItems[2].classList.add("active");
    } else if (
        pageId === "profilePage" ||
        pageId === "ordersPage" ||
        pageId === "favoritesPage" ||
        pageId === "viewedPage" ||
        pageId === "addressesPage" ||
        pageId === "loyaltyPage"
    ) {
        navItems[3].classList.add("active");
    }
}

// Orqaga qaytish
function goBack() {
    if (
        lastPage === "profilePage" ||
        lastPage === "homePage" ||
        lastPage === "catalogPage" ||
        lastPage === "cartPage"
    ) {
        switchPage(lastPage);
    } else {
        switchPage("profilePage");
    }
}

// Asosiy sahifalar uchun funksiyalar
function showHome() {
    switchPage("homePage");
    lastPage = "homePage";
}

function showCatalog() {
    switchPage("catalogPage");
    loadCatalog("all");
    lastPage = "catalogPage";
}

function showCart() {
    switchPage("cartPage");
    updateCart();
    lastPage = "cartPage";
}

function showProfile() {
    switchPage("profilePage");
    lastPage = "profilePage";
}

// Kategoriyani ko'rsatish
function showCategory(category) {
    switchPage("catalogPage");
    loadCatalog(category);
    lastPage = "catalogPage";
}

// Katalog yuklash
function loadCatalog(category) {
    currentCategory = category;
    const productGrid = document.getElementById("productGrid");
    const catalogTitle = document.getElementById("catalogTitle");

    // Sarlavhani yangilash
    if (category === "all") {
        catalogTitle.textContent = "Barcha mahsulotlar";
    } else {
        catalogTitle.textContent = category;
    }

    // Mahsulotlarni filtrlash
    let filteredProducts = sampleProducts;
    if (category !== "all") {
        filteredProducts = sampleProducts.filter(
            (product) => product.category === category,
        );
    }

    // Mahsulotlarni chiqarish
    productGrid.innerHTML = "";
    filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.onclick = () => showProductDetail(product.id);
        productCard.innerHTML = `
                    <div class="product-image" style="background-image: url('${product.image}')">
                        <i class="fas fa-box" style="display: none;"></i>
                    </div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-price">${product.price.toLocaleString()} so'm</div>
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

    // Agar mahsulot yo'q bo'lsa
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <div>Bu kategoriyada hali mahsulotlar yo'q</div>
                    </div>
                `;
    }
}

// Mahsulot tafsilotlarini ko'rsatish
function showProductDetail(productId) {
    const product = sampleProducts.find((p) => p.id === productId);
    if (!product) return;

    document.getElementById("productDetailImage").innerHTML = `
                <div style="background-image: url('${product.image}'); width: 100%; height: 100%; background-size: cover; background-position: center;"></div>
            `;
    document.getElementById("productDetailName").textContent = product.name;
    document.getElementById("productDetailPrice").textContent =
        `${product.price.toLocaleString()} so'm`;
    document.getElementById("productDetailCategory").textContent =
        product.category;
    document.getElementById("productDetailDesc").textContent =
        product.description;

    // Mahsulot ID ni saqlash
    document.getElementById("productDetailImage").dataset.productId = productId;

    switchPage("productDetailPage");
    lastPage = "catalogPage";
}

// Savatchaga qo'shish (umumiy)
function addToCart(productId) {
    const product = sampleProducts.find((p) => p.id === productId);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
        });
    }

    updateCart();
    showNotification("Mahsulot savatchaga qo'shildi!", "success");
}

// Tafsilotlar sahifasidan savatchaga qo'shish
function addToCartFromDetail() {
    const productId = parseInt(
        document.getElementById("productDetailImage").dataset.productId,
    );
    addToCart(productId);
}

// Savatni yangilash
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");

    if (cart.length === 0) {
        cartItems.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: var(--gray);">
                        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <div>Savatda hali mahsulot yo'q</div>
                    </div>
                `;
        totalPriceElement.textContent = "0 so'm";
        return;
    }

    let totalPrice = 0;
    cartItems.innerHTML = "";

    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
                    <div class="cart-item-image" style="background-image: url('${item.image}')">
                        <i class="fas fa-box" style="display: none;"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} so'm</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
        cartItems.appendChild(cartItem);
    });

    totalPriceElement.textContent = `${totalPrice.toLocaleString()} so'm`;
}

// Miqdorni o'zgartirish
function updateQuantity(productId, change) {
    const item = cart.find((item) => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter((item) => item.id !== productId);
        }

        updateCart();
    }
}

// ===== BUYURTMA BERISH =====

// Buyurtma sahifasini ko'rsatish
function showCheckoutPage() {
    if (cart.length === 0) {
        showNotification("Iltimos, avval mahsulot qo'shing!", "error");
        return;
    }

    // Mahsulotlarni ko'rsatish
    const checkoutItems = document.getElementById("checkoutItems");
    let totalPrice = 0;

    checkoutItems.innerHTML = "";
    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;

        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item";
        itemDiv.innerHTML = `
                    <div>${item.name} × ${item.quantity}</div>
                    <div>${(item.price * item.quantity).toLocaleString()} so'm</div>
                `;
        checkoutItems.appendChild(itemDiv);
    });

    // Umumiy summani ko'rsatish
    document.getElementById("checkoutTotal").textContent =
        `${totalPrice.toLocaleString()} so'm`;

    // Telefon raqamni o'rnatish
    if (currentUser && currentUser.phone) {
        document.getElementById("userPhone").value = currentUser.phone;
    } else {
        document.getElementById("userPhone").value = "";
    }

    switchPage("checkoutPage");
}

// Viloyatlarni ro'yxatga kiritish
function populateRegions() {
    const regionSelect = document.getElementById("regionSelect");
    const modalRegionSelect = document.getElementById("modalRegionSelect");

    regionSelect.innerHTML = '<option value="">Viloyatni tanlang</option>';
    modalRegionSelect.innerHTML = '<option value="">Viloyatni tanlang</option>';

    Object.keys(regions).forEach((region) => {
        regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
        modalRegionSelect.innerHTML += `<option value="${region}">${region}</option>`;
    });
}

// Tumanlarni yangilash
function updateDistricts() {
    const regionSelect = document.getElementById("regionSelect");
    const districtSelect = document.getElementById("districtSelect");

    const selectedRegion = regionSelect.value;

    if (selectedRegion && regions[selectedRegion]) {
        districtSelect.disabled = false;
        districtSelect.innerHTML =
            '<option value="">Tuman/Shaharni tanlang</option>';

        regions[selectedRegion].forEach((district) => {
            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    } else {
        districtSelect.disabled = true;
        districtSelect.innerHTML =
            '<option value="">Avval viloyatni tanlang</option>';
    }
}

// Modal uchun tumanlarni yangilash
function updateModalDistricts() {
    const modalRegionSelect = document.getElementById("modalRegionSelect");
    const modalDistrictSelect = document.getElementById("modalDistrictSelect");

    const selectedRegion = modalRegionSelect.value;

    if (selectedRegion && regions[selectedRegion]) {
        modalDistrictSelect.disabled = false;
        modalDistrictSelect.innerHTML =
            '<option value="">Tuman/Shaharni tanlang</option>';

        regions[selectedRegion].forEach((district) => {
            modalDistrictSelect.innerHTML += `<option value="${district}">${district}</option>`;
        });
    } else {
        modalDistrictSelect.disabled = true;
        modalDistrictSelect.innerHTML =
            '<option value="">Avval viloyatni tanlang</option>';
    }
}

// Buyurtmani yuborish
async function submitOrder() {
    // Ma'lumotlarni tekshirish
    const region = document.getElementById("regionSelect").value;
    const district = document.getElementById("districtSelect").value;
    const fullAddress = document.getElementById("fullAddress").value.trim();
    const userPhone = document.getElementById("userPhone").value.trim();
    const orderComment = document.getElementById("orderComment").value.trim();
    const paymentMethod = document.querySelector(
        'input[name="payment"]:checked',
    ).value;

    // Validatsiya
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

    // Telefon raqamni tekshirish
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(userPhone)) {
        showNotification(
            "Iltimos, to'g'ri telefon raqam kiriting (+998901234567 formatida)",
            "error",
        );
        return;
    }

    // Yuklanmoqda bildirishnomasini ko'rsatish
    showNotification("Buyurtma yuborilmoqda...", "warning");

    // Buyurtma ma'lumotlarini tayyorlash
    let orderItems = "";
    let totalAmount = 0;

    cart.forEach((item) => {
        orderItems += `• ${item.name} - ${item.quantity} x ${item.price.toLocaleString()} = ${(item.price * item.quantity).toLocaleString()} so'm\n`;
        totalAmount += item.price * item.quantity;
    });

    // Telegramga yuborish uchun xabar
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

💰 Umumiy summa: ${totalAmount.toLocaleString()} so'm
💳 To'lov usuli: ${getPaymentMethodName(paymentMethod)}
📝 Izoh: ${orderComment || "Yo'q"}

⏰ Buyurtma vaqti: ${new Date().toLocaleString("uz-UZ")}
    `;

    // Telegram botga xabar yuborish
    try {
        const response = await sendToTelegram(message);

        if (response.ok) {
            // Muvaffaqiyatli yuborilgandan keyin
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
                paymentMethod: paymentMethod,
                comment: orderComment,
                status: "Yangi",
            };

            // Foydalanuvchi telefon raqamini saqlash
            currentUser.phone = userPhone;
            updateUserDisplay();

            // Loyallik ballarini hisoblash (har 10,000 so'm uchun 1 ball)
            const newPoints = Math.floor(totalAmount / 10000);
            currentUser.loyaltyPoints += newPoints;
            document.getElementById("loyaltyPoints").textContent =
                currentUser.loyaltyPoints;
            document.getElementById("loyaltyPointsDisplay").textContent =
                `${currentUser.loyaltyPoints} ball`;

            // Savatni tozalash
            cart = [];
            updateCart();

            // Telegramga yuborilganidan keyin tasdiq xabarini ko'rsatish
            showNotification(
                "Ma'lumotlaringiz qabul qilindi. Tez orada sizga aloqaga chiqishadi!",
                "success",
            );

            // Buyurtma tasdiq sahifasiga o'tish
            showOrderConfirmation();
        } else {
            throw new Error("Telegram API xatosi");
        }
    } catch (error) {
        console.error("Xatolik:", error);
        showNotification(
            "Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
            "error",
        );
    }
}

// Telegram botga xabar yuborish
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

// To'lov usulini nomini olish
function getPaymentMethodName(method) {
    const methods = {
        cash: "Naqd pul",
        card: "Bank kartasi",
        click: "Click",
        payme: "Payme",
    };
    return methods[method] || method;
}

// Buyurtma tasdiq sahifasini ko'rsatish
function showOrderConfirmation() {
    if (!currentOrder) return;

    document.getElementById("orderNumber").textContent =
        `#${currentOrder.id.toString().slice(-6)}`;
    document.getElementById("summaryTotal").textContent =
        `${currentOrder.totalAmount.toLocaleString()} so'm`;
    document.getElementById("summaryAddress").textContent =
        `${currentOrder.region}, ${currentOrder.district}`;

    switchPage("orderConfirmationPage");
}

// Xaridni davom ettirish
function continueShopping() {
    showHome();
}

function viewOrders() {
    showOrders();
}

// ===== PROFIL FUNKSIYALARI =====

// Profilni tahrirlash
function editProfile() {
    if (!currentUser) return;

    document.getElementById("editPhone").value = currentUser.phone || "";
    document.getElementById("editEmail").value = currentUser.email || "";
    openModal("profileModal");
}

// Profilni saqlash
function saveProfile() {
    const phone = document.getElementById("editPhone").value.trim();
    const email = document.getElementById("editEmail").value.trim();

    // Telefon raqamni tekshirish
    if (phone && !phone.match(/^\+998\d{9}$/)) {
        showNotification("Iltimos, to'g'ri telefon raqam kiriting!", "error");
        return;
    }

    currentUser.phone = phone;
    currentUser.email = email;

    updateUserDisplay();
    closeModal("profileModal");
    showNotification("Profil ma'lumotlari yangilandi!", "success");
}

// Ismni o'zgartirish
function changeName() {
    if (!currentUser) return;

    document.getElementById("newUserName").value = currentUser.name;
    openModal("nameModal");
}

// Yangi ismni saqlash
function saveNewName() {
    const newName = document.getElementById("newUserName").value.trim();

    if (!newName) {
        showNotification("Iltimos, yangi ism kiriting!", "error");
        return;
    }

    currentUser.name = newName;
    updateUserDisplay();
    closeModal("nameModal");
    showNotification("Ism muvaffaqiyatli o'zgartirildi!", "success");
}

// Manzillar ro'yxatini ko'rsatish
function showAddresses() {
    switchPage("addressesPage");
    updateAddressesList();
}

// Manzillar ro'yxatini yangilash
function updateAddressesList() {
    // Hozircha oddiy sahifa, kelajakda saqlangan manzillar bo'lishi mumkin
}

// Manzil qo'shish
function openAddAddress() {
    openModal("addressModal");
}

// Manzilni saqlash
function saveAddress() {
    const name = document.getElementById("addressName").value.trim();
    const region = document.getElementById("modalRegionSelect").value;
    const district = document.getElementById("modalDistrictSelect").value;
    const fullAddress = document.getElementById("modalFullAddress").value.trim();

    if (!name || !region || !district || !fullAddress) {
        showNotification("Iltimos, barcha maydonlarni to'ldiring!", "error");
        return;
    }

    // Manzilni saqlash (kelajakda ma'lumotlar bazasiga saqlanishi mumkin)
    const newAddress = {
        name: name,
        region: region,
        district: district,
        address: fullAddress,
    };

    showNotification("Yangi manzil qo'shildi!", "success");
    closeModal("addressModal");

    // Formani tozalash
    document.getElementById("addressName").value = "";
    document.getElementById("modalRegionSelect").value = "";
    document.getElementById("modalDistrictSelect").value = "";
    document.getElementById("modalDistrictSelect").disabled = true;
    document.getElementById("modalFullAddress").value = "";
}

// Buyurtmalarni ko'rsatish
function showOrders() {
    switchPage("ordersPage");
}

// Sevimlilarni ko'rsatish
function showFavorites() {
    switchPage("favoritesPage");
}

// Ko'rilganlarni ko'rsatish
function showViewed() {
    switchPage("viewedPage");
}

// Loyallik dasturini ko'rsatish
function showLoyalty() {
    if (currentUser) {
        document.getElementById("loyaltyPointsDisplay").textContent =
            `${currentUser.loyaltyPoints || 0} ball`;
    }
    switchPage("loyaltyPage");
}

// Chiqish
function logout() {
    if (confirm("Haqiqatan ham chiqmoqchimisiz?")) {
        // Ma'lumotlarni tozalash
        currentUser = null;
        cart = [];

        // Kirish sahifasiga qaytish
        document.getElementById("loginPage").classList.add("active");
        document.getElementById("mainHeader").style.display = "none";
        document.getElementById("searchContainer").style.display = "none";
        document.getElementById("bottomNav").style.display = "none";

        // Boshqa sahifalarni yashirish
        switchPage("homePage");

        // Formani tozalash
        document.getElementById("userName").value = "";

        showNotification("Siz tizimdan chiqdingiz", "success");
    }
}

// ===== UMUMIY FUNKSIYALAR =====

// Modal ochish
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

// Modal yopish
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Xabarlarni ko'rsatish
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");

    notificationText.textContent = message;

    // Oldingi klasslarni olib tashlash
    notification.classList.remove("error", "warning", "success");

    // Yangi klass qo'shish
    if (type === "error") {
        notification.classList.add("error");
    } else if (type === "warning") {
        notification.classList.add("warning");
    } else {
        notification.classList.add("success");
    }

    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000); // 5 soniya
}

// ===== DASTLABKI SOZLAMALAR =====
document.addEventListener("DOMContentLoaded", function() {
    console.log("Magicbot do'koni yuklandi!");

    // Qidiruv funksiyasi
    document
        .getElementById("searchInput")
        .addEventListener("input", function(e) {
            const searchTerm = e.target.value.toLowerCase();

            if (searchTerm.length > 2) {
                const filtered = sampleProducts.filter(
                    (product) =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm),
                );

                if (
                    document.getElementById("catalogPage").classList.contains("active")
                ) {
                    loadSearchResults(filtered);
                }
            } else if (
                searchTerm.length === 0 &&
                document.getElementById("catalogPage").classList.contains("active")
            ) {
                loadCatalog(currentCategory);
            }
        });
});

// Qidiruv natijalarini ko'rsatish
function loadSearchResults(filteredProducts) {
    const productGrid = document.getElementById("productGrid");
    const catalogTitle = document.getElementById("catalogTitle");

    catalogTitle.textContent = `Qidiruv natijalari (${filteredProducts.length})`;

    productGrid.innerHTML = "";
    filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.onclick = () => showProductDetail(product.id);
        productCard.innerHTML = `
                    <div class="product-image" style="background-image: url('${product.image}')">
                        <i class="fas fa-box" style="display: none;"></i>
                    </div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-price">${product.price.toLocaleString()} so'm</div>
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

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <div>"${document.getElementById("searchInput").value}" uchun hech narsa topilmadi</div>
                    </div>
                `;
    }
}