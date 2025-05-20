package es.yana.lingobridgeback.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/*
    guardar resultados individuales de alumnos
 */

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResult {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @ManyToOne(optional = false)
    @JoinColumn(name="student_id")
    private AppUser student;

    private Double score;
    private LocalDate completedAt;
    private boolean completed;
    // si es autoevaluacion o corregida por profesor
    private boolean autoCorrected;

    private String feedback;

}
