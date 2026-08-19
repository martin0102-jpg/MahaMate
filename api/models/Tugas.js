const { db } = require('../config/database');

async function getAll() {
    const [rows] = await db.query('SELECT * FROM tugas ORDER BY created_at DESC');
    return rows;
}

async function getById(id) {
    const [rows] = await db.query('SELECT * FROM tugas WHERE id = ?', [id]);
    return rows[0];
}

async function create(data) {
    const { judul, deskripsi, kategori, prioritas, deadline, status } = data;
    const [result] = await db.query(`
        INSERT INTO tugas (judul, deskripsi, kategori, prioritas, deadline, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [judul, deskripsi || '', kategori || 'Lainnya', prioritas || 'Sedang', deadline || null, status || 'Belum Mulai']);
    return {
        id: result.insertId,
        judul,
        deskripsi: deskripsi || '',
        kategori: kategori || 'Lainnya',
        prioritas: prioritas || 'Sedang',
        deadline: deadline || null,
        status: status || 'Belum Mulai'
    };
}

async function update(id, data) {
    const { judul, deskripsi, kategori, prioritas, deadline, status } = data;
    await db.query(`
        UPDATE tugas 
        SET judul = ?, deskripsi = ?, kategori = ?, prioritas = ?, deadline = ?, status = ?
        WHERE id = ?
    `, [judul, deskripsi, kategori, prioritas, deadline, status, id]);
    return { id, judul, deskripsi, kategori, prioritas, deadline, status };
}

async function deleteById(id) {
    await db.query('DELETE FROM tugas WHERE id = ?', [id]);
    return { message: 'Tugas berhasil dihapus' };
}

async function updateStatus(id, status) {
    await db.query('UPDATE tugas SET status = ? WHERE id = ?', [status, id]);
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