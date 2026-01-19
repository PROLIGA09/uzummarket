// /api/get-messages.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const fs = require('fs');
            const path = require('path');

            const messagesPath = path.join(process.cwd(), 'messages.json');

            let messages = [];
            try {
                const data = fs.readFileSync(messagesPath, 'utf8');
                messages = JSON.parse(data);
            } catch (error) {
                // Fayl mavjud emas
                messages = [];
            }

            res.status(200).json({
                success: true,
                messages: messages,
                count: messages.length,
                timestamp: new Date().toISOString()
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
            error: 'Faqat GET metodiga ruxsat berilgan'
        });
    }
}