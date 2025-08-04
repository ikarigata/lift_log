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
public class WorkoutRecords extends TableImpl<org.jooq.Record> {
    
    public static final WorkoutRecords WORKOUT_RECORDS = new WorkoutRecords();
    
    public final Field<UUID> ID = createField(DSL.name("id"), SQLDataType.UUID, this, "");
    public final Field<UUID> WORKOUT_DAY_ID = createField(DSL.name("workout_day_id"), SQLDataType.UUID, this, "");
    public final Field<UUID> EXERCISE_ID = createField(DSL.name("exercise_id"), SQLDataType.UUID, this, "");
    public final Field<Integer> SET_ORDER = createField(DSL.name("set_order"), SQLDataType.INTEGER, this, "");
    public final Field<OffsetDateTime> CREATED_AT = createField(DSL.name("created_at"), SQLDataType.OFFSETDATETIME, this, "");
    
    private WorkoutRecords() {
        this(DSL.name("workout_records"), null);
    }
    
    private WorkoutRecords(org.jooq.Name alias, Table<org.jooq.Record> aliased) {
        super(alias, null, aliased, null, null, "");
    }
}
