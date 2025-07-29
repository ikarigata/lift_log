package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.domain.repository.WorkoutRecordRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.WorkoutRecords.WORKOUT_RECORDS;

@Repository
public class JdbcWorkoutRecordRepository implements WorkoutRecordRepository {

    private final DSLContext dsl;

    public JdbcWorkoutRecordRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<WorkoutRecord> findAll() {
        return dsl.selectFrom(WORKOUT_RECORDS)
                .orderBy(WORKOUT_RECORDS.CREATED_AT)
                .fetch(record -> new WorkoutRecord(
                        record.get(WORKOUT_RECORDS.ID),
                        record.get(WORKOUT_RECORDS.WORKOUT_DAY_ID),
                        record.get(WORKOUT_RECORDS.EXERCISE_ID),
                        record.get(WORKOUT_RECORDS.NOTES),
                        record.get(WORKOUT_RECORDS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                        record.get(WORKOUT_RECORDS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public List<WorkoutRecord> findByWorkoutDayId(UUID workoutDayId) {
        return dsl.selectFrom(WORKOUT_RECORDS)
                .where(WORKOUT_RECORDS.WORKOUT_DAY_ID.eq(workoutDayId))
                .orderBy(WORKOUT_RECORDS.CREATED_AT)
                .fetch(record -> new WorkoutRecord(
                    record.get(WORKOUT_RECORDS.ID),
                    record.get(WORKOUT_RECORDS.WORKOUT_DAY_ID),
                    record.get(WORKOUT_RECORDS.EXERCISE_ID),
                    record.get(WORKOUT_RECORDS.NOTES),
                    record.get(WORKOUT_RECORDS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                    record.get(WORKOUT_RECORDS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Optional<WorkoutRecord> findById(UUID id) {
        return dsl.selectFrom(WORKOUT_RECORDS)
                .where(WORKOUT_RECORDS.ID.eq(id))
                .fetchOptional(record -> new WorkoutRecord(
                    record.get(WORKOUT_RECORDS.ID),
                    record.get(WORKOUT_RECORDS.WORKOUT_DAY_ID),
                    record.get(WORKOUT_RECORDS.EXERCISE_ID),
                    record.get(WORKOUT_RECORDS.NOTES),
                    record.get(WORKOUT_RECORDS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                    record.get(WORKOUT_RECORDS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public WorkoutRecord save(WorkoutRecord workoutRecord) {
        if (workoutRecord.getId() == null) {
            return insert(workoutRecord);
        } else {
            return update(workoutRecord);
        }
    }

    @Override
    public void deleteById(UUID id) {
        int rowsAffected = dsl.deleteFrom(WORKOUT_RECORDS)
                .where(WORKOUT_RECORDS.ID.eq(id))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("WorkoutRecord not found with id: " + id);
        }
    }

    private WorkoutRecord insert(WorkoutRecord workoutRecord) {
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime createdAt = workoutRecord.getCreatedAt() != null ? workoutRecord.getCreatedAt() : now;
        ZonedDateTime updatedAt = workoutRecord.getUpdatedAt() != null ? workoutRecord.getUpdatedAt() : now;
        
        dsl.insertInto(WORKOUT_RECORDS)
                .set(WORKOUT_RECORDS.ID, id)
                .set(WORKOUT_RECORDS.WORKOUT_DAY_ID, workoutRecord.getWorkoutDayId())
                .set(WORKOUT_RECORDS.EXERCISE_ID, workoutRecord.getExerciseId())
                .set(WORKOUT_RECORDS.NOTES, workoutRecord.getNotes())
                .set(WORKOUT_RECORDS.CREATED_AT, createdAt.toOffsetDateTime())
                .set(WORKOUT_RECORDS.UPDATED_AT, updatedAt.toOffsetDateTime())
                .execute();

        return new WorkoutRecord(id, workoutRecord.getWorkoutDayId(), workoutRecord.getExerciseId(), 
                workoutRecord.getNotes(), createdAt, updatedAt);
    }

    private WorkoutRecord update(WorkoutRecord workoutRecord) {
        ZonedDateTime now = ZonedDateTime.now();
        
        int rowsAffected = dsl.update(WORKOUT_RECORDS)
                .set(WORKOUT_RECORDS.WORKOUT_DAY_ID, workoutRecord.getWorkoutDayId())
                .set(WORKOUT_RECORDS.EXERCISE_ID, workoutRecord.getExerciseId())
                .set(WORKOUT_RECORDS.NOTES, workoutRecord.getNotes())
                .set(WORKOUT_RECORDS.UPDATED_AT, now.toOffsetDateTime())
                .where(WORKOUT_RECORDS.ID.eq(workoutRecord.getId()))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("WorkoutRecord not found with id: " + workoutRecord.getId());
        }

        return findById(workoutRecord.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated workout record"));
    }
}