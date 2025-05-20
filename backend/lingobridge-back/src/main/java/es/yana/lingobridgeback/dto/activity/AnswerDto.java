package es.yana.lingobridgeback.dto.activity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDto {
    private Long questionId;
    private Long selectedOptionId;
}
