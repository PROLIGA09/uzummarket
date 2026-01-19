// /api/save-message.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { user_id, user_name, message, chat_id } = req.body;

            console.log('📨 Yangi xabar:', { user_id, user_name, message });

            if (!message || message.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Xabar matni bo\'sh bo\'lishi mumkin emas'
                });
            }

            // Faylga yozish (bepul Vercel uchun)
            const fs = require('fs');
            const path = require('path');

            const messagesPath = path.join(process.cwd(), 'messages.json');

            // Faylni o'qish yoki yaratish
            let messages = [];
            try {
                const data = fs.readFileSync(messagesPath, 'utf8');
                messages = JSON.parse(data);
            } catch (error) {
                // Fayl mavjud emas, yangisini yaratamiz
                messages = [];
            }

            // Yangi xabarni qo'shish
            const newMessage = {
                id: Date.now().toString(),
                user_id: user_id || 'unknown',
                user_name: user_name || 'Foydalanuvchi',
                message: message.trim(),
                chat_id: chat_id || 'unknown',
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString('uz-UZ')
            };

            messages.unshift(newMessage); // Yangisini boshiga

            // Faqat oxirgi 50 ta xabarni saqlash
            if (messages.length > 50) {
                messages = messages.slice(0, 50);
            }

            // Faylga yozish
            fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

            console.log(`✅ Xabar saqlandi. Jami: ${messages.length} ta`);

            res.status(200).json({
                success: true,
                message: 'Xabar muvaffaqiyatli saqlandi',
                data: newMessage,
                total: messages.length
            });

        } catch (error) {
            console.error('❌ Xatolik:', error);
            res.status(500).json({
                success: false,
                error: 'Server xatosi: ' + error.message
            });
        }
    } else {
        res.status(405).json({
            success: false,
            error: 'Faqat POST metodiga ruxsat berilgan'
        });
    }
}