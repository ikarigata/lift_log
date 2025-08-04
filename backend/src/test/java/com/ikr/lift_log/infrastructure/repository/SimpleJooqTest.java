package com.ikr.lift_log.infrastructure.repository;

import org.jooq.DSLContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class SimpleJooqTest {

    @Autowired
    private DSLContext dsl;

    @Test
    void dslContextIsAvailable() {
        // jOOQ DSLContextが正しく注入されることを確認
        assertThat(dsl).isNotNull();
    }

    @Test
    void canExecuteSimpleQuery() {
        // 基本的なクエリが実行できることを確認
        Integer result = dsl.selectOne().fetchOne(0, Integer.class);
        assertThat(result).isEqualTo(1);
    }
}