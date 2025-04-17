package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.User;
import es.yana.lingobridgeback.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/students")
    public List<User> getAllStudents(){
        return userService.findAllStudents();
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/teachers")
    public List<User> getAllTeachers(){
        return userService.findAllTeachers();
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email){
        return userService.findByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user){
        return ResponseEntity.ok(userService.save(user));
    }
}
