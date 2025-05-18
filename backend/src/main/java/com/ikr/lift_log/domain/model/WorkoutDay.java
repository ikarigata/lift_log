package com.ikr.lift_log.domain.model;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

public class WorkoutDay {
    private UUID id;
    private UUID userId;
    private LocalDate date;
    private String title;
    private String notes;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // コンストラクタ
    public WorkoutDay() {
    }

    public WorkoutDay(UUID id, UUID userId, LocalDate date, String title, String notes,
            ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.title = title;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ゲッターとセッター
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}