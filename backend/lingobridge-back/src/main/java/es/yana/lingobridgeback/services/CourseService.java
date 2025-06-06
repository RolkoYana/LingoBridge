package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.course.AvailableCourseDto;
import es.yana.lingobridgeback.dto.course.CourseDto;
import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final AppUserRepository appUserRepository;

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


    public List<Course> getPendingApprovalCourse(){
        return courseRepository.findByApproved(false);
    }

    public List<CourseDto> getCoursesByTeacher(String teacherUsername) {
        List<Course> courses = courseRepository.findByTeacherUsername(teacherUsername);
        // mapea Course a CourseDTo para pasar a front
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

    // ver estudiantes de un curso de profesor
    public List<StudentDto> getStudentsOfCourseByTeacher(Long courseId, String teacherUsername) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (courseOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado");
        }

        Course course = courseOpt.get();

        if (!course.getTeacher().getUsername().equals(teacherUsername)) {
            throw new AccessDeniedException("No tienes acceso a este curso");
        }

        return course.getStudents().stream()
                .map(student -> new StudentDto(
                        student.getId(),
                        student.getName(),
                        student.getSurname(),
                        student.getUsername(),
                        course.getName()
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

    public List<CourseDto> getCoursesByStudent(String studentUsername) {
        AppUser student = appUserRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Estudiante no encontrado"));

        return student.getCoursesEnrolled().stream()
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getName(),
                        course.getDescription(),
                        course.getTeacher().getUsername(),
                        course.isCompleted()
                ))
                .collect(Collectors.toList());
    }


    // cursos disponibles para estudiante
    public List<AvailableCourseDto> getAvailableCoursesForStudent() {
        return courseRepository.findActiveCourse().stream()
                .map(AvailableCourseDto::new)
                .collect(Collectors.toList());
    }

    // inscribirse en el curso
    public void enrollInCourse(Long courseId, String username) {
        AppUser student = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        if (course.isCompleted()) {
            throw new IllegalStateException("No puedes inscribirte en un curso completado.");
        }

        if (course.getStudents().contains(student)) {
            throw new IllegalStateException("Ya estás inscrito en este curso.");
        }

        course.getStudents().add(student);
        courseRepository.save(course);
    }

    // Contar todos los cursos
    public Long countAllCourses() {
        return courseRepository.count();
    }

    // Contar cursos completados
    public Long countCompletedCourses() {
        return courseRepository.countByCompleted(true);
    }

    // Contar cursos pendientes (no aprobados)
    public Long countPendingCourses() {
        return courseRepository.countByApproved(false);
    }


}
