// ============================================================
// SERVER UTAMA - MAHAMATE BACKEND
// ============================================================

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const Tugas = require('./models/Tugas');

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
            tugas: '/api/tugas'
        }
    });
});

// ============================================================
// ROUTES TUGAS (CRUD)
// ============================================================

// GET /api/tugas - Ambil semua tugas
app.get('/api/tugas', async (req, res) => {
    try {
        const tugas = await Tugas.getAll();
        res.status(200).json({
            success: true,
            data: tugas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/tugas/:id - Ambil 1 tugas
app.get('/api/tugas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tugas = await Tugas.getById(id);
        
        if (!tugas) {
            return res.status(404).json({
                success: false,
                message: 'Tugas tidak ditemukan'
            });
        }
        
        res.status(200).json({
            success: true,
            data: tugas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/tugas - Tambah tugas baru
app.post('/api/tugas', async (req, res) => {
    try {
        const { judul, deskripsi, kategori, prioritas, deadline, status } = req.body;
        
        if (!judul) {
            return res.status(400).json({
                success: false,
                message: 'Judul tugas wajib diisi'
            });
        }
        
        const tugasBaru = await Tugas.create({
            judul,
            deskripsi,
            kategori,
            prioritas,
            deadline,
            status
        });
        
        res.status(201).json({
            success: true,
            message: 'Tugas berhasil ditambahkan',
            data: tugasBaru
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// PUT /api/tugas/:id - Update tugas
app.put('/api/tugas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { judul, deskripsi, kategori, prioritas, deadline, status } = req.body;
        
        const existing = await Tugas.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Tugas tidak ditemukan'
            });
        }
        
        const updated = await Tugas.update(id, {
            judul: judul || existing.judul,
            deskripsi: deskripsi || existing.deskripsi,
            kategori: kategori || existing.kategori,
            prioritas: prioritas || existing.prioritas,
            deadline: deadline || existing.deadline,
            status: status || existing.status
        });
        
        res.status(200).json({
            success: true,
            message: 'Tugas berhasil diupdate',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE /api/tugas/:id - Hapus tugas
app.delete('/api/tugas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const existing = await Tugas.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Tugas tidak ditemukan'
            });
        }
        
        await Tugas.deleteById(id);
        
        res.status(200).json({
            success: true,
            message: 'Tugas berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// PATCH /api/tugas/:id/status - Update status
app.patch('/api/tugas/:id/status', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status wajib diisi'
            });
        }
        
        const existing = await Tugas.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Tugas tidak ditemukan'
            });
        }
        
        const updated = await Tugas.updateStatus(id, status);
        
        res.status(200).json({
            success: true,
            message: 'Status tugas berhasil diupdate',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

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
        console.log(`📋 PATCH /api/tugas/:id/status - Update status`);
        console.log('========================================');
    });
}

startServer();