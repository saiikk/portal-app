# backend

新卒ポータルアプリのバックエンドAPI。

## 技術スタック

- Laravel（API専用）
- MySQL
- Laravel Sanctum（トークン認証）
- Docker / docker-compose（PHP-FPM + Nginx + MySQL）

## ディレクトリ構成

```text
apps/backend/
├── docker/
│   ├── php/Dockerfile
│   └── nginx/default.conf
├── src/              # Laravelプロジェクト本体
├── postman/          # APIテスト用Postmanコレクション
└── docker-compose.yml
```

## セットアップ

```bash
cd apps/backend
docker compose build
docker compose up -d

# Laravel初期設定（初回のみ）
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

`src/.env`の`DB_*`は`docker-compose.yml`のMySQL設定（`db`サービス）と合わせること。

## テストユーザー

`php artisan db:seed`（`UserSeeder`）で以下が作成される。パスワードは共通で`password`。

| email | role | type |
|---|---|---|
| employee@example.com | admin | employee |
| new-graduate@example.com | general | new_graduate |

- `role = admin`（社員）のみグループ作成が可能（`GroupPolicy`で制御）
- `role = general`（新卒）はグループ作成不可

## 主要テーブル

- `users` — UUID主キー。`type`（new_graduate/employee）、`role`（general/admin）、紹介ページ用の`icon_url`/`comment`/`department`/`position`を持つ
- `groups` / `group_user` — グループとメンバー（owner/member）
- `messages` / `message_reads` — グループチャットと既読管理

## APIエンドポイント

| メソッド | パス | 説明 | 認証 |
|---|---|---|---|
| POST | /api/login | ログイン（トークン発行） | - |
| POST | /api/logout | ログアウト（トークン破棄） | ✓ |
| GET | /api/me | ログイン中ユーザー情報 | ✓ |
| GET | /api/groups | 参加グループ一覧 | ✓ |
| POST | /api/groups | グループ作成（admin限定） | ✓ |
| GET | /api/groups/{group}/messages | グループのメッセージ一覧 | ✓（メンバー限定） |
| POST | /api/groups/{group}/messages | メッセージ送信 | ✓（メンバー限定） |
| GET | /api/users/new-graduates | 新卒紹介一覧 | ✓ |
| GET | /api/users/employees | 社員紹介一覧 | ✓ |
| GET | /api/profile | プロフィール表示 | ✓ |
| PUT | /api/profile | プロフィール更新 | ✓ |

## APIテスト

`postman/portal-app.postman_collection.json`をPostmanにインポートして実行。`Login`実行時にトークンが、`Create Group`実行時に`group_id`が自動でコレクション変数にセットされる。

## 未実装（今後対応）

- グループへのメンバー追加API
- メッセージ既読登録・未読数取得API
- Push通知（Expo Push Token登録・送信）
- メッセージ削除API
