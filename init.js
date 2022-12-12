require('dotenv').config();

// SQLite読み込み
const sqlite = require('sqlite3');
// インスタンス作成
const database = new sqlite.Database("./database/" + process.env.DATABASE);

// テーブル存在確認
database.get("SELECT * FROM sqlite_master WHERE TYPE = 'table' AND name = 'product'", (error, row) => {
    // テーブルがあった場合、処理を行わない
    if (row !== undefined) {
        return;
    }
    // 同期処理のためのserialize
    database.serialize(() => {
        database
            // CREATE TABLE `product`
            .run(`
                CREATE TABLE product (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL
                );
            `)
            // INSERT DATA `product`
            .run(`
                INSERT INTO product
                VALUES (null, 'name', 1000),(null, 'name2', 2000),(null, 'name3', 3000),(null, 'name4', 4000)
            `)
            .run(`
                CREATE TABLE buy (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL
                )
            `);
    });
    // データベースクローズ
    database.close();
});
