package com.ikr.lift_log.domain.repository;

import com.ikr.lift_log.domain.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    List<User> findAll();

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    User save(User user);
}