// ============================================================
// SERVER UTAMA - MAHAMATE BACKEND
// ============================================================

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// ===== IMPORT ROUTES =====
const tugasRoutes = require('./routes/routestugas.js');
const keuanganRoutes = require('./routes/routesKeuangan.js');
const kegiatanRoutes = require('./routes/routesKegiatan.js');

const app = express();
const PORT = 3000;

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
async function startServer() {
    console.log('🔌 Mengecek koneksi database...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.log('⚠️ Server berjalan TANPA database!');
        console.log('💡 Pastikan XAMPP MySQL menyala');
    }
    
    app.listen(PORT, () => {
        console.log('========================================');
        console.log(`🚀 Server jalan di http://localhost:${PORT}`);
        console.log('========================================');
        console.log(`📋 GET  /api/tugas        - Ambil semua tugas`);
        console.log(`📋 GET  /api/tugas/:id    - Ambil 1 tugas`);
        console.log(`📋 POST /api/tugas        - Tambah tugas`);
        console.log(`📋 PUT  /api/tugas/:id    - Update tugas`);
        console.log(`📋 DELETE /api/tugas/:id  - Hapus tugas`);
        console.log(`📋 PATCH /api/tugas/:id/status - Update status tugas`);
        console.log('---');
        console.log(`📋 GET  /api/keuangan     - Ambil semua keuangan`);
        console.log(`📋 GET  /api/keuangan/:bulan/:tahun - Ambil by bulan/tahun`);
        console.log(`📋 POST /api/keuangan     - Tambah keuangan`);
        console.log(`📋 PUT  /api/keuangan/:id - Update keuangan`);
        console.log(`📋 DELETE /api/keuangan/:id - Hapus keuangan`);
        console.log('---');
        console.log(`📋 GET  /api/kegiatan     - Ambil semua kegiatan`);
        console.log(`📋 GET  /api/kegiatan/:id - Ambil 1 kegiatan`);
        console.log(`📋 POST /api/kegiatan     - Tambah kegiatan`);
        console.log(`📋 PUT  /api/kegiatan/:id - Update kegiatan`);
        console.log(`📋 DELETE /api/kegiatan/:id - Hapus kegiatan`);
        console.log(`📋 PATCH /api/kegiatan/:id/status - Update status kegiatan`);
        console.log('========================================');
    });
}

startServer();