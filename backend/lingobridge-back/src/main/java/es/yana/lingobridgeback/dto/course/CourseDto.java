package es.yana.lingobridgeback.dto.course;

import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.CourseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto {
    private Long id;
    private String name;
    private String description;
    private String teacherUsername;
    private Boolean approved;
    private Boolean completed;
    private Date completedAt;
    private CourseType type;
    private Integer numberOfStudents;
    private UserDto teacher;


    public CourseDto(Long id, String name, String description, String teacherUsername, Boolean approved, Boolean completed, Date completedAt, CourseType type, Integer numerOfStudents) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teacherUsername = teacherUsername;
        this.approved = approved;
        this.completed = completed;
        this.completedAt = completedAt;
        this.type = type;
        this.numberOfStudents = numerOfStudents;
    }

    public CourseDto(String name){
        this.name = name;
    }

    public CourseDto(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public CourseDto(Long id, String name, String description, String teacherUsername, CourseType type, Integer numberOfStudents){
        this.id = id;
        this.name = name;
        this.description = description;
        this.teacherUsername = teacherUsername;
        this.type = type;
        this.numberOfStudents = numberOfStudents;
    }

    public CourseDto(Long id, String name, boolean approved, boolean completed, UserDto teacher){
        this.id = id;
        this.name = name;
        this.approved = approved;
        this.completed = completed;
        this.teacher = teacher;
    }

    // para mostrar curso en panel de estudiante
    public CourseDto(Long id, String name, String description, String teacherUsername, Boolean completed){
        this.id = id;
        this.name = name;
        this.description = description;
        this.teacherUsername = teacherUsername;
        this.completed = completed;
    }

    // para mostrar info de curso en la web de un curso en concreto (entrando desde panel de estudiante)
    public CourseDto(Course course){
        this.id = course.getId();
        this.name = course.getName();
        this.description = course.getDescription();
        this.teacherUsername = course.getTeacher().getUsername();
    }




}
