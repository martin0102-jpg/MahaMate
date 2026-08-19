// ============================================================
// CONTROLLER KEUANGAN
// ============================================================

const Keuangan = require('../models/Keuangan');

async function getAllKeuangan(req, res) {
    try {
        const data = await Keuangan.getAll();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getKeuanganByBulan(req, res) {
    try {
        const { bulan, tahun } = req.params;
        const data = await Keuangan.getByBulanTahun(bulan, tahun);
        const total = await Keuangan.getTotalByBulan(bulan, tahun);
        
        res.status(200).json({
            success: true,
            data: data,
            total: total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getKeuanganById(req, res) {
    try {
        const { id } = req.params;
        const data = await Keuangan.getById(id);
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function createKeuangan(req, res) {
    try {
        const { bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis } = req.body;
        
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
        
        const dataBaru = await Keuangan.create({
            bulan,
            tahun,
            tanggal,
            kategori,
            deskripsi: deskripsi || '-',
            nominal,
            jenis: jenis || 'pengeluaran'
        });
        
        res.status(201).json({
            success: true,
            message: 'Data keuangan berhasil ditambahkan',
            data: dataBaru
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateKeuangan(req, res) {
    try {
        const { id } = req.params;
        const { bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis } = req.body;
        
        const existing = await Keuangan.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        
        const updated = await Keuangan.update(id, {
            bulan: bulan || existing.bulan,
            tahun: tahun || existing.tahun,
            tanggal: tanggal || existing.tanggal,
            kategori: kategori || existing.kategori,
            deskripsi: deskripsi || existing.deskripsi,
            nominal: nominal || existing.nominal,
            jenis: jenis || existing.jenis
        });
        
        res.status(200).json({
            success: true,
            message: 'Data keuangan berhasil diupdate',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteKeuangan(req, res) {
    try {
        const { id } = req.params;
        
        const existing = await Keuangan.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        
        await Keuangan.deleteById(id);
        
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
}

module.exports = {
    getAllKeuangan,
    getKeuanganByBulan,
    getKeuanganById,
    createKeuangan,
    updateKeuangan,
    deleteKeuangan
};