// ============================================================
// KONEKSI DATABASE (Aiven MySQL)
// ============================================================

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('✅ Database MySQL terhubung!');
        return true;
    } catch (error) {
        console.error('❌ Gagal koneksi ke database:', error.message);
        return false;
    }
}

module.exports = { db, testConnection };