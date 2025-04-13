package es.yana.lingobridgeback.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    private Teacher teacher;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Material> material;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Evaluation> evaluations;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Matriculation> matriculations;
}
