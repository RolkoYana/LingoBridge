package es.yana.lingobridgeback.dto.course;


import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.entities.Course;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

/*
    contiene los campos que queremos enviar a front cuando el profesor accede a la pagina del curso
 */

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDetailDto {
    private Long id;
    private String name;
    private String description;
    private String type;
    private boolean approved;
    private String teacherName;
    private int numberOfStudents;
    private List<StudentDto> students;

    public CourseDetailDto(Course course) {
        this.id = course.getId();
        this.name = course.getName();
        this.description = course.getDescription();
        this.type = course.getType().name();
        this.approved = course.isApproved();
        this.teacherName = course.getTeacher().getName();
        this.numberOfStudents = course.getStudents().size();

        this.students = course.getStudents().stream()
                .map(student -> new StudentDto(
                        student.getId(),
                        student.getName(),
                        student.getSurname(),
                        student.getUsername(),
                        course.getName()
                ))
                .collect(Collectors.toList());
    }
}
