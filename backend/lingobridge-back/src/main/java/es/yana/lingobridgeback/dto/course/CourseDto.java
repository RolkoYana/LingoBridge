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
    private String teacherName;
    private Boolean approved;
    private Boolean completed;
    private Date completedAt;
    private CourseType type;
    private Integer numberOfStudents;
    private UserDto teacher;

    public CourseDto(Long id,
                     String name,
                     String description,
                     String teacherName,
                     Boolean approved,
                     Boolean completed,
                     Date completedAt,
                     CourseType type,
                     Integer numerOfStudents) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teacherName = teacherName;
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

    public CourseDto(Long id, String name, String description, String teacherName, CourseType type, Integer numberOfStudents){
        this.id = id;
        this.name = name;
        this.description = description;
        this.teacherName = teacherName;
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



}
