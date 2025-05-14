package es.yana.lingobridgeback.dto.user;

import es.yana.lingobridgeback.entities.AppUser;
import lombok.*;

// este  DTo muestra informacion de estudiantes en el panel de profesor en la seccion "mis estudiantes"

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

    private Long id;
    private String name;
    private String surname;
    private String username;
    private String courseName;

}
