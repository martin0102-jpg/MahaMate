// ============================================================
// SERVER UTAMA - MAHAMATE BACKEND
// ============================================================
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// ===== IMPORT ROUTES =====
const tugasRoutes = require('./routes/routestugas');
const keuanganRoutes = require('./routes/routesKeuangan');
const kegiatanRoutes = require('./routes/routesKegiatan');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== LOGGING =====
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.url}`);
    next();
});

// ===== ROOT ENDPOINT =====
app.get(['/', '/api'], (req, res) => {
    res.json({
        name: 'MahaMate API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            tugas: '/api/tugas',
            keuangan: '/api/keuangan',
            kegiatan: '/api/kegiatan'
        }
    });
});

// ===== ROUTES =====
app.use('/api/tugas', tugasRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/kegiatan', kegiatanRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: err.message
    });
});

// ===== START SERVER =====
// Vercel: app diekspor sebagai serverless handler
// Lokal : jalankan `node api/index.js`
if (require.main === module) {
    app.listen(PORT, async () => {
        console.log('🔌 Mengecek koneksi database...');
        await testConnection();
        console.log(`🚀 Server jalan di http://localhost:${PORT}`);
    });
}

module.exports = app;
