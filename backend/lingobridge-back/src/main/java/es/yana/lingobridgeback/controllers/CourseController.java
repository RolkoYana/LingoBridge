package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.course.AvailableCourseDto;
import es.yana.lingobridgeback.dto.course.CourseDetailDto;
import es.yana.lingobridgeback.dto.course.CourseDto;
import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.services.AppUserService;
import es.yana.lingobridgeback.services.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import java.security.Principal;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;
    private final AppUserService appUserService;



    // ***** ADMIN *****

    // todos los cursos (pendientes de aprobar, activos, finalizados)
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/all-courses")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        List<Course> courses = courseService.findAll(); // Método para obtener todos los cursos

        // Convertir los cursos a DTOs
        List<CourseDto> courseDtos = courses.stream()
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getName(),
                        course.getDescription(),
                        course.getTeacher().getName(),
                        course.isApproved(),
                        course.isCompleted(),
                        course.getCompletedAt(),
                        course.getType(),
                        course.getStudents().size()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(courseDtos);
    }

    // cursos activos
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/active-courses")
    public ResponseEntity<List<CourseDto>> getActiveCourses() {
        List<CourseDto> activeCourses = courseService.findAll().stream()
                .filter(Course::isApproved)
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getName(),
                        course.isApproved(),
                        course.isCompleted(),
                        course.getTeacher() != null
                                ? new UserDto(
                                course.getTeacher().getId(),
                                course.getTeacher().getName(),
                                course.getTeacher().getSurname(),
                                course.getTeacher().getUsername())
                                : null
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(activeCourses);
    }

    // cursos pendientes de aprobacion
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/pending-courses")
    public ResponseEntity<List<CourseDto>> getPendingCourses(){
        List<Course> pendingCourses = courseService.getPendingApprovalCourse();
        List<CourseDto> courseDtos = pendingCourses.stream()
                .map(course -> new CourseDto(course, true)) // true = incluir teacher
                .toList();
        return ResponseEntity.ok(courseDtos);
    }

    // aprobar curso (admin)
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/approve-course/{courseId}")
    public ResponseEntity<?> approveCourse(@PathVariable Long courseId){
        Optional<Course> courseOpt = courseService.findById(courseId);
        // Verificar si el curso no existe
        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }

        Course course = courseOpt.get(); // Obtener el curso

        if (course.isApproved()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El curso ya está aprobado"));
        }

        course.setApproved(true); // Cambia el estado a aprobado
        courseService.save(course); // Guarda el curso con el nuevo estado

        return ResponseEntity.ok(Map.of(
                "message", "Curso aprobado",
                "courseId", course.getId()
        ));
    }

    // rechazar un curso
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/admin/reject-course/{courseId}")
    public ResponseEntity<?> rejectCourse(@PathVariable Long courseId) {
        Optional<Course> courseOpt = courseService.findById(courseId);

        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }

        courseService.delete(courseId); // elimina el curso directamente

        return ResponseEntity.ok(Map.of(
                "message", "Curso rechazado y eliminado correctamente",
                "courseId", courseId
        ));
    }

    //asignar curso a un profesor
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/assign-course/{courseId}")
    public ResponseEntity<?> assignCourse(@PathVariable Long courseId, @RequestParam String teacherUsername){
        Optional<Course> courseOpt = courseService.findById(courseId);

        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }

        Course course = courseOpt.get(); // Obtener el curso

        AppUser teacher = appUserService.findByUsername(teacherUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Profesor no encontrado"));

        if (!teacher.getRoles().contains(Role.TEACHER)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El usuario no es un profesor válido"));
        }

        course.setTeacher(teacher); // Asigna manualmente el profesor al curso
        courseService.save(course); // Guarda los cambios en la BD

        return ResponseEntity.ok(Map.of("message", "Curso asignado correctamente", "courseId", course.getId(), "teacher", teacher.getUsername()));
    }

    // finalizar curso (admin)
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/complete-course/{courseId}")
    public ResponseEntity<?> completeCourse(@PathVariable Long courseId){
        Optional<Course> courseOpt = courseService.findById(courseId);

        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Curso no encontrado"));
        }

        Course course = courseOpt.get(); // Obtener el curso

        // Finalizar el curso y registrar fecha de cierre
        course.setCompleted(true);
        course.setCompletedAt(new Date());
        courseService.save(course);

        return ResponseEntity.ok(Map.of("message", "Curso finalizado correctamente"));

    }

    // ver estadisticas
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/statistics")
    public ResponseEntity<Map<String, Object>> getAdminStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        List<Language> languages = Arrays.asList(Language.values());

        // Traducción de nombres para mostrar en frontend
        List<String> languageNames = languages.stream()
                .map(lang -> switch (lang) {
                    case ENGLISH -> "Inglés";
                    case SPANISH -> "Español";
                    case FRENCH -> "Francés";
                    case GERMAN -> "Alemán";
                }).toList();

        // Datos por idioma (existentes)
        Map<Language, Long> coursesPerLangMap = courseService.countCoursesByLanguage();
        List<Long> coursesPerLanguage = languages.stream()
                .map(lang -> coursesPerLangMap.getOrDefault(lang, 0L))
                .toList();

        Map<Language, Long> teachersPerLangMap = appUserService.countTeachersPerLanguage();
        List<Long> teachersPerLanguage = languages.stream()
                .map(lang -> teachersPerLangMap.getOrDefault(lang, 0L))
                .toList();

        Map<Language, Long> studentsPerLangMap = appUserService.countStudentsPerLanguage();
        List<Long> studentsPerLanguage = languages.stream()
                .map(lang -> studentsPerLangMap.getOrDefault(lang, 0L))
                .toList();

        // NUEVOS: Datos totales (sin totalUsers)
        Long totalTeachers = appUserService.countAllTeachers();
        Long totalStudents = appUserService.countAllStudents();
        Long totalCourses = courseService.countAllCourses();
        Long completedCourses = courseService.countCompletedCourses();
        Long pendingCourses = courseService.countPendingCourses();

        // Datos por idioma
        statistics.put("languages", languageNames);
        statistics.put("coursesPerLanguage", coursesPerLanguage);
        statistics.put("teachersPerLanguage", teachersPerLanguage);
        statistics.put("studentsPerLanguage", studentsPerLanguage);

        // Datos totales
        statistics.put("totalTeachers", totalTeachers);
        statistics.put("totalStudents", totalStudents);
        statistics.put("totalCourses", totalCourses);
        statistics.put("completedCourses", completedCourses);
        statistics.put("pendingCourses", pendingCourses);

        return ResponseEntity.ok(statistics);
    }



    // ***** PROFESOR *****

    // ver cursos de profesor
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/courses")
    public ResponseEntity<List<CourseDto>> getTeacherCourses(@AuthenticationPrincipal UserDetails userDetails){
        String teacherUsername = userDetails.getUsername();  // obtiene el username del usuario autenticado
        List<CourseDto> courses = courseService.getCoursesByTeacher(teacherUsername);
        return ResponseEntity.ok(courses);
    }

    // ir al curso seleccionado del profesor (al hacer click en "ver curso")
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/course/{courseId}")
    public ResponseEntity<CourseDetailDto> getCourseDetailsForTeacher(@PathVariable Long courseId){
        Optional<Course> courseOpt = courseService.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();

        // Validación: asegurar que el curso pertenece al profesor autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        AppUser teacher = appUserService.findByUsername(username).orElse(null);

        if (teacher == null || !course.getTeacher().getId().equals(teacher.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        CourseDetailDto courseDto = new CourseDetailDto(course);

        return ResponseEntity.ok(courseDto);
    }

    // obtener lista de estudiantes inscritos en el curso seleccionado (pagina de curso de profesor)
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/course/{courseId}/students")
    public ResponseEntity<List<StudentDto>> getStudentsOfCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String teacherUsername = userDetails.getUsername();
        List<StudentDto> students = courseService.getStudentsOfCourseByTeacher(courseId, teacherUsername);

        return ResponseEntity.ok(students);
    }

    // crear curso
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/create-course")
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

    // ***** ESTUDIANTE *****

    // ver todos cursos de estudiante
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/courses")
    public ResponseEntity<List<CourseDto>> getStudentCourses(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<CourseDto> courses = courseService.getCoursesByStudent(username);
        return ResponseEntity.ok(courses);
    }


    // ver curso de un estudiante
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/course/{courseId}")
    public ResponseEntity<CourseDto> getCourseDetailsForStudent(@PathVariable Long courseId, @AuthenticationPrincipal UserDetails userDetails) {

        AppUser student = appUserService.findByUsername(userDetails.getUsername()).orElse(null);

        if (student == null || !student.getRoles().contains(Role.STUDENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Course course = courseService.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }

        CourseDto courseDto = new CourseDto(course);
        return ResponseEntity.ok(courseDto);
    }

    // ver cursos disponibles para inscribirse
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/available-courses")
    public ResponseEntity<List<AvailableCourseDto>> getAvailableCourses(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        // los cursos a los que el estudiante está inscrito
        List<CourseDto> enrolledCourses = courseService.getCoursesByStudent(username);

        // los cursos disponibles para inscribirse
        List<AvailableCourseDto> availableCourses = courseService.getAvailableCoursesForStudent();

        // filtrar para que solo se muestren los no inscritos
        availableCourses = availableCourses.stream()
                .filter(course -> enrolledCourses.stream()
                        .noneMatch(enrolledCourse -> enrolledCourse.getId().equals(course.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(availableCourses);
    }

    // inscribirse en un curso
    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("/student/enroll/{courseId}")
    public ResponseEntity<String> enrollInCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        courseService.enrollInCourse(courseId, username);

        return ResponseEntity.ok("Inscripción exitosa");
    }







}
