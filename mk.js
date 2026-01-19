// api/clear-messages.js
const fs = require('fs');
const path = require('path');

module.exports = async(req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const messagesPath = path.join(process.cwd(), 'messages.json');

            // Faylni bo'sh array bilan yozish
            fs.writeFileSync(messagesPath, JSON.stringify([], null, 2));

            console.log('🗑️ Barcha xabarlar tozalandi');

            return res.status(200).json({
                success: true,
                message: 'Barcha xabarlar tozalandi',
                count: 0
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