package es.yana.lingobridge.entities;

import java.util.*;
import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Professor extends User{
    private String language;
    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL)
    private List<Course> courses;
}
