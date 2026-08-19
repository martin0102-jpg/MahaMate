// ============================================================
// ROUTES KEUANGAN
// ============================================================

const express = require('express');
const router = express.Router();  // ← PAKAI R BESAR!
const keuanganController = require('../controllers/keuanganControler');

// GET - Ambil semua data keuangan
router.get('/', keuanganController.getAllKeuangan);

// GET - Ambil data by bulan & tahun
router.get('/:bulan/:tahun', keuanganController.getKeuanganByBulan);

// GET - Ambil 1 data by ID
router.get('/id/:id', keuanganController.getKeuanganById);

// POST - Tambah data keuangan
router.post('/', keuanganController.createKeuangan);

// PUT - Update data keuangan
router.put('/:id', keuanganController.updateKeuangan);

// DELETE - Hapus data keuangan
router.delete('/:id', keuanganController.deleteKeuangan);

module.exports = router;