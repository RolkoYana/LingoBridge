package es.yana.lingobridgeback.dto;

import es.yana.lingobridgeback.enums.CourseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto {
    private Long id;
    private String name;

    private String description;
    private String teacherName;
    //private Boolean approved;
    private CourseType type;
    private Integer numberOfStudents;

    public CourseDto(String name){
        this.name = name;
    }

    public CourseDto(Long id, String name){
        this.id = id;
        this.name = name;
    }

}
