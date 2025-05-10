package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.CourseDto;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    public Course findById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course save(Course course) {
        return courseRepository.save(course);
    }

    public void delete(Long id) {
        courseRepository.deleteById(id);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public List<Course> getPendingApprovalCourse(){
        return courseRepository.findByApproved(false);
    }

    public void approveCourse(Long id){
        Course course = courseRepository.findById(id).orElseThrow();
        course.setApproved(true);
        courseRepository.save(course);
    }

    public Optional<Course> findByName(String name){
        return courseRepository.findByName(name);
    }

//     convierte entidad a dto
    public CourseDto convertToDto(Course course) {
        return new CourseDto(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.getTeacher().getName(),
                course.getType(),
                course.getStudents().size()
        );
    }

    public List<CourseDto> getCoursesByTeacher(String teacherUsername) {
        List<Course> courses = courseRepository.findByTeacherUsername(teacherUsername);
        return courses.stream()
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getName(),
                        course.getDescription(),
                        course.getTeacher().getUsername(),
                        course.getType(),
                        course.getStudents().size()
                ))
                        .toList();
    }

}
