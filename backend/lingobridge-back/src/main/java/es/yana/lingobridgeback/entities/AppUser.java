package es.yana.lingobridgeback.entities;

import es.yana.lingobridgeback.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private String name;
    private String surname;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true)
    private String email;
    private String password;
    @ElementCollection(targetClass = Role.class) // indica que es una coleccion de elementos embebidos (no una relacion con otra entidad)
    @Enumerated(EnumType.STRING) // almacena los valores del enum Role como cadenas de texto en la BD
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id")) // crea una tabla separada donde cada usuario puede tener varios roles
    private List<Role> roles;
}
