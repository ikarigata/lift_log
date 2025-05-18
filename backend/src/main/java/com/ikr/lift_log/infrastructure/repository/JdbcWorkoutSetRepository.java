package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.domain.repository.WorkoutSetRepository;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcWorkoutSetRepository implements WorkoutSetRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcWorkoutSetRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<WorkoutSet> findByWorkoutRecordId(UUID workoutRecordId) {
        String sql = "SELECT id, workout_record_id, reps, weight, created_at, updated_at FROM public.workout_sets " +
                "WHERE workout_record_id = :workoutRecordId ORDER BY created_at";
        var params = new MapSqlParameterSource().addValue("workoutRecordId", workoutRecordId);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToWorkoutSet(rs));
    }

    @Override
    public Optional<WorkoutSet> findById(UUID id) {
        String sql = "SELECT id, workout_record_id, reps, weight, created_at, updated_at FROM public.workout_sets WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            WorkoutSet workoutSet = jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> mapRowToWorkoutSet(rs));
            return Optional.ofNullable(workoutSet);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
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
        String sql = "DELETE FROM public.workout_sets WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);
        jdbcTemplate.update(sql, params);
    }

    private WorkoutSet insert(WorkoutSet workoutSet) {
        String sql = "INSERT INTO public.workout_sets (workout_record_id, reps, weight, created_at, updated_at) " +
                "VALUES (:workoutRecordId, :reps, :weight, :createdAt, :updatedAt) RETURNING id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("workoutRecordId", workoutSet.getWorkoutRecordId())
                .addValue("reps", workoutSet.getReps())
                .addValue("weight", workoutSet.getWeight())
                .addValue("createdAt", workoutSet.getCreatedAt())
                .addValue("updatedAt", workoutSet.getUpdatedAt());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder);

        UUID id = UUID.fromString(keyHolder.getKeys().get("id").toString());
        workoutSet.setId(id);

        return workoutSet;
    }

    private WorkoutSet update(WorkoutSet workoutSet) {
        String sql = "UPDATE public.workout_sets SET workout_record_id = :workoutRecordId, reps = :reps, " +
                "weight = :weight, updated_at = :updatedAt WHERE id = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", workoutSet.getId())
                .addValue("workoutRecordId", workoutSet.getWorkoutRecordId())
                .addValue("reps", workoutSet.getReps())
                .addValue("weight", workoutSet.getWeight())
                .addValue("updatedAt", workoutSet.getUpdatedAt());

        jdbcTemplate.update(sql, params);
        return workoutSet;
    }

    private WorkoutSet mapRowToWorkoutSet(ResultSet rs) throws SQLException {
        WorkoutSet workoutSet = new WorkoutSet(
                UUID.fromString(rs.getString("id")),
                UUID.fromString(rs.getString("workout_record_id")),
                rs.getInt("reps"),
                rs.getBigDecimal("weight"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()),
                rs.getTimestamp("updated_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
        return workoutSet;
    }
}