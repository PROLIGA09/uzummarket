// /api/clear-messages.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const fs = require('fs');
            const path = require('path');

            const messagesPath = path.join(process.cwd(), 'messages.json');

            // Faylni bo'sh array bilan yozish
            fs.writeFileSync(messagesPath, JSON.stringify([], null, 2));

            console.log('🗑️ Barcha xabarlar tozalandi');

            res.status(200).json({
                success: true,
                message: 'Barcha xabarlar muvaffaqiyatli tozalandi',
                count: 0
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