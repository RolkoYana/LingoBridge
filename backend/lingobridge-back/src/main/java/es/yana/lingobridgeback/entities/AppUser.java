package es.yana.lingobridgeback.entities;

import es.yana.lingobridgeback.converters.RoleConverter;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String surname;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;

    @Convert(converter = RoleConverter.class) // convierte la Set<Role> en una cadena antes de guardar en BD
    @Column(name = "roles", nullable = false)
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "teacher")
    private Set<Course> courseGiven;

    @ManyToMany(mappedBy = "students")
    private Set<Course> coursesEnrolled;

    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private Language languageTaught;
}
