package es.yana.lingobridgeback.dto;

import java.time.LocalDate;

public class ActivityResultDto {
    private Long id;
    private Long activityId;
    private String activityTitle;
    private String studentUsername;
    private Double score;
    private boolean completed;
    private boolean autoCorrected;
    private String feedback;
    private LocalDate completedAt;
}
