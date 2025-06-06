package es.yana.lingobridgeback.dto.activity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDto {
    private Long id;
    private String text;
    private boolean correct; // profesor lo usa, no se muestra para los estudiantes
}
