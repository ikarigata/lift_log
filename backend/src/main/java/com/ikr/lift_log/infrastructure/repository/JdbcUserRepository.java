package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.domain.repository.UserRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.Users.USERS;

@Repository
public class JdbcUserRepository implements UserRepository {

    private final DSLContext dsl;

    public JdbcUserRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<User> findAll() {
        return dsl.selectFrom(USERS)
                .orderBy(USERS.NAME)
                .fetch(record -> new User(
                    record.get(USERS.ID),
                    record.get(USERS.NAME),
                    record.get(USERS.EMAIL),
                    record.get(USERS.PASSWORD_HASH),
                    record.get(USERS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Optional<User> findById(UUID id) {
        return dsl.selectFrom(USERS)
                .where(USERS.ID.eq(id))
                .fetchOptional(record -> new User(
                    record.get(USERS.ID),
                    record.get(USERS.NAME),
                    record.get(USERS.EMAIL),
                    record.get(USERS.PASSWORD_HASH),
                    record.get(USERS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return dsl.selectFrom(USERS)
                .where(USERS.EMAIL.eq(email))
                .fetchOptional(record -> new User(
                    record.get(USERS.ID),
                    record.get(USERS.NAME),
                    record.get(USERS.EMAIL),
                    record.get(USERS.PASSWORD_HASH),
                    record.get(USERS.CREATED_AT).atZoneSameInstant(java.time.ZoneId.systemDefault())
                ));
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
        UUID id = UUID.randomUUID();
        ZonedDateTime now = ZonedDateTime.now();
        
        dsl.insertInto(USERS)
                .set(USERS.ID, id)
                .set(USERS.NAME, user.getName())
                .set(USERS.EMAIL, user.getEmail())
                .set(USERS.PASSWORD_HASH, user.getPasswordHash())
                .set(USERS.CREATED_AT, now.toOffsetDateTime())
                .execute();

        return new User(id, user.getName(), user.getEmail(), user.getPasswordHash(), now);
    }

    private User update(User user) {
        int rowsAffected = dsl.update(USERS)
                .set(USERS.NAME, user.getName())
                .set(USERS.EMAIL, user.getEmail())
                .set(USERS.PASSWORD_HASH, user.getPasswordHash())
                .where(USERS.ID.eq(user.getId()))
                .execute();
        
        if (rowsAffected == 0) {
            throw new RuntimeException("User not found with id: " + user.getId());
        }

        return findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated user"));
    }
}