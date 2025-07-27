package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutDay;
import com.ikr.lift_log.domain.repository.WorkoutDayRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.WorkoutDays.WORKOUT_DAYS;

@Repository
public class JdbcWorkoutDayRepository implements WorkoutDayRepository {

    private final DSLContext dsl;

    public JdbcWorkoutDayRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<WorkoutDay> findByUserId(UUID userId) {
        return dsl.selectFrom(WORKOUT_DAYS)
                .where(WORKOUT_DAYS.USER_ID.eq(userId))
                .orderBy(WORKOUT_DAYS.DATE.desc())
                .fetch(record -> new WorkoutDay(
                        record.get(WORKOUT_DAYS.ID),
                        record.get(WORKOUT_DAYS.USER_ID),
                        record.get(WORKOUT_DAYS.DATE),
                        record.get(WORKOUT_DAYS.TITLE),
                        record.get(WORKOUT_DAYS.NOTES),
                        record.get(WORKOUT_DAYS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                        record.get(WORKOUT_DAYS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())));
    }

    @Override
    public List<WorkoutDay> findByUserIdAndDateBetween(UUID userId, LocalDate fromDate, LocalDate toDate) {
        return dsl.selectFrom(WORKOUT_DAYS)
                .where(WORKOUT_DAYS.USER_ID.eq(userId)
                        .and(WORKOUT_DAYS.DATE.between(fromDate, toDate)))
                .orderBy(WORKOUT_DAYS.DATE.desc())
                .fetch(record -> new WorkoutDay(
                        record.get(WORKOUT_DAYS.ID),
                        record.get(WORKOUT_DAYS.USER_ID),
                        record.get(WORKOUT_DAYS.DATE),
                        record.get(WORKOUT_DAYS.TITLE),
                        record.get(WORKOUT_DAYS.NOTES),
                        record.get(WORKOUT_DAYS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                        record.get(WORKOUT_DAYS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())));
    }

    @Override
    public Optional<WorkoutDay> findById(UUID id) {
        return dsl.selectFrom(WORKOUT_DAYS)
                .where(WORKOUT_DAYS.ID.eq(id))
                .fetchOptional(record -> new WorkoutDay(
                        record.get(WORKOUT_DAYS.ID),
                        record.get(WORKOUT_DAYS.USER_ID),
                        record.get(WORKOUT_DAYS.DATE),
                        record.get(WORKOUT_DAYS.TITLE),
                        record.get(WORKOUT_DAYS.NOTES),
                        record.get(WORKOUT_DAYS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault()),
                        record.get(WORKOUT_DAYS.UPDATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())));
    }

    @Override
    public WorkoutDay save(WorkoutDay workoutDay) {
        if (workoutDay.getId() == null) {
            return insert(workoutDay);
        } else {
            return update(workoutDay);
        }
    }

    @Override
    public void deleteById(UUID id) {
        int rowsAffected = dsl.deleteFrom(WORKOUT_DAYS)
                .where(WORKOUT_DAYS.ID.eq(id))
                .execute();

        if (rowsAffected == 0) {
            throw new RuntimeException("WorkoutDay not found with id: " + id);
        }
    }

    private WorkoutDay insert(WorkoutDay workoutDay) {
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        LocalDate date = workoutDay.getDate() != null ? workoutDay.getDate() : LocalDate.now();

        dsl.insertInto(WORKOUT_DAYS)
                .set(WORKOUT_DAYS.ID, id)
                .set(WORKOUT_DAYS.USER_ID, workoutDay.getUserId())
                .set(WORKOUT_DAYS.DATE, date)
                .set(WORKOUT_DAYS.TITLE, workoutDay.getTitle())
                .set(WORKOUT_DAYS.NOTES, workoutDay.getNotes())
                .set(WORKOUT_DAYS.CREATED_AT, now.toOffsetDateTime())
                .set(WORKOUT_DAYS.UPDATED_AT, now.toOffsetDateTime())
                .execute();

        return new WorkoutDay(id, workoutDay.getUserId(), date, workoutDay.getTitle(),
                workoutDay.getNotes(), now, now);
    }

    private WorkoutDay update(WorkoutDay workoutDay) {
        ZonedDateTime now = ZonedDateTime.now();

        int rowsAffected = dsl.update(WORKOUT_DAYS)
                .set(WORKOUT_DAYS.USER_ID, workoutDay.getUserId())
                .set(WORKOUT_DAYS.DATE, workoutDay.getDate())
                .set(WORKOUT_DAYS.TITLE, workoutDay.getTitle())
                .set(WORKOUT_DAYS.NOTES, workoutDay.getNotes())
                .set(WORKOUT_DAYS.UPDATED_AT, now.toOffsetDateTime())
                .where(WORKOUT_DAYS.ID.eq(workoutDay.getId()))
                .execute();

        if (rowsAffected == 0) {
            throw new RuntimeException("WorkoutDay not found with id: " + workoutDay.getId());
        }

        return findById(workoutDay.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated workout day"));
    }
}