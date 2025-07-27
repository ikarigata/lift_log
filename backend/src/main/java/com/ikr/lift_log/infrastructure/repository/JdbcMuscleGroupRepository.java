package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.domain.repository.MuscleGroupRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.MuscleGroups.MUSCLE_GROUPS;

@Repository
public class JdbcMuscleGroupRepository implements MuscleGroupRepository {

    private final DSLContext dsl;

    public JdbcMuscleGroupRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<MuscleGroup> findAll() {
        return dsl.selectFrom(MUSCLE_GROUPS)
                .orderBy(MUSCLE_GROUPS.NAME)
                .fetch(record -> new MuscleGroup(
                    record.get(MUSCLE_GROUPS.ID),
                    record.get(MUSCLE_GROUPS.NAME),
                    record.get(MUSCLE_GROUPS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Optional<MuscleGroup> findById(UUID id) {
        return dsl.selectFrom(MUSCLE_GROUPS)
                .where(MUSCLE_GROUPS.ID.eq(id))
                .fetchOptional(record -> new MuscleGroup(
                    record.get(MUSCLE_GROUPS.ID),
                    record.get(MUSCLE_GROUPS.NAME),
                    record.get(MUSCLE_GROUPS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Optional<MuscleGroup> findByName(String name) {
        return dsl.selectFrom(MUSCLE_GROUPS)
                .where(MUSCLE_GROUPS.NAME.eq(name))
                .fetchOptional(record -> new MuscleGroup(
                    record.get(MUSCLE_GROUPS.ID),
                    record.get(MUSCLE_GROUPS.NAME),
                    record.get(MUSCLE_GROUPS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public MuscleGroup save(MuscleGroup muscleGroup) {
        if (muscleGroup.getId() == null) {
            return insert(muscleGroup);
        } else {
            return update(muscleGroup);
        }
    }

    private MuscleGroup insert(MuscleGroup muscleGroup) {
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        
        dsl.insertInto(MUSCLE_GROUPS)
                .set(MUSCLE_GROUPS.ID, id)
                .set(MUSCLE_GROUPS.NAME, muscleGroup.getName())
                .set(MUSCLE_GROUPS.CREATED_AT, now.toOffsetDateTime())
                .execute();

        return new MuscleGroup(id, muscleGroup.getName(), now);
    }

    private MuscleGroup update(MuscleGroup muscleGroup) {
        int rowsAffected = dsl.update(MUSCLE_GROUPS)
                .set(MUSCLE_GROUPS.NAME, muscleGroup.getName())
                .where(MUSCLE_GROUPS.ID.eq(muscleGroup.getId()))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("MuscleGroup not found with id: " + muscleGroup.getId());
        }

        return findById(muscleGroup.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated muscle group"));
    }
}