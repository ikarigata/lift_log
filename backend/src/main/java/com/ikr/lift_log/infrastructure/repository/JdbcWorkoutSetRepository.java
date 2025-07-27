package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.domain.repository.WorkoutSetRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.WorkoutSets.WORKOUT_SETS;

@Repository
public class JdbcWorkoutSetRepository implements WorkoutSetRepository {

    private final DSLContext dsl;

    public JdbcWorkoutSetRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<WorkoutSet> findByWorkoutRecordId(UUID workoutRecordId) {
        return dsl.selectFrom(WORKOUT_SETS)
                .where(WORKOUT_SETS.WORKOUT_RECORD_ID.eq(workoutRecordId))
                .orderBy(WORKOUT_SETS.CREATED_AT)
                .fetch(record -> new WorkoutSet(
                    record.get(WORKOUT_SETS.ID),
                    record.get(WORKOUT_SETS.WORKOUT_RECORD_ID),
                    record.get(WORKOUT_SETS.REPS),
                    record.get(WORKOUT_SETS.SUB_REPS) != null ? record.get(WORKOUT_SETS.SUB_REPS) : 0,
                    record.get(WORKOUT_SETS.WEIGHT),
                    record.get(WORKOUT_SETS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                    record.get(WORKOUT_SETS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Optional<WorkoutSet> findById(UUID id) {
        return dsl.selectFrom(WORKOUT_SETS)
                .where(WORKOUT_SETS.ID.eq(id))
                .fetchOptional(record -> new WorkoutSet(
                    record.get(WORKOUT_SETS.ID),
                    record.get(WORKOUT_SETS.WORKOUT_RECORD_ID),
                    record.get(WORKOUT_SETS.REPS),
                    record.get(WORKOUT_SETS.SUB_REPS) != null ? record.get(WORKOUT_SETS.SUB_REPS) : 0,
                    record.get(WORKOUT_SETS.WEIGHT),
                    record.get(WORKOUT_SETS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                    record.get(WORKOUT_SETS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public WorkoutSet save(WorkoutSet workoutSet) {
        if (workoutSet.getId() == null) {
            return insert(workoutSet);
        } else {
            return update(workoutSet);
        }
    }

    @Override
    public void deleteById(UUID id) {
        int rowsAffected = dsl.deleteFrom(WORKOUT_SETS)
                .where(WORKOUT_SETS.ID.eq(id))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("WorkoutSet not found with id: " + id);
        }
    }

    private WorkoutSet insert(WorkoutSet workoutSet) {
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime createdAt = workoutSet.getCreatedAt() != null ? workoutSet.getCreatedAt() : now;
        ZonedDateTime updatedAt = workoutSet.getUpdatedAt() != null ? workoutSet.getUpdatedAt() : now;
        
        dsl.insertInto(WORKOUT_SETS)
                .set(WORKOUT_SETS.ID, id)
                .set(WORKOUT_SETS.WORKOUT_RECORD_ID, workoutSet.getWorkoutRecordId())
                .set(WORKOUT_SETS.REPS, workoutSet.getReps())
                .set(WORKOUT_SETS.SUB_REPS, workoutSet.getSubReps())
                .set(WORKOUT_SETS.WEIGHT, workoutSet.getWeight())
                .set(WORKOUT_SETS.CREATED_AT, createdAt.toOffsetDateTime())
                .set(WORKOUT_SETS.UPDATED_AT, updatedAt.toOffsetDateTime())
                .execute();

        return new WorkoutSet(id, workoutSet.getWorkoutRecordId(), workoutSet.getReps(), workoutSet.getSubReps(),
                workoutSet.getWeight(), createdAt, updatedAt);
    }

    private WorkoutSet update(WorkoutSet workoutSet) {
        ZonedDateTime now = ZonedDateTime.now();
        
        int rowsAffected = dsl.update(WORKOUT_SETS)
                .set(WORKOUT_SETS.WORKOUT_RECORD_ID, workoutSet.getWorkoutRecordId())
                .set(WORKOUT_SETS.REPS, workoutSet.getReps())
                .set(WORKOUT_SETS.SUB_REPS, workoutSet.getSubReps())
                .set(WORKOUT_SETS.WEIGHT, workoutSet.getWeight())
                .set(WORKOUT_SETS.UPDATED_AT, now.toOffsetDateTime())
                .where(WORKOUT_SETS.ID.eq(workoutSet.getId()))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("WorkoutSet not found with id: " + workoutSet.getId());
        }

        return findById(workoutSet.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated workout set"));
    }
}