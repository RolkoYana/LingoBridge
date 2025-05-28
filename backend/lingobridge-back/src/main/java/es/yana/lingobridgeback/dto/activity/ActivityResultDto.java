package es.yana.lingobridgeback.dto.activity;

import es.yana.lingobridgeback.entities.ActivityResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityResultDto {
    private Long id;
    private Double score;
    private boolean completed;
    private boolean autoCorrected;
    private String feedback;
    private LocalDate completedAt;
    private String textAnswer;
    private String fileName;

    public ActivityResultDto(ActivityResult result) {
        this.id = result.getId();
        this.score = result.getScore();
        this.completed = result.isCompleted();
        this.autoCorrected = result.isAutoCorrected();
        this.feedback = result.getFeedback();
        this.completedAt = result.getCompletedAt();
        this.textAnswer = result.getTextAnswer();
        this.fileName = result.getFileName();
    }
}
