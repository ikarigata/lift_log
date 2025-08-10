# Lift Log - 開発メモ

## API設定とプロキシ戦略

### 統一的なアプローチ
フロントエンドからバックエンドAPIへのアクセスは、すべて **相対パス `/api/v1`** を使用する。

### 環境別の設定

#### 開発環境（`npm run dev`）
- **プロキシ**: Viteの `server.proxy` で `http://localhost:8080` に転送
- **目的**: ホットリロード付きでの開発作業

#### プレビュー環境（`npm run preview`）
- **プロキシ**: なし
- **API**: MSW（Mock Service Worker）やモックデータを使用推奨
- **目的**: ビルド後の静的ファイルの動作確認

#### 統合テスト環境
- **環境**: Docker Compose (`docker-compose up`)
- **プロキシ**: Nginxプロキシでbackendサービスに転送
- **目的**: 本番に近い環境でのフロントエンド・バックエンド結合確認

#### 本番環境
- **プロキシ**: Nginxプロキシでバックエンドサーバーに転送
- **設定**: `frontend/nginx.conf` の `/api/` location

### 実装方針

#### DO（推奨）
- フロントエンドコードは環境に依存しない相対パス使用
- 環境固有の設定は各環境のプロキシ層で吸収
- 統合テストはDocker環境で実施

#### DON'T（非推奨）
- `config.ts` での複雑な環境判定・条件分岐
- 環境変数による動的なAPI URL切り替え
- フロントエンドコードに環境依存ロジックを含める

### メリット
- **保守性向上**: フロントエンドコードがシンプル
- **環境一貫性**: すべての環境で同じAPI呼び出しコード
- **デバッグ容易性**: 環境による動作差異を最小化

---

## その他の開発メモ

### Database
- **Local**: PostgreSQL 14.18 (port 5439)
- **Docker**: PostgreSQL 15.13 (port 5432)
- **統合テスト**: Docker環境を使用してバージョン統一

### Build & Test
- **Flyway**: PostgreSQL用の依存関係として `flyway-database-postgresql` を追加済み
- **Test環境**: Flywayを無効化してテスト実行（`application-test.yml`）