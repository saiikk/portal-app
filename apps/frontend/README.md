# frontend

新卒ポータルアプリのモバイルフロントエンド。

## 技術スタック

| 分類 | ライブラリ |
|---|---|
| フレームワーク | Expo SDK 56 / React Native |
| 言語 | TypeScript |
| ルーティング | expo-router 56 |
| 状態管理 | Zustand |
| サーバーステート | TanStack Query v5（10秒ポーリング） |
| APIクライアント | axios |
| フォーム検証 | react-hook-form + zod |
| ストレージ | AsyncStorage |
| 画像選択 | expo-image-picker |

## 動作環境

- iOS（実装済み）
- Android（未対応）

---

## 開発環境セットアップ

```bash
cd apps/frontend
npm install
npx expo start --ios   # iOS シミュレーター起動
```

**API URL の設定**（`src/constants/api.ts`）:

```ts
// シミュレーター
export const API_BASE_URL = 'http://localhost:8000/api';

// 実機テスト時は Mac のローカル IP に変更
export const API_BASE_URL = 'http://192.168.x.x:8000/api';
```

---

## 実機インストール手順（iOS）

### 前提条件

- Mac に Xcode（または Xcode Beta）がインストール済み
- 無料の Apple ID があれば可（Push通知は有料アカウント必要）
- iPhone を USB ケーブルで Mac に接続し「信頼」済み

### 手順

**1. Mac のローカル IP を確認**

```bash
ipconfig getifaddr en0
```

**2. API URL を Mac の IP に変更**

`src/constants/api.ts`:

```ts
export const API_BASE_URL = 'http://192.168.x.x:8000/api';
```

**3. iOS ネイティブプロジェクトを生成**

```bash
cd apps/frontend
npx expo prebuild --platform ios
```

`ios/` フォルダが生成される。

**4. Push Notifications entitlement を削除**（無料 Apple ID の場合）

```bash
/usr/libexec/PlistBuddy -c "Delete :aps-environment" ios/frontend/frontend.entitlements
```

**5. Xcode でプロジェクトを開く**

```bash
open ios/frontend.xcworkspace
```

**6. Xcode で Signing を設定**

1. 左ペインで `frontend` プロジェクトを選択
2. `Signing & Capabilities` タブを開く
3. `Automatically manage signing` にチェック
4. `Team` に自分の Apple ID を選択

**7. 実機でビルド・起動**

- iPhone を選択した状態で `⌘R`（または Product → Run）

### 注意事項

| 項目 | 内容 |
|---|---|
| 有効期限 | 無料 Apple ID でのインストールは 7 日間有効（期限後は再ビルドが必要） |
| API 接続 | Mac と iPhone が同じ Wi-Fi に繋がっている必要がある |
| バックエンド | `apps/backend/` の Docker が Mac 上で起動していること |
| `ios/` フォルダ | `.gitignore` 対象のため、環境ごとに `prebuild` が必要 |

### 再インストール時（2 回目以降）

`ios/` フォルダが既にある場合はステップ 3 をスキップ可。ただしライブラリ追加後は再度 prebuild が必要。

```bash
# ios/ が古い場合はクリーンビルド
rm -rf ios/
npx expo prebuild --platform ios
/usr/libexec/PlistBuddy -c "Delete :aps-environment" ios/frontend/frontend.entitlements
# → Xcode で ⌘R
```

---

## ディレクトリ構成

```text
apps/frontend/
├── app/
│   ├── _layout.tsx          # ルートレイアウト（認証ガード）
│   ├── (auth)/
│   │   └── login.tsx        # ログイン画面
│   ├── (tabs)/
│   │   ├── _layout.tsx      # タブレイアウト（TopTabBar）
│   │   ├── index.tsx        # トップ（general: チャット / admin: グループ一覧）
│   │   ├── members.tsx      # 新卒紹介
│   │   ├── employees.tsx    # 社員紹介
│   │   └── profile.tsx      # プロフィール
│   └── chat/
│       └── [groupId].tsx    # チャット画面（admin用）
├── src/
│   ├── api/                 # axios クライアント・各エンドポイント
│   ├── components/          # 共通コンポーネント（Avatar, ChatView, TopTabBar）
│   ├── constants/           # API URL 等の定数
│   ├── stores/              # Zustand ストア（認証状態）
│   ├── types/               # 型定義
│   ├── validations/         # Zod スキーマ
│   └── services/            # 認証サービス
└── assets/
    └── images/
        └── default-avatar.png
```
