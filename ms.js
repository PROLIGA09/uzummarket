// api/save-message.js
const fs = require('fs');
const path = require('path');

module.exports = async(req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { user_id, user_name, content, chat_id, timestamp } = req.body;

            console.log('📨 Yangi xabar:', { user_name, type: content ? .type });

            // Fayl yo'lini aniqlash
            const messagesPath = path.join(process.cwd(), 'messages.json');

            // Faylni o'qish yoki yaratish
            let messages = [];
            try {
                if (fs.existsSync(messagesPath)) {
                    const data = fs.readFileSync(messagesPath, 'utf8');
                    messages = JSON.parse(data);
                }
            } catch (error) {
                console.log('❌ Faylni o\'qishda xatolik:', error);
                messages = [];
            }

            // Yangi xabarni qo'shish
            const newMessage = {
                id: Date.now().toString(),
                type: content ? .type || 'text',
                user_id: user_id || 'unknown',
                user_name: user_name || 'Foydalanuvchi',
                content: content || {},
                chat_id: chat_id || 'unknown',
                timestamp: timestamp || new Date().toISOString(),
                date: new Date().toLocaleString('uz-UZ')
            };

            // Yangi xabarni boshiga qo'shish
            messages.unshift(newMessage);

            // Faqat oxirgi 50 ta xabarni saqlash
            if (messages.length > 50) {
                messages = messages.slice(0, 50);
            }

            // Faylga yozish
            fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

            console.log(`✅ Xabar saqlandi. Jami: ${messages.length} ta`);

            return res.status(200).json({
                success: true,
                message: 'Xabar saqlandi',
                data: newMessage,
                total: messages.length
            });

        } catch (error) {
            console.error('❌ Xatolik:', error);
            return res.status(500).json({
                success: false,
                error: 'Server xatosi: ' + error.message
            });
        }
    }

    return res.status(405).json({
        success: false,
        error: 'Faqat POST metodiga ruxsat berilgan'
    });
};