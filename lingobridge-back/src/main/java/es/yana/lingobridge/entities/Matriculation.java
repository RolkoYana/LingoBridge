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
public class Matriculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Student student;
    @ManyToOne
    private Course course;
    private LocalDate matrculationDate;
}
