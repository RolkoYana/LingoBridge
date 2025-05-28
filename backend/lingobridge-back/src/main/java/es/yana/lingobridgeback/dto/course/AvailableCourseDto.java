package es.yana.lingobridgeback.dto.course;

import es.yana.lingobridgeback.dto.user.UserDto;

import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.CourseType;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailableCourseDto {
    private Long id;
    private String name;
    private String description;
    private CourseType type;
    private UserDto teacher;

    public AvailableCourseDto(Course course) {
        this.id = course.getId();
        this.name = course.getName();
        this.description = course.getDescription();
        this.type = course.getType();
        this.teacher = new UserDto(course.getTeacher().getName(), course.getTeacher().getSurname());
    }
}
