package es.yana.lingobridgeback.dto.user;

import lombok.*;

// este  DTo muestra informacion de estudiantes en el panel de profesor en la seccion "mis estudiantes"

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

    private String name;
    private String surname;
    private String username;
    private String courseName;

}
