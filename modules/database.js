const sqlite = require('sqlite3');

class Database {
    #table = null;
    #where = null;
    #join = null;

    constructor() {
        this.db = new sqlite.Database("./database/" + process.env.DATABASE)
    }

    table(table) {
        this.#table = table;
        return this;
    }
    where(where) {
        this.#where = where;
        return this;
    }
    join(joinTable, joinKey, ownKey, type = 'INNER') {
        if (this.#table === null) {
            throw "table empty";
        }
        this.#join = `${type} JOIN ${joinTable} ON ${joinTable}.${joinKey} = ${this.#table}.${ownKey}`;
        return this;
    }

    async select(column = '*') {
        if (this.#table === null) {
            throw "table empty";
        }
        const whereStr = (this.#where === null) ? '' : `WHERE ${this.#where}`;
        const joinStr = (this.#join === null) ? '' : this.#join;
        const orderBy = `ORDER BY ${this.#table}.id asc`;
        if (column == '*' && joinStr != '') {
            column = `*, ${this.#table}.id as id`;
        }
        const sql = `SELECT ${column} FROM ${this.#table} ${joinStr} ${whereStr} ${orderBy}`;
        const data = await promise((resolve, reject) => {
            this.db.all(sql, (error, rows) => {
                if (error) { reject(new Error(error)) }
                resolve(rows);
            })
        });
        this.db.close();

        return data;
    }

    /**
     * @param {Array} data
     */
    async insert(data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }
        let values = [];
        let bind = [];
        for (let v of data) {
            values.push(`(${Object.keys(v).map(x => '?').join(',')})`);
            Object.values(v).forEach(v => bind.push(v));
        }
        let sql = `INSERT INTO ${this.#table} (${Object.keys(data[0])}) VALUES ${values}`;
        await promise((resolve, reject) => this.db.run(sql, bind, (error) => {
            if (error) { reject(new Error(error)) };
            resolve();
        }));
        this.db.close();
    }

    async delete() {
        const whereStr = (this.#where === null) ? '' : `WHERE ${this.#where}`;
        let sql = `DELETE FROM ${this.#table} ${whereStr}`;
        await promise((resolve, reject) => this.db.run(sql, (error) => {
            if (error) { reject(new Error(error)) };
            resolve();
        }));
        this.db.close();
    }
}
function promise(callback) {
    return Promise.resolve().then(() => {
        return new Promise((resolve, reject) => callback(resolve, reject));
    })
}

// データベースアクセス用クラス
const DB = class {
    /** @type {Database}  */
    static #instance = null;

    static table(table) {
        DB.#instance = new Database();
        return DB.#instance.table(table);
    }
}
module.exports.DB = DB;