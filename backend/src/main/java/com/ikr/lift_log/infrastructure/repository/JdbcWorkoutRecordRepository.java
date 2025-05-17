package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.domain.repository.WorkoutRecordRepository;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcWorkoutRecordRepository implements WorkoutRecordRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcWorkoutRecordRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<WorkoutRecord> findByWorkoutDayId(UUID workoutDayId) {
        String sql = "SELECT id, workout_day_id, exercise_id, notes, created_at, updated_at FROM public.workout_records "
                +
                "WHERE workout_day_id = :workoutDayId ORDER BY created_at";
        var params = new MapSqlParameterSource().addValue("workoutDayId", workoutDayId);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToWorkoutRecord(rs));
    }

    @Override
    public Optional<WorkoutRecord> findById(UUID id) {
        String sql = "SELECT id, workout_day_id, exercise_id, notes, created_at, updated_at FROM public.workout_records WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            WorkoutRecord workoutRecord = jdbcTemplate.queryForObject(sql, params,
                    (rs, rowNum) -> mapRowToWorkoutRecord(rs));
            return Optional.ofNullable(workoutRecord);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
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
        String sql = "DELETE FROM public.workout_records WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);
        jdbcTemplate.update(sql, params);
    }

    private WorkoutRecord insert(WorkoutRecord workoutRecord) {
        String sql = "INSERT INTO public.workout_records (workout_day_id, exercise_id, notes, created_at, updated_at) "
                +
                "VALUES (:workoutDayId, :exerciseId, :notes, :createdAt, :updatedAt) RETURNING id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("workoutDayId", workoutRecord.getWorkoutDayId())
                .addValue("exerciseId", workoutRecord.getExerciseId())
                .addValue("notes", workoutRecord.getNotes())
                .addValue("createdAt", workoutRecord.getCreatedAt())
                .addValue("updatedAt", workoutRecord.getUpdatedAt());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder);

        UUID id = UUID.fromString(keyHolder.getKeys().get("id").toString());
        workoutRecord.setId(id);

        return workoutRecord;
    }

    private WorkoutRecord update(WorkoutRecord workoutRecord) {
        String sql = "UPDATE public.workout_records SET workout_day_id = :workoutDayId, exercise_id = :exerciseId, " +
                "notes = :notes, updated_at = :updatedAt WHERE id = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", workoutRecord.getId())
                .addValue("workoutDayId", workoutRecord.getWorkoutDayId())
                .addValue("exerciseId", workoutRecord.getExerciseId())
                .addValue("notes", workoutRecord.getNotes())
                .addValue("updatedAt", workoutRecord.getUpdatedAt());

        jdbcTemplate.update(sql, params);
        return workoutRecord;
    }

    private WorkoutRecord mapRowToWorkoutRecord(ResultSet rs) throws SQLException {
        return new WorkoutRecord(
                UUID.fromString(rs.getString("id")),
                UUID.fromString(rs.getString("workout_day_id")),
                UUID.fromString(rs.getString("exercise_id")),
                rs.getString("notes"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()),
                rs.getTimestamp("updated_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
    }
}