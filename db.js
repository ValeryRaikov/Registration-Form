require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }

    console.log('Connected to MySQL database');
});

const executeQuery = (query, params, callback) => {
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            throw err;
        }

        callback(results);
    });
}

process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed');
        }
        process.exit(err ? 1 : 0);
    });
});

module.exports = { executeQuery };