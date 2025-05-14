package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.course.CourseDto;
import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
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

    // convierte Course to Dto
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
                )).toList();
    }


    public List<StudentDto> getStudentsOfCourseByTeacher(Long courseId, String teacherUsername) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (courseOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado");
        }

        Course course = courseOpt.get();

        // Verifica que el curso pertenezca al profesor autenticado
        if (!course.getTeacher().getUsername().equals(teacherUsername)) {
            throw new AccessDeniedException("No tienes acceso a este curso");
        }

        return course.getStudents().stream()
                .map(student -> new StudentDto(
                        student.getId(),
                        student.getName(),
                        student.getSurname(),
                        student.getUsername(),
                        course.getName() // Puede mantener esto para compatibilidad
                ))
                .collect(Collectors.toList());
    }

    // estadisticas - cursos por idioma
    public Map<Language, Long> countCoursesByLanguage() {
        List<Course> courses = courseRepository.findActiveCourse();

        return courses.stream()
                .filter(course -> course.getLanguage() != null)
                .collect(Collectors.groupingBy(Course::getLanguage, Collectors.counting()));
    }


}
