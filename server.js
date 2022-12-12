// モジュール読み込み
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const formdataParser = require('express-form-data');
const ejs = require('ejs');
const { DB } = require('./modules/database');
const middleware = require('./modules/middleware');

// urlencodeデータをパース（HTMLForm等）
app.use(bodyParser.urlencoded({ extended: true }));
// JSONデータをパース
app.use(bodyParser.json());
// FormDataをパース
app.use(formdataParser.parse());
// Cookieをパース
app.use(cookieParser());

// expressでのフォルダ設定（CSS・JS等を読み込む）
app.use(express.static(process.env.PUBLIC_FOLDER));

// EJS を利用
app.engine("ejs", ejs.renderFile);

// 独自ミドルウェア
app.use(middleware.csrfToken());

// サーバー起動
app.listen(process.env.SERVER_PORT, () => console.log("server start"));

// TOP
app.get("/", (req, res) => {
    DB.table("product").select().then((data) => {
        res.render('index.ejs', {
            title: "Hello World",
            products: data,
        });
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    })
});

// 購入
app.post('/buy/store', (req, res) => {
    const insert = {
        product_id: req.body.product_id,
        quantity: req.body.quantity,
    };
    DB.table("buy").insert(insert).then(() => {
        res.redirect("/buy/complete");
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

// 購入履歴削除
app.delete('/buy/delete', async (req, res) => {
    try {
        // 削除処理
        await DB.table("buy").where(`id = ${req.body.id}`).delete();
        // 削除後の累計金額取得
        const price = await DB.table("buy").join("product", "id", "product_id").select("SUM(price * quantity) as total");

        return res.json(price[0].total);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

// 購入完了
app.get('/buy/complete', (req, res) => {
    res.render("buy.ejs", {
        title: "購入完了",
    });
});

// マイページ
app.get('/mypage', (req, res) => {
    DB.table('buy').join("product", "id", "product_Id").select().then(data => {
        let totalPrice = 0;
        data.forEach(e => totalPrice += e.price * e.quantity);
        res.render("mypage.ejs", {
            title: "マイページ",
            history: data,
            totalPrice: totalPrice,
        });
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
});