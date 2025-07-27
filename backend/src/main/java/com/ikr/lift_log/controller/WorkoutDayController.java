package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.WorkoutDay;
import com.ikr.lift_log.service.WorkoutDayService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workout-days")
public class WorkoutDayController {

    private final WorkoutDayService workoutDayService;

    public WorkoutDayController(WorkoutDayService workoutDayService) {
        this.workoutDayService = workoutDayService;
    }

    @GetMapping
    public ResponseEntity<List<WorkoutDay>> getWorkoutDays(
            @RequestParam(required = true) UUID userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        if (fromDate != null && toDate != null) {
            List<WorkoutDay> workoutDays = workoutDayService.getWorkoutDaysByUserIdAndDateRange(userId, fromDate,
                    toDate);
            return ResponseEntity.ok(workoutDays);
        } else {
            List<WorkoutDay> workoutDays = workoutDayService.getWorkoutDaysByUserId(userId);
            return ResponseEntity.ok(workoutDays);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDay> getWorkoutDayById(@PathVariable UUID id) {
        return workoutDayService.getWorkoutDayById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WorkoutDay> createWorkoutDay(@RequestBody WorkoutDay workoutDay) {
        WorkoutDay createdWorkoutDay = workoutDayService.createWorkoutDay(workoutDay);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdWorkoutDay.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdWorkoutDay);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDay> updateWorkoutDay(@PathVariable UUID id, @RequestBody WorkoutDay workoutDay) {
        return workoutDayService.updateWorkoutDay(id, workoutDay)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutDay(@PathVariable UUID id) {
        if (workoutDayService.deleteWorkoutDay(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<WorkoutDay>> getWorkoutDaysForCalendar(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam(required = true) UUID userId) {

        // month-1 because frontend sends 1-based month, but LocalDate expects 0-based
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<WorkoutDay> workoutDays = workoutDayService.getWorkoutDaysByUserIdAndDateRange(userId, startDate,
                endDate);
        return ResponseEntity.ok(workoutDays);
    }
}