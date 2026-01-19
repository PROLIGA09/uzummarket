// api/get-messages.js
const fs = require('fs');
const path = require('path');

module.exports = async(req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const messagesPath = path.join(process.cwd(), 'messages.json');

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

            console.log(`📊 ${messages.length} ta xabar yuborilmoqda`);

            return res.status(200).json({
                success: true,
                messages: messages,
                count: messages.length,
                timestamp: new Date().toISOString()
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
        error: 'Faqat GET metodiga ruxsat berilgan'
    });
};