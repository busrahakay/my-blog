import mysql from "mysql2/promise";

//veri tabanına bağlanmak için gerekn bilgiler gösterilir ve bunlar bağlanırken kullanılır.
export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});
