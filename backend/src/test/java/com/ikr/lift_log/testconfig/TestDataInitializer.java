package com.ikr.lift_log.testconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.event.annotation.BeforeTestClass;

@TestComponent
public class TestDataInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeTestClass
    public void initializeTestData() {
        // テストデータの初期化
        // 既存のマイグレーションスクリプトによってテストユーザーが作成されているかを確認
        Long userCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM users WHERE email = 'test@example.com'", 
            Long.class
        );
        
        if (userCount == 0) {
            // テストユーザーが存在しない場合は作成
            jdbcTemplate.update(
                "INSERT INTO users (id, name, email, password, created_at, updated_at) " +
                "VALUES (gen_random_uuid(), 'Test User', 'test@example.com', '$2a$10$5k7jJQm7J8K9K7mJ8K9K7eOK9K7mJ8K9K7mJ8K9K7eOK9K7mJ8K9K7', NOW(), NOW())"
            );
        }
    }
}