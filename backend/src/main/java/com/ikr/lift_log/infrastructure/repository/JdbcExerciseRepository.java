package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
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

    private Exercise mapRowToExercise(ResultSet rs) throws SQLException {
        return new Exercise(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getString("description"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
    }
}