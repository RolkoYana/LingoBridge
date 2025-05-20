package es.yana.lingobridgeback.dto.activity;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ActivityWithQuestionsDto {
    private String title;
    private String description;
    private LocalDate dueDate;
    private List<QuestionDto> questions;
}
