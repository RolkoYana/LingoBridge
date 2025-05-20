package es.yana.lingobridgeback.dto.user;

import es.yana.lingobridgeback.dto.course.CourseDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.enums.Role;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String password;
    private String passwordConfirm;
    private String email;
    private List<Role> roles;

    private List<CourseDto> courseGiven;
    private List<CourseDto> coursesEnrolled;
    //private Language languageTaught;


    //contructor adicional para la tabla de alumnos en el panel de profesor
    public UserDto(String name, String surname, String courseName) {
        this.name = name;
        this.surname = surname;
        this.coursesEnrolled = List.of(new CourseDto(courseName));
    }

    public UserDto(Long id, String name, String surname, String username){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
    }

    public UserDto(Long id, String name, String surname, String username, String email, List<String> roleNames) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.roles = roleNames.stream().map(Role::valueOf).collect(Collectors.toList());
    }

    public UserDto(String name, String surname){
        this.name = name;
        this.surname = surname;
    }






}
