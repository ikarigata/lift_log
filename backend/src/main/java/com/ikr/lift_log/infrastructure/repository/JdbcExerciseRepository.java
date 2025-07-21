package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcExerciseRepository implements ExerciseRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    // 最近のSpringBootではコンストラクタインジェクションならAutowiredは不要
    public JdbcExerciseRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Exercise> findAll() {
        String sql = "SELECT id, name, description, created_at FROM public.exercises ORDER BY name";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToExercise(rs));
    }

    @Override
    public Optional<Exercise> findById(UUID id) {
        String sql = "SELECT id, name, description, created_at FROM public.exercises WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            Exercise exercise = jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> mapRowToExercise(rs));
            return Optional.ofNullable(exercise);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Exercise save(Exercise exercise) {
        String sql = "INSERT INTO public.exercises (id, name, description, created_at) VALUES (:id, :name, :description, :created_at)";
        
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        
        var params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", exercise.getName())
                .addValue("description", exercise.getDescription())
                .addValue("created_at", java.sql.Timestamp.from(now.toInstant()));

        jdbcTemplate.update(sql, params);

        return new Exercise(id, exercise.getName(), exercise.getDescription(), now);
    }

    @Override
    public Exercise update(UUID id, Exercise exercise) {
        String sql = "UPDATE public.exercises SET name = :name, description = :description WHERE id = :id";
        
        var params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", exercise.getName())
                .addValue("description", exercise.getDescription());

        int rowsAffected = jdbcTemplate.update(sql, params);
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Exercise not found with id: " + id);
        }

        Optional<Exercise> updatedExercise = findById(id);
        return updatedExercise.orElseThrow(() -> new RuntimeException("Failed to retrieve updated exercise"));
    }

    @Override
    public void deleteById(UUID id) {
        String sql = "DELETE FROM public.exercises WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);
        
        int rowsAffected = jdbcTemplate.update(sql, params);
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Exercise not found with id: " + id);
        }
    }

    private Exercise mapRowToExercise(ResultSet rs) throws SQLException {
        return new Exercise(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("description"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
    }
}