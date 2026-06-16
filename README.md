# portal-app

新卒ポータルアプリ（モノレポ）

既存の新卒ポータルサイトのモバイル版。iOS向けに開発し、将来的にAndroidへ対応する。

## 構成

```text
portal-app/
├── apps/
│   ├── backend/    # Laravel API + MySQL
│   └── frontend/   # Expo / React Native (TypeScript)
├── README.md
└── .gitignore
```

- `apps/backend` : Laravel API + MySQL（詳細は[apps/backend/README.md](apps/backend/README.md)）
- `apps/frontend` : Expo / React Native + TypeScript（詳細は[apps/frontend/README.md](apps/frontend/README.md)）

backend/frontendはCI・デプロイともに完全に分離して運用する（モノレポ専用ビルドツールは導入しない）。

## 主な機能

- 認証（ログイン／ログアウト、新規登録なし。アカウントはadminが事前にDBへ投入）
- トップページ（グループチャット）
- 新卒／社員紹介ページ
- プロフィール編集
- チャットへのPush通知

## セットアップ

各ディレクトリのREADMEを参照。

- バックエンド: [apps/backend/README.md](apps/backend/README.md)
- フロントエンド: [apps/frontend/README.md](apps/frontend/README.md)
