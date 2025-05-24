package es.yana.lingobridgeback.dto.activity;


import lombok.*;

import java.time.LocalDate;

/*
    DTO  para la vista del profesor
 */

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherActivityResultDto {
    private Long activityResultId;
    private Long activityId;
    private String activityTitle;
    private Long studentId;
    private String studentName; // nombre + apellido
    private String studentUsername;
    private String textAnswer;
    private String fileName;
    private LocalDate submittedAt;
    private boolean completed;
    private String feedback;
    private Double score;


}
