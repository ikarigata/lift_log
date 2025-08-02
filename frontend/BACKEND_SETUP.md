# バックエンド接続セットアップガイド

## 問題の概要
フロントエンドからバックエンドAPIへの接続で `CONNECTION_REFUSED` エラーが発生しています。

## 原因
- バックエンドのSpring Bootサーバーが起動していない
- フロントエンドの設定でMSWモックが有効になっている

## 解決手順

### 1. フロントエンドの設定変更
`.env.development` ファイルが既に修正済み：
```
VITE_USE_MSW=false
VITE_API_BASE_URL=http://localhost:8080
```

### 2. バックエンドサーバーの起動

#### オプション A: 自動スクリプトを使用（推奨）
```bash
# フロントエンドディレクトリから実行
./start_backend.sh
```

#### オプション B: 手動で起動
```bash
# 1. バックエンドディレクトリに移動
cd ../backend

# 2. PostgreSQLが起動していることを確認
pg_isready -h localhost -p 5439

# 3. データベースマイグレーション実行
./mvnw flyway:migrate

# 4. テストデータ挿入（必要に応じて）
PGPASSWORD=postgres psql -h localhost -p 5439 -U postgres -d lift_log -f ../frontend/insert_test_data.sql

# 5. Spring Bootアプリケーション起動
./mvnw spring-boot:run
```

### 3. 接続確認
- ブラウザで http://localhost:5173 にアクセス
- デベロッパーツールでCONNECTION_REFUSEDエラーが消えていることを確認
- ログイン: `test@example.com` / `password`

## トラブルシューティング

### PostgreSQLが起動していない場合
```bash
# PostgreSQLを起動（システムによって異なる）
sudo systemctl start postgresql
# または
brew services start postgresql
```

### ポート8080が既に使用されている場合
```bash
# プロセスを確認
lsof -i :8080
# プロセスを終了
kill -9 <PID>
```

### データベース接続エラーの場合
```bash
# データベースの存在確認
PGPASSWORD=postgres psql -h localhost -p 5439 -U postgres -l

# データベース作成（存在しない場合）
PGPASSWORD=postgres createdb -h localhost -p 5439 -U postgres lift_log
```

## 設定内容
- **バックエンドポート**: 8080
- **データベースポート**: 5439
- **フロントエンドポート**: 5173 (Vite)
- **CORS設定**: localhost:5173からのリクエストを許可
- **テストユーザー**: test@example.com / password