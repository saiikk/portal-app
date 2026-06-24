# portal-app

新卒ポータルアプリ（モノレポ）

既存の新卒ポータルサイトのモバイル版。iOS・Web ブラウザで動作する。

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

backend/frontend は CI・デプロイともに完全に分離して運用する（モノレポ専用ビルドツールは導入しない）。

## 主な機能

- 認証（ログイン／ログアウト。アカウントは admin が事前に DB へ投入）
- トップページ（グループチャット）
- 新卒／社員紹介ページ
- プロフィール編集（アバター画像アップロード含む）
- グループ管理（作成・メンバー追加・ロール変更）
- サイドバーナビゲーション

## ブランチ構成

| ブランチ | 説明 |
|---|---|
| `main` | リリースブランチ |
| `develop` | 開発メインブランチ（Supabase 移行後） |
| `legacy/laravel-api-version` | Laravel API + MySQL 構成のバックアップ（iOS・Web 対応済み） |

## アーキテクチャの変遷

```
【現行 legacy/laravel-api-version】
React Native / Web → Laravel API (ローカル) → MySQL

【移行後 develop】
React Native / Web → Supabase（Auth + DB + Realtime + Storage）
```

移行の背景・詳細は [migration-plan.md](../obsidian/docs/projects/react-portal-app/migration-plan.md) を参照。

## クイックスタート

### Web ブラウザ（Xcode 不要）

```bash
# 1. バックエンド起動
cd apps/backend && docker compose up -d

# 2. API URL を Mac の IP に設定
#    apps/frontend/src/constants/api.ts の API_BASE_URL を更新
ipconfig getifaddr en0   # IP 確認

# 3. フロントエンド起動
cd apps/frontend && npm install && npx expo start --web
# → http://localhost:8081 をブラウザで開く
```

### iOS 実機（Xcode 必要）

詳細は [apps/frontend/README.md](apps/frontend/README.md) を参照。

## セットアップ

各ディレクトリの README を参照。

- バックエンド: [apps/backend/README.md](apps/backend/README.md)
- フロントエンド: [apps/frontend/README.md](apps/frontend/README.md)
