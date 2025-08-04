package com.ikr.lift_log.jooq.tables;

import org.jooq.Field;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * jOOQ生成クラスのスタブ - ビルド時のコンパイルエラー回避用
 * 実際のクラスは実行時にjOOQプラグインによって生成される
 */
public class WorkoutDays extends TableImpl<org.jooq.Record> {
    
    public static final WorkoutDays WORKOUT_DAYS = new WorkoutDays();
    
    public final Field<UUID> ID = createField(DSL.name("id"), SQLDataType.UUID, this, "");
    public final Field<UUID> USER_ID = createField(DSL.name("user_id"), SQLDataType.UUID, this, "");
    public final Field<LocalDate> DATE = createField(DSL.name("date"), SQLDataType.LOCALDATE, this, "");
    public final Field<String> TITLE = createField(DSL.name("title"), SQLDataType.VARCHAR(255), this, "");
    public final Field<String> NOTES = createField(DSL.name("notes"), SQLDataType.VARCHAR(1000), this, "");
    public final Field<OffsetDateTime> CREATED_AT = createField(DSL.name("created_at"), SQLDataType.OFFSETDATETIME, this, "");
    public final Field<OffsetDateTime> UPDATED_AT = createField(DSL.name("updated_at"), SQLDataType.OFFSETDATETIME, this, "");
    
    private WorkoutDays() {
        this(DSL.name("workout_days"), null);
    }
    
    private WorkoutDays(org.jooq.Name alias, Table<org.jooq.Record> aliased) {
        super(alias, null, aliased, null, null);
    }
}
