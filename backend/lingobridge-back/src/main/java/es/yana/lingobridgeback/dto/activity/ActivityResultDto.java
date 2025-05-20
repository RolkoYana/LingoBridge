package es.yana.lingobridgeback.dto.activity;

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
}
