// ============================================================
// SERVER UTAMA - MAHAMATE BACKEND
// ============================================================

const express = require('express');
const cors = require('cors');
const { testConnection, db } = require('./config/database');

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

// ============================================================
// ENDPOINT KEUANGAN (DENGAN FILTER MODE)
// ============================================================

// GET /api/keuangan - Ambil semua data keuangan (tanpa filter)
app.get('/api/keuangan', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM keuangan ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/keuangan/:bulan/:tahun - Ambil data by bulan & tahun (dengan filter mode)
app.get('/api/keuangan/:bulan/:tahun', async (req, res) => {
    try {
        const { bulan, tahun } = req.params;
        const { mode } = req.query;  // Ambil mode dari query string
        
        console.log(`📥 GET /api/keuangan/${bulan}/${tahun}?mode=${mode || 'semua'}`);
        
        let query = 'SELECT * FROM keuangan WHERE bulan = ? AND tahun = ?';
        const params = [bulan, tahun];
        
        // Jika mode ada, tambahkan filter
        if (mode) {
            query += ' AND mode = ?';
            params.push(mode);
        }
        
        query += ' ORDER BY tanggal DESC';
        
        console.log('📝 Query:', query);
        console.log('📝 Params:', params);
        
        const [rows] = await db.query(query, params);
        const total = rows.reduce((sum, row) => sum + parseFloat(row.nominal), 0);
        
        console.log(`✅ Ditemukan ${rows.length} data untuk mode: ${mode || 'semua'}`);
        
        res.status(200).json({
            success: true,
            data: rows,
            total: total
        });
    } catch (error) {
        console.error('❌ Error GET keuangan:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/keuangan/id/:id - Ambil 1 data by ID
app.get('/api/keuangan/id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM keuangan WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/keuangan - Tambah data keuangan (dengan mode)
app.post('/api/keuangan', async (req, res) => {
    try {
        const { bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis, mode } = req.body;
        
        console.log('📥 POST /api/keuangan:', { bulan, tahun, tanggal, kategori, nominal, mode });
        
        // Validasi
        if (!bulan || !tahun || !tanggal || !kategori || !nominal) {
            return res.status(400).json({
                success: false,
                message: 'Bulan, tahun, tanggal, kategori, dan nominal wajib diisi'
            });
        }
        
        if (nominal <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Nominal harus lebih dari 0'
            });
        }
        
        const [result] = await db.query(`
            INSERT INTO keuangan (bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis, mode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [bulan, tahun, tanggal, kategori, deskripsi || '-', nominal, jenis || 'pengeluaran', mode || 'mode1']);
        
        const newData = {
            id: result.insertId,
            bulan,
            tahun,
            tanggal,
            kategori,
            deskripsi: deskripsi || '-',
            nominal,
            jenis: jenis || 'pengeluaran',
            mode: mode || 'mode1'
        };
        
        console.log('✅ Data berhasil disimpan:', newData);
        
        res.status(201).json({
            success: true,
            message: 'Data keuangan berhasil ditambahkan',
            data: newData
        });
    } catch (error) {
        console.error('❌ Error POST keuangan:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// PUT /api/keuangan/:id - Update data keuangan
app.put('/api/keuangan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis, mode } = req.body;
        
        // Cek apakah data ada
        const [existing] = await db.query('SELECT * FROM keuangan WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        
        await db.query(`
            UPDATE keuangan 
            SET bulan = ?, tahun = ?, tanggal = ?, kategori = ?, deskripsi = ?, nominal = ?, jenis = ?, mode = ?
            WHERE id = ?
        `, [bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis, mode, id]);
        
        res.status(200).json({
            success: true,
            message: 'Data keuangan berhasil diupdate'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE /api/keuangan/:id - Hapus data keuangan
app.delete('/api/keuangan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cek apakah data ada
        const [existing] = await db.query('SELECT * FROM keuangan WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        
        await db.query('DELETE FROM keuangan WHERE id = ?', [id]);
        
        res.status(200).json({
            success: true,
            message: 'Data keuangan berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================================
// ROUTES (Menggunakan router terpisah)
// ============================================================

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
        console.log(`📋 GET  /api/keuangan/:bulan/:tahun - Ambil by bulan/tahun (filter mode)`);
        console.log(`📋 GET  /api/keuangan/id/:id - Ambil 1 data by ID`);
        console.log(`📋 POST /api/keuangan     - Tambah keuangan (dengan mode)`);
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