package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.Exercise;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.Exercises.EXERCISES;
import static com.ikr.lift_log.jooq.tables.MuscleGroups.MUSCLE_GROUPS;
import static com.ikr.lift_log.jooq.tables.Users.USERS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class JdbcExerciseRepositoryTest {

    @Autowired
    private JdbcExerciseRepository exerciseRepository;

    @Autowired
    private DSLContext dsl;

    private UUID testUserId;
    private UUID testMuscleGroupId;

    @BeforeEach
    void setUp() {
        // テスト用ユーザーを作成
        testUserId = UUID.randomUUID();
        dsl.insertInto(USERS)
                .set(USERS.ID, testUserId)
                .set(USERS.NAME, "Test User")
                .set(USERS.EMAIL, "test@example.com")
                .set(USERS.PASSWORD_HASH, "hash")
                .set(USERS.CREATED_AT, ZonedDateTime.now().toOffsetDateTime())
                .execute();

        // テスト用筋肉グループを作成
        testMuscleGroupId = UUID.randomUUID();
        dsl.insertInto(MUSCLE_GROUPS)
                .set(MUSCLE_GROUPS.ID, testMuscleGroupId)
                .set(MUSCLE_GROUPS.NAME, "Test Muscle Group")
                .set(MUSCLE_GROUPS.CREATED_AT, ZonedDateTime.now().toOffsetDateTime())
                .execute();
    }

    @Test
    void findById_存在しないID_空のテーブルで空のOptionalを返す() {
        // Given
        UUID nonExistentId = UUID.randomUUID();

        // When
        Optional<Exercise> found = exerciseRepository.findById(nonExistentId);

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    void save_正常なエクササイズ_保存される() {

        UUID userId = testUserId; // ユーザーIDは必要に応じて設定
        UUID exerciseId = UUID.randomUUID(); // エクササイズIDは必要に応じて設定
        ZonedDateTime createdAt = ZonedDateTime.now();
        // Given
        Exercise exercise = new Exercise(exerciseId, userId, "Bench Press", "Chest exercise", testMuscleGroupId, createdAt);

        // When
        Exercise savedExercise = exerciseRepository.save(exercise);

        // Then
        assertThat(savedExercise.getId()).isNotNull();
        assertThat(savedExercise.getName()).isEqualTo("Bench Press");
        assertThat(savedExercise.getDescription()).isEqualTo("Chest exercise");
        assertThat(savedExercise.getCreatedAt()).isNotNull();
    }

    @Test
    void findById_存在するID_エクササイズを返す() {

        UUID userId = testUserId; // ユーザーIDは必要に応じて設定
        UUID exerciseId = UUID.randomUUID(); // エクササイズIDは必要に応じて設定
        ZonedDateTime createdAt = ZonedDateTime.now();
        // Given
        Exercise exercise = new Exercise(exerciseId, userId, "Squat", "Leg exercise", testMuscleGroupId, createdAt);

        // Given
        Exercise savedExercise = exerciseRepository.save(exercise);

        // When
        Optional<Exercise> found = exerciseRepository.findById(savedExercise.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Squat");
        assertThat(found.get().getDescription()).isEqualTo("Leg exercise");
    }

    @Test
    void findById_存在しないID_空のOptionalを返す() {
        // Given
        UUID nonExistentId = UUID.randomUUID();

        // When
        Optional<Exercise> found = exerciseRepository.findById(nonExistentId);

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    void save_複数のエクササイズ_個別に保存できる() {
        UUID userId = testUserId;
        UUID exerciseId1 = UUID.randomUUID();
        UUID exerciseId2 = UUID.randomUUID();
        ZonedDateTime createdAt = ZonedDateTime.now();
        
        // Given
        Exercise exercise1 = new Exercise(exerciseId1, userId, "Bench Press", "Chest exercise", testMuscleGroupId, createdAt);
        Exercise exercise2 = new Exercise(exerciseId2, userId, "Squat", "Leg exercise", testMuscleGroupId, createdAt);

        // When
        Exercise savedExercise1 = exerciseRepository.save(exercise1);
        Exercise savedExercise2 = exerciseRepository.save(exercise2);

        // Then
        assertThat(savedExercise1.getName()).isEqualTo("Bench Press");
        assertThat(savedExercise2.getName()).isEqualTo("Squat");
        
        Optional<Exercise> found1 = exerciseRepository.findById(savedExercise1.getId());
        Optional<Exercise> found2 = exerciseRepository.findById(savedExercise2.getId());
        
        assertThat(found1).isPresent();
        assertThat(found2).isPresent();
    }

    @Test
    void update_存在するID_更新される() {
        // Given
        UUID userId = testUserId;
        UUID exerciseId = UUID.randomUUID();
        ZonedDateTime createdAt = ZonedDateTime.now();
        
        Exercise savedExercise = exerciseRepository.save(
                new Exercise(exerciseId, userId, "Pull Up", "Back exercise", testMuscleGroupId, createdAt));
        Exercise updateData = new Exercise(null, userId, "Pull Up Modified", "Updated back exercise", testMuscleGroupId, null);

        // When
        Exercise updatedExercise = exerciseRepository.update(savedExercise.getId(), updateData);

        // Then
        assertThat(updatedExercise.getId()).isEqualTo(savedExercise.getId());
        assertThat(updatedExercise.getName()).isEqualTo("Pull Up Modified");
        assertThat(updatedExercise.getDescription()).isEqualTo("Updated back exercise");
    }

    @Test
    void update_存在しないID_例外が発生() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        UUID userId = testUserId;
        Exercise updateData = new Exercise(null, userId, "Test", "Test description", testMuscleGroupId, null);

        // When & Then
        assertThatThrownBy(() -> exerciseRepository.update(nonExistentId, updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Exercise not found with id:");
    }

    @Test
    void deleteById_存在するID_削除される() {
        // Given
        UUID userId = testUserId;
        UUID exerciseId = UUID.randomUUID();
        ZonedDateTime createdAt = ZonedDateTime.now();
        
        Exercise savedExercise = exerciseRepository.save(
                new Exercise(exerciseId, userId, "Push Up", "Bodyweight exercise", testMuscleGroupId, createdAt));

        // When
        exerciseRepository.deleteById(savedExercise.getId());

        // Then
        Optional<Exercise> found = exerciseRepository.findById(savedExercise.getId());
        assertThat(found).isEmpty();
    }

    @Test
    void deleteById_存在しないID_例外が発生() {
        // Given
        UUID nonExistentId = UUID.randomUUID();

        // When & Then
        assertThatThrownBy(() -> exerciseRepository.deleteById(nonExistentId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Exercise not found with id:");
    }
}