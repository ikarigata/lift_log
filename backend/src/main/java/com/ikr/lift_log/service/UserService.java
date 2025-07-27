package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.domain.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(10); // strength 10を明示的に指定
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(UUID id, User user) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(user.getName());
                    existingUser.setEmail(user.getEmail());
                    if (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty()) {
                        existingUser.setPasswordHash(user.getPasswordHash());
                    }
                    return userRepository.save(existingUser);
                });
    }

    /**
     * メールアドレスとパスワードでユーザーを認証
     * 
     * @param email メールアドレス
     * @param password 平文パスワード
     * @return 認証成功した場合はUser、失敗した場合は空のOptional
     */
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }

    /**
     * メールアドレスでユーザーを検索
     * 
     * @param email メールアドレス
     * @return ユーザー
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}