package es.yana.lingobridgeback.dto.user;

import es.yana.lingobridgeback.dto.CourseDto;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.entities.Language;
import es.yana.lingobridgeback.enums.Role;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    @NotNull
    @NotEmpty
    private String name;
    @NotNull
    @NotEmpty
    private String surname;
    @NotNull
    @NotEmpty
    private String username;
    @NotNull
    @NotEmpty
    private String password;
    @NotNull
    @NotEmpty
    private String passwordConfirm;
    @NotNull
    private String email;
    @NotNull
    private List<Role> roles;

    private List<CourseDto> courseGiven;
    private List<CourseDto> coursesEnrolled;
    private Language languageTaught;
}
