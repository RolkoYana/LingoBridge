package es.yana.lingobridgeback.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import es.yana.lingobridgeback.enums.CourseType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    private boolean approved;
    @Enumerated(EnumType.STRING)
    private CourseType type;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private AppUser teacher;
    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "course_students",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<AppUser> students = new HashSet<>();
    private boolean completed;
    @Temporal(TemporalType.DATE) // se almacena en un campo Date en la BD
    private Date completedAt;



//    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
//    private List<Material> material;
//    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
//    private List<Evaluation> evaluations;
//    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
//    private List<Matriculation> matriculations;
}
