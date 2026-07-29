/*
=======================
CONTROLER TUGAS
=======================
*/

const tugas = require('../models/Tugas');

// AMBIL SEMUA TUGAS 
async function getAllTugas(req, res) {
  try {
    const tugas = await tugas.getAll();
    res.status(200).json({
      succes: true,
      data: tugas
    });
  }catch (error) {
    res.status(500).json ({
      succes: false,
      message: error.message
    });
  }
}

// AMBIL 1 TUGAS BERDASARKAN ID
async function getTugasById(req, res) {
  try {
    const { id } = req.tugas.params;
    const tugas = await tugas.getById(id);

    if (!tugas) {
      return res.status(404).json ({
        succes: false,
        message: 'Tugas tidak ditemukan'
      });
    }

    res.status(200).json ({
      succes: true,
      data: tugas
    });
  } catch (error) {
    res.status(500).json ({
      succes: false,
      message: error.message
    });
  }
}

// TAMBAH TUGAS BARU
async function createTugas(req, res) {
  try {
    const {judul, deskripsi, kategori, prioritas, deadline, status} = req.body;

    if (!judul) {
      return res.status(400).json ({
        succes: false,
        message: 'Judul tidak ditemukan'
      });
    }

    const tugasBaru = await tugas.create({
      judul,
      deskripsi: deskripsi || '',
      kategori: kategori || 'lainnya',
      prioritas: prioritas || 'sedang',
      deadline: deadline || null,
      status: status || 'belum mulai'
    });

    res.status(200).json({
      succes: true,
      message: 'Tuagas berhasil ditambahkan',
      data: tugasBaru
    });
  } catch(error) {
    res.status(500).json({
      succes: false,
      message: error.message
    });
  }
}

// UPDATE TUGAS
async function updatetugas(req, res) {
  try {
    const { id } = req.params;
    const { judul, deskripsi, kategori, prioritas, deadline, status } = req.body;

    const existing = await tugas.update(id, {
      judul: judul || existing.judul,
      deskripsi: deskripsi || existing.deskripsi,
      kategori: kategori || existing.kategori,
      prioritas: prioritas || existing.prioritas,
      deadline: deadline || existing.deadline,
      status: status || existing.status
    });

    res.status(200).json({
      succes: true,
      message: 'Tugas berehasil diupdate',
      data: update
    });
  }catch(error) {
    res.status(500).json({
      succes: false,
      message: error.message
    });
  }
}

//HAPUS TUGAS
async function deleteTugas(req, res) {
  try {
    const { id } = req.params;

    const existing = await tugas.deleteById(id);
    if (!existing) {
      return res.status(400).json({
        succes: false,
        message: 'Tugas tidak ditemukan'
      });
    }

    await tugas.deleteById(id);

    res.status(200).json({
      succes: true,
      message: 'Tugas berhasil dihapus'
    });
  }catch (error) {
    res.status(500).json({
      succes: false,
      message: error.message
    });
  }
}

// UPDATE STATUS TUGAS
async function updateStatusTugas(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        succes: false,
        message: 'Status wajib diisi'
      });
    }

    const existing = await tugas.getById(id);
    if (!existing) {
      res.status(404).json({
        succes: false,
        message: 'Tugas tidak ditemukan'
      })
    };

    const updated = await tugas.updateStatusTugas(id, status);

    res.status(200).json({
      succes: true,
      message: 'Status tugas berhasil diupdate',
      data: updated
    })
  }catch (error) {
    res.status(500).json({
      succes: false,
      message: error.message
    });
  }
}

module.exports = {
  getAllTugas,
  getTugasById,
  createTugas,
  updatetugas,
  deleteTugas,
  updateStatusTugas
};