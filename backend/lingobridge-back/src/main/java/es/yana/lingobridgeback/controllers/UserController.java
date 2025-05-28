package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.services.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final AppUserService userService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/students")
    public List<AppUser> getAllStudents(){
        return userService.findAllStudents();
    }

//    @GetMapping("/{email}")
//    public ResponseEntity<AppUser> getUserByEmail(@PathVariable String email){
//        return userService.findByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
//    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<String> getAdminPanel() {
        return ResponseEntity.ok("Bienvenido al panel de administrador");
    }

    // obtener todos los usuarios (tabla de usuarios en panel de admin)
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        List<AppUser> users = userService.findAll();
        List<UserDto> userDtos = userService.getAllUsersWithRolesAsStrings(users);
        return ResponseEntity.ok(userDtos);
    }

    // obtener los estudiantes de los cursos del profesor autenticado
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/students")
    public ResponseEntity<List<StudentDto>> getTeacherStudents(@AuthenticationPrincipal UserDetails userDetails) {
        String teacherUsername = userDetails.getUsername();
        List<StudentDto> students = userService.getStudentsByTeacher(teacherUsername);
        return ResponseEntity.ok(students);
    }

    // obtener profesores (para que admin pueda asignar un curso)
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/teachers")
    public ResponseEntity<List<UserDto>> getTeachers() {
        List<AppUser> teachers = userService.findAllTeachers();
        List<UserDto> teacherDtos = teachers.stream()
                .map(user -> new UserDto(user.getId(), user.getName(), user.getSurname(), user.getUsername()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(teacherDtos);
    }



}
