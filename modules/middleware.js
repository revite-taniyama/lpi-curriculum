require('dotenv').config();
const cookieName = process.env.COOKIE_NAME;
const uuid = require('uuid').v4;

function cookieUpdate(res, value, dayExpire = 7) {
    const expires = new Date(Date.now() + (1000 * 60 * 60 * 24 * dayExpire));
    res.cookie(cookieName, value, { expires });
}

// CSRF対策 TOKEN確認
function csrfToken() {
    return (req, res, next) => {
        // クッキー取得
        const cookie = req.cookies[cookieName] || {};

        // TOKENチェック
        if (cookie.token === undefined) {
            // POST送信の場合、CSRFエラー
            if (req.method == 'POST') {
                throw new Error("csrf");
            }
            // TOKEN生成
            cookie.token = uuid();
        }

        // 送信されたTOKENと一致するかチェック
        if (req.method == "POST") {
            // 不一致の場合エラー
            if (cookie.token != req.body._token) {
                throw new Error("csrf");
            }
        }
        // クッキー更新
        cookieUpdate(res, cookie);
        // EJSにTOKENを渡す
        res.locals._token = cookie.token;

        next();
    }
};
module.exports = {
    csrfToken
};