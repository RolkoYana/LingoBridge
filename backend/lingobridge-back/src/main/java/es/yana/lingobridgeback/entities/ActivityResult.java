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
    private boolean autoCorrected;// si es autoevaluacion (test)
    private String feedback;
    private String textAnswer; // comentario breve al hacer la entrega de tarea
    private String fileName;
    @Lob // Large Object,+ byte[]  --> guarda archivo BLOB (Binary Large Object) - PDF, img, etc
    private byte[] fileData;
}
