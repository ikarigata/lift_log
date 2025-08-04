package com.ikr.lift_log.jooq.tables;

import org.jooq.Field;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * jOOQ生成クラスのスタブ - ビルド時のコンパイルエラー回避用
 * 実際のクラスは実行時にjOOQプラグインによって生成される
 */
public class WorkoutSets extends TableImpl<org.jooq.Record> {
    
    public static final WorkoutSets WORKOUT_SETS = new WorkoutSets();
    
    public final Field<UUID> ID = createField(DSL.name("id"), SQLDataType.UUID, this, "");
    public final Field<UUID> WORKOUT_RECORD_ID = createField(DSL.name("workout_record_id"), SQLDataType.UUID, this, "");
    public final Field<Integer> REPS = createField(DSL.name("reps"), SQLDataType.INTEGER, this, "");
    public final Field<Integer> SUB_REPS = createField(DSL.name("sub_reps"), SQLDataType.INTEGER, this, "");
    public final Field<BigDecimal> WEIGHT = createField(DSL.name("weight"), SQLDataType.DECIMAL(10, 2), this, "");
    public final Field<OffsetDateTime> CREATED_AT = createField(DSL.name("created_at"), SQLDataType.OFFSETDATETIME, this, "");
    public final Field<OffsetDateTime> UPDATED_AT = createField(DSL.name("updated_at"), SQLDataType.OFFSETDATETIME, this, "");
    
    private WorkoutSets() {
        this(DSL.name("workout_sets"), null);
    }
    
    private WorkoutSets(org.jooq.Name alias, Table<org.jooq.Record> aliased) {
        super(alias, null, aliased, (org.jooq.Field<?>[]) null, "");
    }
}
