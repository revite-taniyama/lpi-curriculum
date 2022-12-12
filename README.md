## --------------------------------------------------------------------
# initialize process start
## --------------------------------------------------------------------

# 1. node_moduleのインストール
npm install

# 2. .envファイルを作成し環境に合わせて編集
#    .env.sampleを参考

# 3. .envのDATABASEに合わせてdatabaseフォルダに空のファイルを作成
#    拡張子は .db, .sqlite, .sqlite3 のいずれか

# 4. データベース初期化
node init.js

# initialize process end
## ---------------------------------------------------------------------

# サーバー起動
node server.js

# 構造
database                sqlite3のデータベースファイルフォルダ
  |
modules                 nodejsのモジュールフォルダ
  |
public                  EJS公開フォルダ（CSS、JS、画像等）
  |-- css               CSS
  |-- js                JS
views                   EJSビューフォルダ
  `-- elements          共通ビューフォルダ
