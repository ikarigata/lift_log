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
public class Exercises extends TableImpl<org.jooq.Record> {
    
    public static final Exercises EXERCISES = new Exercises();
    
    public final Field<UUID> ID = createField(DSL.name("id"), SQLDataType.UUID, this, "");
    public final Field<String> NAME = createField(DSL.name("name"), SQLDataType.VARCHAR(255), this, "");
    public final Field<String> DESCRIPTION = createField(DSL.name("description"), SQLDataType.VARCHAR(1000), this, "");
    public final Field<UUID> MUSCLE_GROUP_ID = createField(DSL.name("muscle_group_id"), SQLDataType.UUID, this, "");
    public final Field<UUID> USER_ID = createField(DSL.name("user_id"), SQLDataType.UUID, this, "");
    public final Field<OffsetDateTime> CREATED_AT = createField(DSL.name("created_at"), SQLDataType.OFFSETDATETIME, this, "");
    
    private Exercises() {
        this(DSL.name("exercises"), null);
    }
    
    private Exercises(org.jooq.Name alias, Table<org.jooq.Record> aliased) {
        super(alias, null, aliased, (org.jooq.Field<?>[]) null, "");
    }
}
