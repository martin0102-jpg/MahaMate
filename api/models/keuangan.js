// ============================================================
// MODEL KEUANGAN
// ============================================================

const { db } = require('../config/database');

async function getAll() {
    const [rows] = await db.query('SELECT * FROM keuangan ORDER BY created_at DESC');
    return rows;
}

async function getByBulanTahun(bulan, tahun) {
    const [rows] = await db.query(
        'SELECT * FROM keuangan WHERE bulan = ? AND tahun = ? ORDER BY tanggal DESC',
        [bulan, tahun]
    );
    return rows;
}

async function getById(id) {
    const [rows] = await db.query('SELECT * FROM keuangan WHERE id = ?', [id]);
    return rows[0];
}

async function create(data) {
    const { bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis } = data;
    
    const [result] = await db.query(`
        INSERT INTO keuangan (bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [bulan, tahun, tanggal, kategori, deskripsi || '-', nominal, jenis || 'pengeluaran']);
    
    return {
        id: result.insertId,
        bulan,
        tahun,
        tanggal,
        kategori,
        deskripsi: deskripsi || '-',
        nominal,
        jenis: jenis || 'pengeluaran'
    };
}

async function update(id, data) {
    const { bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis } = data;
    
    await db.query(`
        UPDATE keuangan 
        SET bulan = ?, tahun = ?, tanggal = ?, kategori = ?, deskripsi = ?, nominal = ?, jenis = ?
        WHERE id = ?
    `, [bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis, id]);
    
    return { id, bulan, tahun, tanggal, kategori, deskripsi, nominal, jenis };
}

async function deleteById(id) {
    await db.query('DELETE FROM keuangan WHERE id = ?', [id]);
    return { message: 'Data keuangan berhasil dihapus' };
}

async function getTotalByBulan(bulan, tahun) {
    const [rows] = await db.query(`
        SELECT SUM(nominal) as total 
        FROM keuangan 
        WHERE bulan = ? AND tahun = ? AND jenis = 'pengeluaran'
    `, [bulan, tahun]);
    return rows[0].total || 0;
}

module.exports = {
    getAll,
    getByBulanTahun,
    getById,
    create,
    update,
    deleteById,
    getTotalByBulan
};