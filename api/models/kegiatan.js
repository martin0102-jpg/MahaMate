// ============================================================
// MODEL KEGIATAN
// ============================================================

const { db } = require('../config/database');

async function getAll() {
    const [rows] = await db.query('SELECT * FROM kegiatan ORDER BY created_at DESC');
    return rows;
}

async function getById(id) {
    const [rows] = await db.query('SELECT * FROM kegiatan WHERE id = ?', [id]);
    return rows[0];
}

async function create(data) {
    const { nama, deskripsi, lokasi, tanggalMulai, tanggalSelesai, status } = data;
    
    const [result] = await db.query(`
        INSERT INTO kegiatan (nama, deskripsi, lokasi, tanggal_mulai, tanggal_selesai, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [nama, deskripsi || '', lokasi || '-', tanggalMulai, tanggalSelesai || null, status || 'Rencana']);
    
    return {
        id: result.insertId,
        nama,
        deskripsi: deskripsi || '',
        lokasi: lokasi || '-',
        tanggalMulai,
        tanggalSelesai: tanggalSelesai || null,
        status: status || 'Rencana'
    };
}

async function update(id, data) {
    const { nama, deskripsi, lokasi, tanggalMulai, tanggalSelesai, status } = data;
    
    await db.query(`
        UPDATE kegiatan 
        SET nama = ?, deskripsi = ?, lokasi = ?, tanggal_mulai = ?, tanggal_selesai = ?, status = ?
        WHERE id = ?
    `, [nama, deskripsi, lokasi, tanggalMulai, tanggalSelesai, status, id]);
    
    return { id, nama, deskripsi, lokasi, tanggalMulai, tanggalSelesai, status };
}

async function deleteById(id) {
    await db.query('DELETE FROM kegiatan WHERE id = ?', [id]);
    return { message: 'Kegiatan berhasil dihapus' };
}

async function updateStatus(id, status) {
    await db.query('UPDATE kegiatan SET status = ? WHERE id = ?', [status, id]);
    return { id, status };
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    updateStatus
};