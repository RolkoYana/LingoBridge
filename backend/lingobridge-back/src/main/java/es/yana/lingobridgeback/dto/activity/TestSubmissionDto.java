package es.yana.lingobridgeback.dto.activity;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestSubmissionDto {
    private List<AnswerDto> answers;
}
