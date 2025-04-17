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
    private String title; // para describir el test
    private Double note;
    @Column(nullable = false)
    private boolean isAutoEvaluation; // true -> alumno la realiza y se autocorrige; false -> profesor la crea y evalua manualmente
    private boolean completed;
    private LocalDate evaluationDate;
    @ManyToOne
    private Course course;
    @ManyToOne
    private User student;


}
