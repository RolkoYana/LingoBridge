package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.CourseDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.services.AppUserService;
import es.yana.lingobridgeback.services.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
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
    @GetMapping("/courses")
    public List<CourseDto> getAllCourses(){
        List<Course> courses = courseService.findAll();
        return courses.stream().map(courseService::convertToDto).toList();
    }

    // ver cursos de profesor
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/courses")
    public ResponseEntity<List<CourseDto>> getTeacherCourses(@AuthenticationPrincipal UserDetails userDetails){
        String teacherUsername = userDetails.getUsername();  // obtiene el username del usuario autenticado
        List<CourseDto> courses = courseService.getCoursesByTeacher(teacherUsername);
        return ResponseEntity.ok(courses);
    }

    // obtener un curso de profesor (al hacer clir ir a curso)
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/course/{id}")
    public ResponseEntity<List<Course>> getCoursesByTeacher(@PathVariable Long id){
        AppUser teacher = appUserService.findById(id);
        if(teacher == null || !teacher.getRoles().contains(Role.TEACHER)){
            return ResponseEntity.badRequest().body(List.of());
        }
        return ResponseEntity.ok(List.copyOf(teacher.getCourseGiven()));
    }

    // ver cursos de un estudiante
    @PreAuthorize("hasAuthority('STUDENT')")
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
    /*
    despues de crear el curso se queda marcado como "pendiente de aprobar"
    se almacena en BD para que el admin pueda revisarlo
    admin tendra un endpoint para apribar o rechazar cursos
     */
    /* para hacer prueba en Postman -->
    solicitud -->
        http://localhost:8080/api/create-course?teacherUsername=profesor1
    cuerpo --> raw JSON :
        {
  "name": "Curso de JavaScript Avanzado",
  "description": "Curso intensivo para aprender JavaScript en profundidad"
}
    */
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/create-course")
    public ResponseEntity<?> createCourse(@RequestBody Course course, @RequestParam String teacherUsername){
        AppUser teacher = appUserService.findByUsername(teacherUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Profesor no encontrado"));

        if(!teacher.getRoles().contains(Role.TEACHER)){
            return ResponseEntity.badRequest().body(Map.of("error", "Solo los profesores pueden crear el curso"));
        }

        if (course.getType() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "El tipo de curso no puede ser nulo"));
        }

        course.setTeacher(teacher); // asigna el profesor al curso
        course.setApproved(false); // queda pendiente de aprobar
        course.setDescription(course.getDescription()); // guarda la descripcion

        Course savedCourse = courseService.save(course);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Curso creado correctamente, pendiente de aprobación",
                        "courseId", savedCourse.getId(),
                        "name", savedCourse.getName(),
                        "description", savedCourse.getDescription()
                )
                );
    }

    // obtener cursos pendientes de aprobacion
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/pending-courses")
    public ResponseEntity<List<Course>> getPendingCourses(){
        List<Course> pendingCourses = courseService.getPendingApprovalCourse();
        return ResponseEntity.ok(pendingCourses);
    }

    // aprobar curso (admin)
    /*
    busca el curso por id y cambia el estado

     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/approve-course/{id}")
    public ResponseEntity<?> approveCourse(@PathVariable Long id){
        Course course = courseService.findById(id);
        if(course == null){
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }
        if(course.isApproved()){
            return ResponseEntity.badRequest().body(Map.of("error", "El curso ya esta aprobado"));
        }
        course.setApproved(true); // cambia el estado a aprobado
        courseService.save(course); // guarda el curso con nuevo estado

        return ResponseEntity.ok(Map.of(
                "message", "Curso aprobado",
                "courseId", course.getId()
        ));
    }

    // inscribirse en un curso (estudiante)
    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("/student/enroll-course/{courseId}")
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
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/assign-course/{courseId}")
    public ResponseEntity<?> assignCourse(@PathVariable Long courseId, @RequestParam String teacherUsername){
        Course course = courseService.findById(courseId);
        if (course == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }

        AppUser teacher = appUserService.findByUsername(teacherUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Profesor no encontrado"));

        if (!teacher.getRoles().contains(Role.TEACHER)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El usuario no es un profesor válido"));
        }

        course.setTeacher(teacher); // asigna manualmente el profesor al curso
        courseService.save(course); // guarda los cambios en la BD

        return ResponseEntity.ok(Map.of("message", "Curso asignado correctamente", "courseId", course.getId(), "teacher", teacher.getUsername()));
    }

    // finalizar curso (admin)
    @PreAuthorize("hasAuthority('TEACHER')")
    @PutMapping("/admin/finalize-course/{courseId}")
    public ResponseEntity<?> finalizeCourse(@PathVariable Long courseId){
        Course course = courseService.findById(courseId);

        if(course == null){
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }

        // finalizar el curso y registrar fecha de cierre
        course.setCompleted(true);
        course.setCompletedAt(new Date());
        courseService.save(course);

        return ResponseEntity.ok(Map.of("message", "Curso finalizado correctamente"));

    }


}
