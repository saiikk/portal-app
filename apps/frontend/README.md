# frontend

新卒ポータルアプリのモバイルフロントエンド。

> 現状ステータス：プロジェクト未作成（Phase4未着手）。本READMEはセットアップ予定の構成を記載。

## 対象プラットフォーム

- iOS（最初の対応対象）
- Android（将来対応）

## 技術スタック

- Expo / React Native
- TypeScript

## 採用ライブラリ（予定）

- expo-router（画面ルーティング）
- axios（APIクライアント）
- zustand（状態管理）
- @tanstack/react-query（サーバーステート管理）
- react-hook-form + zod（入力検証）
- nativewind（スタイリング）
- @react-native-async-storage/async-storage（トークン保存）
- expo-notifications（Push通知）

## アーキテクチャ

- MVVM
- Repository Pattern（API通信）
- Service Layer

## ディレクトリ構成（予定）

```text
src/
├── api
├── components
├── screens
├── hooks
├── stores
├── types
├── constants
├── utils
├── services
└── validations
```

## セットアップ（Phase4実施時）

```bash
cd apps/frontend
npx create-expo-app . -t expo-template-blank-typescript

npx expo install expo-router
npm install axios zustand @tanstack/react-query react-hook-form zod nativewind
npx expo install @react-native-async-storage/async-storage expo-notifications
```

`.env`にバックエンドAPIのベースURL（`apps/backend`参照）を設定する。

## 想定機能

### 認証

- ログイン / ログアウト
- 新規登録なし（アカウントはadminが事前にDBへ投入する運用）

### 画面

- トップページ：ユーザーグループでのチャット（メッセージ送受信）
- 新卒紹介ページ：ユーザー画像＋ネーム＋一言（500文字制限）のカード表示
- 社員紹介ページ：新卒紹介と同様＋配属先・ロール表示
- プロフィール：アイコン・ネーム・Eメール・パスワード（アイコンはadmin提供画像の表示のみ、アップロード機能なし）

### 通知

- チャットへの新規メッセージ送信時、送信者以外の参加者へPush通知（expo-notifications）

詳細な実装フェーズはルートの`implementation-roadmap`（Phase4以降）を参照。
