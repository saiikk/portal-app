# frontend

新卒ポータルアプリのフロントエンド。iOS・Web ブラウザの両方で動作する。

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

- iOS（Xcode 経由でビルド）
- Web ブラウザ（`npx expo start --web`）
- Android（未対応）

---

## 共通セットアップ（最初に必ず実施）

```bash
cd apps/frontend
npm install
```

---

## API URL の設定（環境ごとに変更が必要）

`src/constants/api.ts` を開き、Mac のローカル IP に変更する。

```bash
# Mac のローカル IP を確認
ipconfig getifaddr en0
```

```ts
// src/constants/api.ts
export const API_BASE_URL = 'http://192.168.x.x:8000/api';  // ← Mac の IP に変更
```

> **注意**：Wi-Fi が変わるたびに IP が変わるため、毎回この値を更新する必要がある。
> Web 版でも iOS 版でも同じファイルを参照している。

---

## Web ブラウザで起動（Xcode 不要）

```bash
cd apps/frontend
npx expo start --web
```

ブラウザで `http://localhost:8081` を開く。

バックエンド（Laravel）が Mac 上で起動していれば、API 通信も動作する。

---

## iOS シミュレーターで起動

```bash
cd apps/frontend
npx expo start --ios
```

Mac に Xcode がインストール済みであること。

---

## 実機インストール手順（iOS）

### 前提条件

- Mac に Xcode がインストール済み
- 無料の Apple ID があれば可（Push通知は有料アカウント必要）
- iPhone を USB ケーブルで Mac に接続し「信頼」済み

### 手順

**1. Mac のローカル IP を確認・設定**

```bash
ipconfig getifaddr en0
```

`src/constants/api.ts` の `API_BASE_URL` を上記 IP に変更する。

**2. iOS ネイティブプロジェクトを生成**

```bash
cd apps/frontend
npx expo prebuild --platform ios
```

`ios/` フォルダが生成される（`.gitignore` 対象のため環境ごとに実行が必要）。

**3. Push Notifications entitlement を削除**（無料 Apple ID の場合）

```bash
/usr/libexec/PlistBuddy -c "Delete :aps-environment" ios/frontend/frontend.entitlements
```

**4. Xcode でプロジェクトを開く**

```bash
open ios/frontend.xcworkspace
```

**5. Xcode で Signing を設定**

1. 左ペインで `frontend` プロジェクトを選択
2. `Signing & Capabilities` タブを開く
3. `Automatically manage signing` にチェック
4. `Team` に自分の Apple ID を選択

**6. 実機でビルド・起動**

Xcode 上部のデバイス選択で iPhone を選び `⌘R`（または Product → Run）。

### 注意事項

| 項目 | 内容 |
|---|---|
| 有効期限 | 無料 Apple ID でのインストールは 7 日間有効（期限後は再ビルドが必要） |
| API 接続 | Mac と iPhone が同じ Wi-Fi に繋がっている必要がある |
| バックエンド | `apps/backend/` の Docker が Mac 上で起動していること |
| `ios/` フォルダ | `.gitignore` 対象のため、環境ごとに `prebuild` が必要 |

### 再インストール時（2 回目以降）

```bash
# ios/ が古い・壊れている場合はクリーンビルド
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
│   │   ├── _layout.tsx      # タブレイアウト（TopTabBar + サイドバー）
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
│   ├── utils/               # scale（レスポンシブ）, resolveUrl（メディアURL正規化）
│   ├── validations/         # Zod スキーマ
│   └── services/            # 認証サービス
└── assets/
    └── images/
        └── default-avatar.png
```
