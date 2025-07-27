package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.Exercises.EXERCISES;

@Repository
public class JdbcExerciseRepository implements ExerciseRepository {

    private final DSLContext dsl;

    public JdbcExerciseRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<Exercise> findByUserId(UUID userId) {
        return dsl.selectFrom(EXERCISES)
                .where(EXERCISES.USER_ID.eq(userId))
                .orderBy(EXERCISES.NAME)
                .fetch(record -> new Exercise(
                    record.get(EXERCISES.ID),
                    record.get(EXERCISES.USER_ID),
                    record.get(EXERCISES.NAME),
                    record.get(EXERCISES.DESCRIPTION),
                    record.get(EXERCISES.MUSCLE_GROUP_ID),
                    record.get(EXERCISES.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }


    @Override
    public Optional<Exercise> findById(UUID id) {
        return dsl.selectFrom(EXERCISES)
                .where(EXERCISES.ID.eq(id))
                .fetchOptional(record -> new Exercise(
                    record.get(EXERCISES.ID),
                    record.get(EXERCISES.USER_ID),
                    record.get(EXERCISES.NAME),
                    record.get(EXERCISES.DESCRIPTION),
                    record.get(EXERCISES.MUSCLE_GROUP_ID),
                    record.get(EXERCISES.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Exercise save(Exercise exercise) {
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        
        dsl.insertInto(EXERCISES)
                .set(EXERCISES.ID, id)
                .set(EXERCISES.USER_ID, exercise.getUserId())
                .set(EXERCISES.NAME, exercise.getName())
                .set(EXERCISES.DESCRIPTION, exercise.getDescription())
                .set(EXERCISES.MUSCLE_GROUP_ID, exercise.getMuscleGroupId())
                .set(EXERCISES.CREATED_AT, now.toOffsetDateTime())
                .execute();

        return new Exercise(id, exercise.getUserId(), exercise.getName(), exercise.getDescription(), exercise.getMuscleGroupId(), now);
    }

    @Override
    public Exercise update(UUID id, Exercise exercise) {
        int rowsAffected = dsl.update(EXERCISES)
                .set(EXERCISES.USER_ID, exercise.getUserId())
                .set(EXERCISES.NAME, exercise.getName())
                .set(EXERCISES.DESCRIPTION, exercise.getDescription())
                .set(EXERCISES.MUSCLE_GROUP_ID, exercise.getMuscleGroupId())
                .where(EXERCISES.ID.eq(id))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Exercise not found with id: " + id);
        }

        return findById(id)
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated exercise"));
    }

    @Override
    public void deleteById(UUID id) {
        int rowsAffected = dsl.deleteFrom(EXERCISES)
                .where(EXERCISES.ID.eq(id))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Exercise not found with id: " + id);
        }
    }
}