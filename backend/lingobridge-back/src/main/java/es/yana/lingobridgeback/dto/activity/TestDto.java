package es.yana.lingobridgeback.dto.activity;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private List<QuestionDto> questions;
}
