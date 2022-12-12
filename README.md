initialize process
---

1. node_modulesのインストール<br>
```npm install```

1. .envファイルを作成し環境に合わせて編集<br>
.env.sampleを参考

1. .envのDATABASEに合わせてdatabaseフォルダに空のファイルを作成<br>
   拡張子は .db, .sqlite, .sqlite3 のいずれか

1. データベース初期化<br>
```node init.js```

サーバー起動
---
```node server.js```

構造
---
<dl>
  <dt>database</dt>
  <dd>sqlite3のデータベースファイルフォルダ</dd>
  <dt>modules</dt>
  <dd>nodejsのモジュールフォルダ</dd>
  <dt>public</dt>
  <dd>EJS公開フォルダ（CSS、JS、画像等）</dd>
  <dt>views</dt>
  <dd>EJSビューフォルダ</dd>
</dl>
