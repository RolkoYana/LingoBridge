package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.services.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private AppUserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/students")
    public List<AppUser> getAllStudents(){
        return userService.findAllStudents();
    }

    @PreAuthorize("hasRole('ADMIN')")
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
}
