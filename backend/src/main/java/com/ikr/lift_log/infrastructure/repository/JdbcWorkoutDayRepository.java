package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutDay;
import com.ikr.lift_log.domain.repository.WorkoutDayRepository;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcWorkoutDayRepository implements WorkoutDayRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcWorkoutDayRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<WorkoutDay> findAll() {
        String sql = "SELECT id, user_id, date, title, notes, created_at, updated_at FROM public.workout_days ORDER BY date DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToWorkoutDay(rs));
    }

    @Override
    public List<WorkoutDay> findByUserId(UUID userId) {
        String sql = "SELECT id, user_id, date, title, notes, created_at, updated_at FROM public.workout_days WHERE user_id = :userId ORDER BY date DESC";
        var params = new MapSqlParameterSource().addValue("userId", userId);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToWorkoutDay(rs));
    }

    @Override
    public List<WorkoutDay> findByUserIdAndDateBetween(UUID userId, LocalDate fromDate, LocalDate toDate) {
        String sql = "SELECT id, user_id, date, title, notes, created_at, updated_at FROM public.workout_days " +
                "WHERE user_id = :userId AND date BETWEEN :fromDate AND :toDate ORDER BY date DESC";
        var params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("fromDate", fromDate)
                .addValue("toDate", toDate);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToWorkoutDay(rs));
    }

    @Override
    public Optional<WorkoutDay> findById(UUID id) {
        String sql = "SELECT id, user_id, date, title, notes, created_at, updated_at FROM public.workout_days WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);

        try {
            WorkoutDay workoutDay = jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> mapRowToWorkoutDay(rs));
            return Optional.ofNullable(workoutDay);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
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
        String sql = "DELETE FROM public.workout_days WHERE id = :id";
        var params = new MapSqlParameterSource().addValue("id", id);
        jdbcTemplate.update(sql, params);
    }

    private WorkoutDay insert(WorkoutDay workoutDay) {
        String sql = "INSERT INTO public.workout_days (user_id, date, title, notes, created_at, updated_at) " +
                "VALUES (:userId, :date, :title, :notes, :createdAt, :updatedAt) RETURNING id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", workoutDay.getUserId())
                .addValue("date", workoutDay.getDate())
                .addValue("title", workoutDay.getTitle())
                .addValue("notes", workoutDay.getNotes())
                .addValue("createdAt", workoutDay.getCreatedAt())
                .addValue("updatedAt", workoutDay.getUpdatedAt());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(sql, params, keyHolder);

        UUID id = UUID.fromString(keyHolder.getKeys().get("id").toString());
        workoutDay.setId(id);

        return workoutDay;
    }

    private WorkoutDay update(WorkoutDay workoutDay) {
        String sql = "UPDATE public.workout_days SET user_id = :userId, date = :date, title = :title, " +
                "notes = :notes, updated_at = :updatedAt WHERE id = :id";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", workoutDay.getId())
                .addValue("userId", workoutDay.getUserId())
                .addValue("date", workoutDay.getDate())
                .addValue("title", workoutDay.getTitle())
                .addValue("notes", workoutDay.getNotes())
                .addValue("updatedAt", workoutDay.getUpdatedAt());

        jdbcTemplate.update(sql, params);
        return workoutDay;
    }

    private WorkoutDay mapRowToWorkoutDay(ResultSet rs) throws SQLException {
        return new WorkoutDay(
                UUID.fromString(rs.getString("id")),
                UUID.fromString(rs.getString("user_id")),
                rs.getDate("date").toLocalDate(),
                rs.getString("title"),
                rs.getString("notes"),
                rs.getTimestamp("created_at").toInstant().atZone(java.time.ZoneId.systemDefault()),
                rs.getTimestamp("updated_at").toInstant().atZone(java.time.ZoneId.systemDefault()));
    }
}