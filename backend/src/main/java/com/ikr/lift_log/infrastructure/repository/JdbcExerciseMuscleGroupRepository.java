package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import com.ikr.lift_log.domain.repository.ExerciseMuscleGroupRepository;
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
public class JdbcExerciseMuscleGroupRepository implements ExerciseMuscleGroupRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcExerciseMuscleGroupRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<ExerciseMuscleGroup> findByExerciseId(UUID exerciseId) {
        String sql = "SELECT id, exercise_id, muscle_group_id, is_primary FROM public.exercise_muscle_groups WHERE exercise_id = :exerciseId";
        var params = new MapSqlParameterSource().addValue("exerciseId", exerciseId);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToExerciseMuscleGroup(rs));
    }

    @Override
    public Optional<ExerciseMuscleGroup> findById(UUID id) {
        String sql = "SELECT id, exercise_id, muscle_group_id, is_primary FROM public.exercise_muscle_groups WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            ExerciseMuscleGroup exerciseMuscleGroup = jdbcTemplate.queryForObject(sql, params,
                    (rs, rowNum) -> mapRowToExerciseMuscleGroup(rs));
            return Optional.ofNullable(exerciseMuscleGroup);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
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
        String sql = "DELETE FROM public.exercise_muscle_groups WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);
        jdbcTemplate.update(sql, params);
    }

    private ExerciseMuscleGroup insert(ExerciseMuscleGroup exerciseMuscleGroup) {
        String sql = "INSERT INTO public.exercise_muscle_groups (exercise_id, muscle_group_id, is_primary) " +
                "VALUES (:exerciseId, :muscleGroupId, :isPrimary) RETURNING id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("exerciseId", exerciseMuscleGroup.getExerciseId())
                .addValue("muscleGroupId", exerciseMuscleGroup.getMuscleGroupId())
                .addValue("isPrimary", exerciseMuscleGroup.isPrimary());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder);

        UUID id = UUID.fromString(keyHolder.getKeys().get("id").toString());
        exerciseMuscleGroup.setId(id);

        return exerciseMuscleGroup;
    }

    private ExerciseMuscleGroup update(ExerciseMuscleGroup exerciseMuscleGroup) {
        String sql = "UPDATE public.exercise_muscle_groups SET exercise_id = :exerciseId, " +
                "muscle_group_id = :muscleGroupId, is_primary = :isPrimary WHERE id = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", exerciseMuscleGroup.getId())
                .addValue("exerciseId", exerciseMuscleGroup.getExerciseId())
                .addValue("muscleGroupId", exerciseMuscleGroup.getMuscleGroupId())
                .addValue("isPrimary", exerciseMuscleGroup.isPrimary());

        jdbcTemplate.update(sql, params);
        return exerciseMuscleGroup;
    }

    private ExerciseMuscleGroup mapRowToExerciseMuscleGroup(ResultSet rs) throws SQLException {
        return new ExerciseMuscleGroup(
                UUID.fromString(rs.getString("id")),
                UUID.fromString(rs.getString("exercise_id")),
                UUID.fromString(rs.getString("muscle_group_id")),
                rs.getBoolean("is_primary"));
    }
}