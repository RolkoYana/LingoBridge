package es.yana.lingobridge.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Student extends User{
    private LocalDate matriculationDate;
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Matriculation> matriculations;
}
