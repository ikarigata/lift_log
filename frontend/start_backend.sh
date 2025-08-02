#!/bin/bash

# バックエンドサーバー起動スクリプト
echo "Starting Lift Log Backend Server..."

# バックエンドディレクトリに移動
cd ../backend

# PostgreSQLの起動確認
echo "Checking PostgreSQL connection..."
if ! pg_isready -h localhost -p 5439 > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running on port 5439"
    echo "Please start PostgreSQL first"
    exit 1
fi

# Flyway migration実行
echo "Running database migrations..."
./mvnw flyway:migrate -Dflyway.url=jdbc:postgresql://localhost:5439/lift_log -Dflyway.user=postgres -Dflyway.password=postgres

# テストデータの挿入（存在しない場合のみ）
echo "Checking and inserting test data..."
PGPASSWORD=postgres psql -h localhost -p 5439 -U postgres -d lift_log -c "
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@example.com') THEN
        \i src/main/resources/db/test_data.sql
        RAISE NOTICE 'Test data inserted successfully';
    ELSE
        RAISE NOTICE 'Test data already exists, skipping';
    END IF;
END
\$\$;
"

# Spring Bootアプリケーション起動
echo "Starting Spring Boot application..."
./mvnw spring-boot:run