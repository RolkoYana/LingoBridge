package es.yana.lingobridgeback.entities;


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
    @Column(nullable = false)
    private boolean isAutoEvaluation; // true -> alumno la realiza y se autocorrige; false -> profesor la crea y evalua manualmente
    private String title; // para describir el test
}
