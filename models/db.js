const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '08pp02pv06ppv',
    database: 'clothes_API',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


if (process.env.NODE_ENV !== 'test') {
    pool.getConnection()
        .then(() => console.log('Успішне підключення до бази даних'))
        .catch(err => console.error('Помилка підключення до бази даних:', err));
}

module.exports = {
    query: async (sql, params) => {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
    
    close: async () => {
        try {
            await pool.end();
            console.log('Підключення до бази даних закрито');
        } catch (err) {
            console.error('Помилка при закритті підключення до бази даних:', err);
        }
    },
    
        pool
};