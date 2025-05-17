package com.ikr.lift_log.controller.dto;

import java.time.LocalDate;
import java.util.UUID;

public class WorkoutDayRequest {
    private UUID userId;
    private LocalDate date;
    private String title;
    private String notes;

    // コンストラクタ
    public WorkoutDayRequest() {
    }

    public WorkoutDayRequest(UUID userId, LocalDate date, String title, String notes) {
        this.userId = userId;
        this.date = date;
        this.title = title;
        this.notes = notes;
    }

    // ゲッターとセッター
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
}