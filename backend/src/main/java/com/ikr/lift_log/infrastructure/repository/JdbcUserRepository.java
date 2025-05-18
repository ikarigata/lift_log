package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.domain.repository.UserRepository;
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
public class JdbcUserRepository implements UserRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcUserRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT id, name, created_at FROM public.users ORDER BY name";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToUser(rs));
    }

    @Override
    public Optional<User> findById(UUID id) {
        String sql = "SELECT id, name, created_at FROM public.users WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            User user = jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> mapRowToUser(rs));
            return Optional.ofNullable(user);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) {
            return insert(user);
        } else {
            return update(user);
        }
    }

    private User insert(User user) {
        String sql = "INSERT INTO public.users (name) VALUES (:name) RETURNING id, created_at";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("name", user.getName());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder);

        UUID id = UUID.fromString(keyHolder.getKeys().get("id").toString());
        user.setId(id);

        java.sql.Timestamp createdAt = (java.sql.Timestamp) keyHolder.getKeys().get("created_at");
        user.setCreatedAt(createdAt.toInstant().atZone(java.time.ZoneId.systemDefault()));

        return user;
    }

    private User update(User user) {
        String sql = "UPDATE public.users SET name = :name WHERE id = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", user.getId())
                .addValue("name", user.getName());

        jdbcTemplate.update(sql, params);
        return user;
    }

    private User mapRowToUser(ResultSet rs) throws SQLException {
        return new User(
                UUID.fromString(rs.getString("id")),
                rs.getString("name"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
    }
}