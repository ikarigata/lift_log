package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import com.ikr.lift_log.domain.repository.ExerciseMuscleGroupRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.ExerciseMuscleGroups.EXERCISE_MUSCLE_GROUPS;

@Repository
public class JdbcExerciseMuscleGroupRepository implements ExerciseMuscleGroupRepository {

    private final DSLContext dsl;

    public JdbcExerciseMuscleGroupRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<ExerciseMuscleGroup> findByExerciseId(UUID exerciseId) {
        return dsl.selectFrom(EXERCISE_MUSCLE_GROUPS)
                .where(EXERCISE_MUSCLE_GROUPS.EXERCISE_ID.eq(exerciseId))
                .fetch(record -> new ExerciseMuscleGroup(
                    record.get(EXERCISE_MUSCLE_GROUPS.ID),
                    record.get(EXERCISE_MUSCLE_GROUPS.EXERCISE_ID),
                    record.get(EXERCISE_MUSCLE_GROUPS.MUSCLE_GROUP_ID),
                    record.get(EXERCISE_MUSCLE_GROUPS.IS_PRIMARY)
                ));
    }

    @Override
    public Optional<ExerciseMuscleGroup> findById(UUID id) {
        return dsl.selectFrom(EXERCISE_MUSCLE_GROUPS)
                .where(EXERCISE_MUSCLE_GROUPS.ID.eq(id))
                .fetchOptional(record -> new ExerciseMuscleGroup(
                    record.get(EXERCISE_MUSCLE_GROUPS.ID),
                    record.get(EXERCISE_MUSCLE_GROUPS.EXERCISE_ID),
                    record.get(EXERCISE_MUSCLE_GROUPS.MUSCLE_GROUP_ID),
                    record.get(EXERCISE_MUSCLE_GROUPS.IS_PRIMARY)
                ));
    }

    @Override
    public ExerciseMuscleGroup save(ExerciseMuscleGroup exerciseMuscleGroup) {
        if (exerciseMuscleGroup.getId() == null) {
            return insert(exerciseMuscleGroup);
        } else {
            return update(exerciseMuscleGroup);
        }
    }

    @Override
    public void deleteById(UUID id) {
        int rowsAffected = dsl.deleteFrom(EXERCISE_MUSCLE_GROUPS)
                .where(EXERCISE_MUSCLE_GROUPS.ID.eq(id))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("ExerciseMuscleGroup not found with id: " + id);
        }
    }

    private ExerciseMuscleGroup insert(ExerciseMuscleGroup exerciseMuscleGroup) {
        UUID id = UUID.randomUUID();
        
        dsl.insertInto(EXERCISE_MUSCLE_GROUPS)
                .set(EXERCISE_MUSCLE_GROUPS.ID, id)
                .set(EXERCISE_MUSCLE_GROUPS.EXERCISE_ID, exerciseMuscleGroup.getExerciseId())
                .set(EXERCISE_MUSCLE_GROUPS.MUSCLE_GROUP_ID, exerciseMuscleGroup.getMuscleGroupId())
                .set(EXERCISE_MUSCLE_GROUPS.IS_PRIMARY, exerciseMuscleGroup.isPrimary())
                .execute();

        return new ExerciseMuscleGroup(id, exerciseMuscleGroup.getExerciseId(), 
                exerciseMuscleGroup.getMuscleGroupId(), exerciseMuscleGroup.isPrimary());
    }

    private ExerciseMuscleGroup update(ExerciseMuscleGroup exerciseMuscleGroup) {
        int rowsAffected = dsl.update(EXERCISE_MUSCLE_GROUPS)
                .set(EXERCISE_MUSCLE_GROUPS.EXERCISE_ID, exerciseMuscleGroup.getExerciseId())
                .set(EXERCISE_MUSCLE_GROUPS.MUSCLE_GROUP_ID, exerciseMuscleGroup.getMuscleGroupId())
                .set(EXERCISE_MUSCLE_GROUPS.IS_PRIMARY, exerciseMuscleGroup.isPrimary())
                .where(EXERCISE_MUSCLE_GROUPS.ID.eq(exerciseMuscleGroup.getId()))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("ExerciseMuscleGroup not found with id: " + exerciseMuscleGroup.getId());
        }

        return findById(exerciseMuscleGroup.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated exercise muscle group"));
    }
}