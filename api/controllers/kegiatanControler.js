// ============================================================
// CONTROLLER KEGIATAN
// ============================================================

const Kegiatan = require('../models/Kegiatan');

async function getAllKegiatan(req, res) {
    try {
        const data = await Kegiatan.getAll();
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

async function getKegiatanById(req, res) {
    try {
        const { id } = req.params;
        const data = await Kegiatan.getById(id);
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Kegiatan tidak ditemukan'
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

async function createKegiatan(req, res) {
    try {
        const { nama, deskripsi, lokasi, tanggalMulai, tanggalSelesai, status } = req.body;
        
        if (!nama || !tanggalMulai) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan tanggal mulai wajib diisi'
            });
        }
        
        const dataBaru = await Kegiatan.create({
            nama,
            deskripsi: deskripsi || '',
            lokasi: lokasi || '-',
            tanggalMulai,
            tanggalSelesai: tanggalSelesai || null,
            status: status || 'Rencana'
        });
        
        res.status(201).json({
            success: true,
            message: 'Kegiatan berhasil ditambahkan',
            data: dataBaru
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateKegiatan(req, res) {
    try {
        const { id } = req.params;
        const { nama, deskripsi, lokasi, tanggalMulai, tanggalSelesai, status } = req.body;
        
        const existing = await Kegiatan.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Kegiatan tidak ditemukan'
            });
        }
        
        const updated = await Kegiatan.update(id, {
            nama: nama || existing.nama,
            deskripsi: deskripsi || existing.deskripsi,
            lokasi: lokasi || existing.lokasi,
            tanggalMulai: tanggalMulai || existing.tanggalMulai,
            tanggalSelesai: tanggalSelesai || existing.tanggalSelesai,
            status: status || existing.status
        });
        
        res.status(200).json({
            success: true,
            message: 'Kegiatan berhasil diupdate',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteKegiatan(req, res) {
    try {
        const { id } = req.params;
        
        const existing = await Kegiatan.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Kegiatan tidak ditemukan'
            });
        }
        
        await Kegiatan.deleteById(id);
        
        res.status(200).json({
            success: true,
            message: 'Kegiatan berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateStatusKegiatan(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status wajib diisi'
            });
        }
        
        const existing = await Kegiatan.getById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Kegiatan tidak ditemukan'
            });
        }
        
        const updated = await Kegiatan.updateStatus(id, status);
        
        res.status(200).json({
            success: true,
            message: 'Status kegiatan berhasil diupdate',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getAllKegiatan,
    getKegiatanById,
    createKegiatan,
    updateKegiatan,
    deleteKegiatan,
    updateStatusKegiatan
};