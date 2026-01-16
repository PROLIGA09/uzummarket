let autoRefreshInterval;

// DOM elementlari
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const messageEl = document.getElementById('message');
const totalCount = document.getElementById('total-count');
const lastUpdate = document.getElementById('last-update');

// Rasmlarni yuklash
async function loadImages() {
    showLoading();
    
    try {
        const response = await fetch('/api/images');
        const images = await response.json();
        
        gallery.innerHTML = '';
        
        if (images.length === 0) {
            gallery.innerHTML = `
                <div class="message">
                    <i class="fas fa-image" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <h3>Hozircha rasmlar yo'q</h3>
                    <p>Admin yangi rasm yuklangach, bu yerda ko'rinadi</p>
                </div>
            `;
        } else {
            images.forEach(img => {
                const imageUrl = `/uploads/${img.filename}`;
                const date = new Date(img.date).toLocaleDateString('uz-UZ');
                
                const card = document.createElement('div');
                card.className = 'image-card';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${img.caption}" loading="lazy">
                    <div class="image-info">
                        <h3 class="image-title">${img.caption}</h3>
                        <div class="image-meta">
                            <span><i class="far fa-calendar"></i> ${date}</span>
                            <span><i class="fas fa-hdd"></i> ${Math.round(img.size/1024)} KB</span>
                        </div>
                    </div>
                `;
                gallery.appendChild(card);
            });
        }
        
        // Statistikani yangilash
        totalCount.textContent = images.length;
        lastUpdate.textContent = new Date().toLocaleTimeString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        showMessage(`✅ ${images.length} ta rasm yuklandi`, 'success');
        
    } catch (error) {
        console.error('Xato:', error);
        showMessage('❌ Rasmlar yuklanmadi. Serverga ulanishni tekshiring.', 'error');
    } finally {
        hideLoading();
    }
}

// Xabar ko'rsatish
function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// Yuklash animatsiyasi
function showLoading() {
    loading.classList.remove('hidden');
    gallery.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
    gallery.classList.remove('hidden');
}

// Avtomatik yangilash (har 30 soniyada)
function startAutoRefresh() {
    autoRefreshInterval = setInterval(loadImages, 30000); // 30 soniya
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', () => {
    loadImages();
    startAutoRefresh();
    
    // Yangilash tugmasi
    document.querySelector('.refresh-btn').addEventListener('click', loadImages);
});