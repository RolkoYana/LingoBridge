package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.services.AppUserService;
import es.yana.lingobridgeback.services.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;
    private final AppUserService appUserService;

    // obtener todos los cursos
    @GetMapping("/all")
    public List<Course> getAllCourses(){
        return courseService.findAll();
    }

    // obtener cursos de un profesor
    //@PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/teacher/course/{id}")
    public ResponseEntity<List<Course>> getCoursesByTeacher(@PathVariable Long id){
        AppUser teacher = appUserService.findById(id);
        if(teacher == null || !teacher.getRoles().contains(Role.TEACHER)){
            return ResponseEntity.badRequest().body(List.of());
        }
        return ResponseEntity.ok(List.copyOf(teacher.getCourseGiven()));
    }

    // ver cursos de un estudiante
    //@PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/course/{id}")
    public ResponseEntity<List<Course>> getCoursesByStudent(@PathVariable Long id){
        AppUser student = appUserService.findById(id);
        if(student == null || !student.getRoles().contains(Role.STUDENT)){
            return ResponseEntity.badRequest().body(List.of());
        }
        List<Course> enrolledCourses = new ArrayList<>(student.getCoursesEnrolled());
        return ResponseEntity.ok(enrolledCourses);
    }

    // crear curso
    //@PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course course){
        return ResponseEntity.ok(courseService.save(course));
    }

    // obtener cursos pendientes de aprobacion
    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<Course> getPendingCourses(){
        return courseService.getPendingApprovalCourse();
    }

    // aprobar curso
    //@PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveCourse(@PathVariable Long id){
        courseService.approveCourse(id);
        return ResponseEntity.ok("Curso aprobado");
    }

    // inscribirse en un curso
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enrollCourse(@PathVariable Long courseId, @RequestParam String username){
        AppUser user = appUserService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        Course course = courseService.findById(courseId);

        if(!user.getRoles().contains(Role.STUDENT)){
            return ResponseEntity.badRequest().body(Map.of("error", "Solo los estudiantes pueden iscribirse"));
        }
        user.getCoursesEnrolled().add(course);
        appUserService.save(user); // guarda los cambios en BD

        return ResponseEntity.ok(Map.of("message", "Inscripcion exitosa"));
    }

    //asignar curso a un profesor
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{courseId}/assign")
    public ResponseEntity<?> assignCourse(@PathVariable Long courseId, @RequestParam String username){
        AppUser admin = appUserService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if(!admin.getRoles().contains(Role.ADMIN)){
            return ResponseEntity.badRequest().body(Map.of("error", "Solo los administradores pueden asignar cursos"));
        }

        Course course = courseService.findById(courseId);
        if(course == null){
            return ResponseEntity.badRequest().body(Map.of("error", "Course no encontrado"));
        }

        AppUser teacher = appUserService.findById(course.getTeacher().getId());
        if (teacher == null || !teacher.getRoles().contains(Role.TEACHER)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El usuario no es un profesor válido"));
        }

        teacher.getCourseGiven().add(course);
        appUserService.save(teacher);

        return ResponseEntity.ok(Map.of("message", "Curso asignado correctamente"));
    }

}
