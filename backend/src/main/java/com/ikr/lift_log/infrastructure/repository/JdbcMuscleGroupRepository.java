package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.domain.repository.MuscleGroupRepository;
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
public class JdbcMuscleGroupRepository implements MuscleGroupRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcMuscleGroupRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<MuscleGroup> findAll() {
        String sql = "SELECT id, name, created_at FROM public.muscle_groups ORDER BY name";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToMuscleGroup(rs));
    }

    @Override
    public Optional<MuscleGroup> findById(UUID id) {
        String sql = "SELECT id, name, created_at FROM public.muscle_groups WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            MuscleGroup muscleGroup = jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> mapRowToMuscleGroup(rs));
            return Optional.ofNullable(muscleGroup);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
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
        String sql = "INSERT INTO public.muscle_groups (name) VALUES (:name) RETURNING id, created_at";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("name", muscleGroup.getName());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder);

        UUID id = UUID.fromString(keyHolder.getKeys().get("id").toString());
        muscleGroup.setId(id);

        java.sql.Timestamp createdAt = (java.sql.Timestamp) keyHolder.getKeys().get("created_at");
        muscleGroup.setCreatedAt(createdAt.toInstant().atZone(java.time.ZoneId.systemDefault()));

        return muscleGroup;
    }

    private MuscleGroup update(MuscleGroup muscleGroup) {
        String sql = "UPDATE public.muscle_groups SET name = :name WHERE id = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", muscleGroup.getId())
                .addValue("name", muscleGroup.getName());

        jdbcTemplate.update(sql, params);
        return muscleGroup;
    }

    private MuscleGroup mapRowToMuscleGroup(ResultSet rs) throws SQLException {
        return new MuscleGroup(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
    }
}