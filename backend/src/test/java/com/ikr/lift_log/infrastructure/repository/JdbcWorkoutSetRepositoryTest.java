package com.ikr.lift_log.infrastructure.repository;

import com.ikr.lift_log.domain.model.WorkoutSet;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.ikr.lift_log.jooq.tables.Users.USERS;
import static com.ikr.lift_log.jooq.tables.Exercises.EXERCISES;
import static com.ikr.lift_log.jooq.tables.WorkoutDays.WORKOUT_DAYS;
import static com.ikr.lift_log.jooq.tables.WorkoutRecords.WORKOUT_RECORDS;
import static com.ikr.lift_log.jooq.tables.MuscleGroups.MUSCLE_GROUPS;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class JdbcWorkoutSetRepositoryTest {

    @Autowired
    private JdbcWorkoutSetRepository workoutSetRepository;

    @Autowired
    private DSLContext dsl;

    private UUID testUserId;
    private UUID testMuscleGroupId;
    private UUID testExerciseId;
    private UUID testWorkoutDayId;
    private UUID testWorkoutRecordId;

    @BeforeEach
    void setUp() {
        // テスト用データを作成
        testUserId = UUID.randomUUID();
        testMuscleGroupId = UUID.randomUUID();
        testExerciseId = UUID.randomUUID();
        testWorkoutDayId = UUID.randomUUID();
        testWorkoutRecordId = UUID.randomUUID();
        
        ZonedDateTime now = ZonedDateTime.now();
        
        // ユーザーを作成
        dsl.insertInto(USERS)
                .set(USERS.ID, testUserId)
                .set(USERS.NAME, "Test User")
                .set(USERS.EMAIL, "test-" + testUserId + "@example.com")
                .set(USERS.PASSWORD_HASH, "password")
                .set(USERS.CREATED_AT, now.toOffsetDateTime())
                .execute();
        
        // 筋肉群を作成
        dsl.insertInto(MUSCLE_GROUPS)
                .set(MUSCLE_GROUPS.ID, testMuscleGroupId)
                .set(MUSCLE_GROUPS.NAME, "Test Muscle Group")
                .set(MUSCLE_GROUPS.CREATED_AT, now.toOffsetDateTime())
                .execute();
        
        // エクササイズを作成
        dsl.insertInto(EXERCISES)
                .set(EXERCISES.ID, testExerciseId)
                .set(EXERCISES.USER_ID, testUserId)
                .set(EXERCISES.NAME, "Test Exercise")
                .set(EXERCISES.DESCRIPTION, "Test Description")
                .set(EXERCISES.MUSCLE_GROUP_ID, testMuscleGroupId)
                .set(EXERCISES.CREATED_AT, now.toOffsetDateTime())
                .execute();
        
        // ワークアウト日を作成
        dsl.insertInto(WORKOUT_DAYS)
                .set(WORKOUT_DAYS.ID, testWorkoutDayId)
                .set(WORKOUT_DAYS.USER_ID, testUserId)
                .set(WORKOUT_DAYS.DATE, now.toLocalDate())
                .set(WORKOUT_DAYS.TITLE, "Test Workout Day")
                .set(WORKOUT_DAYS.CREATED_AT, now.toOffsetDateTime())
                .set(WORKOUT_DAYS.UPDATED_AT, now.toOffsetDateTime())
                .execute();
        
        // ワークアウト記録を作成
        dsl.insertInto(WORKOUT_RECORDS)
                .set(WORKOUT_RECORDS.ID, testWorkoutRecordId)
                .set(WORKOUT_RECORDS.WORKOUT_DAY_ID, testWorkoutDayId)
                .set(WORKOUT_RECORDS.EXERCISE_ID, testExerciseId)
                .set(WORKOUT_RECORDS.NOTES, "Test memo")
                .set(WORKOUT_RECORDS.CREATED_AT, now.toOffsetDateTime())
                .set(WORKOUT_RECORDS.UPDATED_AT, now.toOffsetDateTime())
                .execute();
    }

    @Test
    void save_正常なWorkoutSet_保存される() {
        // Given
        WorkoutSet workoutSet = new WorkoutSet(
            null,
            testWorkoutRecordId,
            10,
            2,  // subReps as int
            new BigDecimal("80.5"),
            null,
            null
        );

        // When
        WorkoutSet savedWorkoutSet = workoutSetRepository.save(workoutSet);

        // Then
        assertThat(savedWorkoutSet.getId()).isNotNull();
        assertThat(savedWorkoutSet.getWorkoutRecordId()).isEqualTo(testWorkoutRecordId);
        assertThat(savedWorkoutSet.getReps()).isEqualTo(10);
        assertThat(savedWorkoutSet.getSubReps()).isEqualTo(2);
        assertThat(savedWorkoutSet.getWeight()).isEqualTo(new BigDecimal("80.5"));
        assertThat(savedWorkoutSet.getCreatedAt()).isNotNull();
        assertThat(savedWorkoutSet.getUpdatedAt()).isNotNull();
    }

    @Test
    void save_subRepsが0のWorkoutSet_保存される() {
        // Given
        WorkoutSet workoutSet = new WorkoutSet(
            null,
            testWorkoutRecordId,
            8,
            0,  // subReps = 0
            new BigDecimal("75.0"),
            null,
            null
        );

        // When
        WorkoutSet savedWorkoutSet = workoutSetRepository.save(workoutSet);

        // Then
        assertThat(savedWorkoutSet.getSubReps()).isEqualTo(0);
    }

    @Test
    void findById_存在するID_WorkoutSetを返す() {
        // Given
        WorkoutSet workoutSet = new WorkoutSet(
            null,
            testWorkoutRecordId,
            12,
            3,
            new BigDecimal("90.0"),
            null,
            null
        );
        WorkoutSet savedWorkoutSet = workoutSetRepository.save(workoutSet);

        // When
        Optional<WorkoutSet> found = workoutSetRepository.findById(savedWorkoutSet.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getReps()).isEqualTo(12);
        assertThat(found.get().getSubReps()).isEqualTo(3);
        assertThat(found.get().getWeight().compareTo(new BigDecimal("90.0"))).isEqualTo(0);
    }

    @Test
    void findByWorkoutRecordId_正常なID_WorkoutSetリストを返す() {
        // Given
        WorkoutSet workoutSet1 = new WorkoutSet(
            null,
            testWorkoutRecordId,
            10,
            1,
            new BigDecimal("80.0"),
            null,
            null
        );
        WorkoutSet workoutSet2 = new WorkoutSet(
            null,
            testWorkoutRecordId,
            8,
            0,
            new BigDecimal("85.0"),
            null,
            null
        );
        
        workoutSetRepository.save(workoutSet1);
        workoutSetRepository.save(workoutSet2);

        // When
        List<WorkoutSet> workoutSets = workoutSetRepository.findByWorkoutRecordId(testWorkoutRecordId);

        // Then
        assertThat(workoutSets).hasSize(2);
        assertThat(workoutSets.get(0).getSubReps()).isEqualTo(1);
        assertThat(workoutSets.get(1).getSubReps()).isEqualTo(0);
    }

    @Test
    void update_存在するWorkoutSet_更新される() {
        // Given
        WorkoutSet workoutSet = new WorkoutSet(
            null,
            testWorkoutRecordId,
            10,
            2,
            new BigDecimal("80.0"),
            null,
            null
        );
        WorkoutSet savedWorkoutSet = workoutSetRepository.save(workoutSet);
        
        WorkoutSet updateWorkoutSet = new WorkoutSet(
            savedWorkoutSet.getId(),
            testWorkoutRecordId,
            12,
            5,  // subReps updated
            new BigDecimal("85.0"),
            savedWorkoutSet.getCreatedAt(),
            null
        );

        // When
        WorkoutSet updatedWorkoutSet = workoutSetRepository.save(updateWorkoutSet);

        // Then
        assertThat(updatedWorkoutSet.getId()).isEqualTo(savedWorkoutSet.getId());
        assertThat(updatedWorkoutSet.getReps()).isEqualTo(12);
        assertThat(updatedWorkoutSet.getSubReps()).isEqualTo(5);
        assertThat(updatedWorkoutSet.getWeight().compareTo(new BigDecimal("85.0"))).isEqualTo(0);
    }
}