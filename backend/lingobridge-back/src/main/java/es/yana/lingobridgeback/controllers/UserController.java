package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.services.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private AppUserService userService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/students")
    public List<AppUser> getAllStudents(){
        return userService.findAllStudents();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/teachers")
    public List<AppUser> getAllTeachers(){
        return userService.findAllTeachers();
    }

    @GetMapping("/{email}")
    public ResponseEntity<AppUser> getUserByEmail(@PathVariable String email){
        return userService.findByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<String> getAdminPanel() {
        return ResponseEntity.ok("Bienvenido al panel de administrador");
    }

    // obtener los estudiantes de los cursos del profesor autenticado
//    @PreAuthorize("hasAuthority('TEACHER')")
//    @GetMapping("/teacher/students")
//    public ResponseEntity<List<UserDto>> getTeacherStudents(@AuthenticationPrincipal UserDetails userDetails){
//        String teacherUsername = userDetails.getUsername();
//        List<UserDto> students = userService.getStudentsByTeacher(teacherUsername);
//        return ResponseEntity.ok(students);
//    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/students")
    public ResponseEntity<List<StudentDto>> getTeacherStudents(@AuthenticationPrincipal UserDetails userDetails) {
        String teacherUsername = userDetails.getUsername();
        List<StudentDto> students = userService.getStudentsByTeacher(teacherUsername);
        return ResponseEntity.ok(students);
    }

}
