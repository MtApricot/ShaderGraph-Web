# ShaderGraph-Web

ShaderGraph-Webは、ReactとViteを使って構築されたWebベースのノードエディターアプリケーションです。スタイリングには Tailwind CSS を、バックエンドサービスにはFirebaseを使用しています。

## プロジェクト構造

```text
.
├── .env
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── api/
    │   ├── firebase-sample.js
    │   └── firebase.js
    ├── components/
    │   ├── Canvas.jsx
    │   ├── Inspector.jsx
    │   ├── Node.jsx
    │   ├── ShareModal.jsx
    │   └── Toolbar.jsx
    └── hooks/
        └── useGraph.js
```

## セットアップ

### 前提条件

- Node.js 18 以上（推奨: LTS）
- npm が利用可能であること

### 1. 依存関係をインストール

```bash
npm install
```

### 2. 環境変数を設定

Firebase 接続のため、プロジェクトルートの `.env` に以下を設定してください。

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

補足:
- 参照先は `src/api/firebase.js` です。
- `src/api/firebase-sample.js` はサンプルであり、本番値を直書きしないでください。

## 実行

### 開発サーバー

```bash
npm run dev
```

表示されたローカル URL をブラウザで開いてください。

### 本番ビルド

```bash
npm run build
```

### 本番ビルドの確認

```bash
npm run preview
```

## 運用ルール（厳守）

- `.env` や API キーをコミットしないこと。
- `npm run build` が成功しない変更はマージしないこと。
- UI 調整時は、`src/index.css` と `tailwind.config.js` の両方を確認すること。

## トラブルシュート

- 画面が崩れる/スタイルが効かない:
    - `tailwind.config.js` の `content` に `./src/**/*.{js,jsx,ts,tsx}` が入っているか確認
    - `src/index.css` に `@tailwind base; @tailwind components; @tailwind utilities;` があるか確認
- `npm run dev` が失敗する:
    - 依存を再インストール: `rm -rf node_modules package-lock.json && npm install`
    - ポート競合時は空いているポートで再起動

---
