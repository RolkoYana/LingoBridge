package es.yana.lingobridge.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double note;
    private LocalDate evaluationDate;
    @ManyToOne
    private Course course;
    @ManyToOne
    private Student student;

}
