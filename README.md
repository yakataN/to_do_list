
# ToDoリストアプリ

このプロジェクトはReact（フロントエンド）とNode.js/Express（バックエンド）を使った学習用ToDoリストアプリです。

## セットアップ方法

### フロントエンド
```
npm install
npm start
```

### バックエンド
```
cd server
npm install
npm start
```

## 環境変数
- プロジェクトルートの `.env` に `REACT_APP_API_URL` を設定してください。
	- 例: `REACT_APP_API_URL=http://localhost:4000/api/tasks`
	- 本番用: `REACT_APP_API_URL=https://xxxx.onrender.com/api/tasks`

## 主な機能
- ユーザー認証（JWT）
- ユーザーごとのタスク管理
- タスクの追加・削除・完了状態切り替え
- 永続化（tasks.json, users.json）

## テスト
- フロント: `npm test`
- バックエンド: `cd server && npm test -- --coverage`

## デプロイ
- フロント: Vercel推奨（GitHub連携で自動デプロイ）
- バックエンド: Render推奨（Web Serviceとしてデプロイ）

---

学習用のサンプルです。

[デモサイト](https://to-do-list-sage-sigma.vercel.app/)