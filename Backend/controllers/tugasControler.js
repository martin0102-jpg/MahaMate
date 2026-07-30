// ============================================================
// CONTROLLER TUGAS
// ============================================================

const Tugas = require('../models/Tugas');

async function getAllTugas(req, res) {
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
}

async function getTugasById(req, res) {
    try {
        const { id } = req.params;
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
}

async function createTugas(req, res) {
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
            deskripsi: deskripsi || '',
            kategori: kategori || 'Lainnya',
            prioritas: prioritas || 'Sedang',
            deadline: deadline || null,
            status: status || 'Belum Mulai'
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
}

async function updateTugas(req, res) {
    try {
        const { id } = req.params;
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
}

async function deleteTugas(req, res) {
    try {
        const { id } = req.params;
        
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
}

async function updateStatusTugas(req, res) {
    try {
        const { id } = req.params;
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
}

module.exports = {
    getAllTugas,
    getTugasById,
    createTugas,
    updateTugas,
    deleteTugas,
    updateStatusTugas
};