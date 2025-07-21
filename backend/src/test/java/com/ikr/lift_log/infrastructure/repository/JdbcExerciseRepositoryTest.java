package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.Exercise;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.Exercises.EXERCISES;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class JdbcExerciseRepositoryTest {

    @Autowired
    private JdbcExerciseRepository exerciseRepository;

    @Autowired
    private DSLContext dsl;

    @BeforeEach
    void setUp() {
        // テスト前にデータをクリア
        dsl.deleteFrom(EXERCISES).execute();
    }

    @Test
    void findAll_空のテーブル_空リストを返す() {
        // When
        List<Exercise> exercises = exerciseRepository.findAll();

        // Then
        assertThat(exercises).isEmpty();
    }

    @Test
    void save_正常なエクササイズ_保存される() {
        // Given
        Exercise exercise = new Exercise(null, "Bench Press", "Chest exercise", null);

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
        // Given
        Exercise savedExercise = exerciseRepository.save(
            new Exercise(null, "Squat", "Leg exercise", null)
        );

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
    void findAll_複数のエクササイズ_名前順でソートして返す() {
        // Given
        exerciseRepository.save(new Exercise(null, "Deadlift", "Full body exercise", null));
        exerciseRepository.save(new Exercise(null, "Bench Press", "Chest exercise", null));
        exerciseRepository.save(new Exercise(null, "Squat", "Leg exercise", null));

        // When
        List<Exercise> exercises = exerciseRepository.findAll();

        // Then
        assertThat(exercises).hasSize(3);
        assertThat(exercises.get(0).getName()).isEqualTo("Bench Press");
        assertThat(exercises.get(1).getName()).isEqualTo("Deadlift");
        assertThat(exercises.get(2).getName()).isEqualTo("Squat");
    }

    @Test
    void update_存在するID_更新される() {
        // Given
        Exercise savedExercise = exerciseRepository.save(
            new Exercise(null, "Pull Up", "Back exercise", null)
        );
        Exercise updateData = new Exercise(null, "Pull Up Modified", "Updated back exercise", null);

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
        Exercise updateData = new Exercise(null, "Test", "Test description", null);

        // When & Then
        assertThatThrownBy(() -> exerciseRepository.update(nonExistentId, updateData))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Exercise not found with id:");
    }

    @Test
    void deleteById_存在するID_削除される() {
        // Given
        Exercise savedExercise = exerciseRepository.save(
            new Exercise(null, "Push Up", "Bodyweight exercise", null)
        );

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