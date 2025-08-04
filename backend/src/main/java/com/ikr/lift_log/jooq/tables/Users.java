package com.ikr.lift_log.jooq.tables;

import org.jooq.Field;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * jOOQ生成クラスのスタブ - ビルド時のコンパイルエラー回避用
 * 実際のクラスは実行時にjOOQプラグインによって生成される
 */
public class Users extends TableImpl<org.jooq.Record> {
    
    public static final Users USERS = new Users();
    
    public final Field<UUID> ID = createField(DSL.name("id"), SQLDataType.UUID, this, "");
    public final Field<String> NAME = createField(DSL.name("name"), SQLDataType.VARCHAR(255), this, "");
    public final Field<String> EMAIL = createField(DSL.name("email"), SQLDataType.VARCHAR(255), this, "");
    public final Field<String> PASSWORD_HASH = createField(DSL.name("password_hash"), SQLDataType.VARCHAR(255), this, "");
    public final Field<OffsetDateTime> CREATED_AT = createField(DSL.name("created_at"), SQLDataType.OFFSETDATETIME, this, "");
    
    private Users() {
        this(DSL.name("users"), null);
    }
    
    private Users(org.jooq.Name alias, Table<org.jooq.Record> aliased) {
        super(alias, null, aliased, null, (org.jooq.Field<?>[]) null);
    }
}
