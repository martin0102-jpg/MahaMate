// ============================================================
// SERVER UTAMA - MAHAMATE BACKEND
// ============================================================

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// ===== IMPORT ROUTES =====
const tugasRoutes = require('./routes/tugas');
const keuanganRoutes = require('./routes/keuangan');
const kegiatanRoutes = require('./routes/kegiatan');

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
app.get('/', (req, res) => {
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
// Untuk Vercel: export app
// Untuk Local: jalankan server
if (process.env.VERCEL) {
    module.exports = app;
} else {
    app.listen(PORT, async () => {
        console.log('🔌 Mengecek koneksi database...');
        await testConnection();
        console.log(`🚀 Server jalan di http://localhost:${PORT}`);
    });
}