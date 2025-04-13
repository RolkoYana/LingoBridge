package es.yana.lingobridgeback.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Student extends User{
    private LocalDate matriculationDate;
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Matriculation> matriculations;
}
