package es.yana.lingobridgeback.entities;


import es.yana.lingobridgeback.enums.ActivityType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

/*
    profesores crean actividades y se muestran en el frontend
 */

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private ActivityType type;

    private LocalDate dueDate;
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

}
