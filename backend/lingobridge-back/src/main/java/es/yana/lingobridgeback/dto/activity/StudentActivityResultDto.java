package es.yana.lingobridgeback.dto.activity;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentActivityResultDto {
    private Long activityResultId;
    private String activityTitle;
    private String courseName;
    private Double score;
    private String feedback;
    private LocalDate completedAt;
    private String teacherName; // profesor que evaluó o que da el curso
}
