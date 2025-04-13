package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.entities.User;
import es.yana.lingobridgeback.services.CourseService;
import es.yana.lingobridgeback.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final CourseService courseService;

    // ver todos los usuarios
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    // eliminar un usuario por id
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

    // aprobar un curso
    @PutMapping("/courses/{id}/approve")
    public Course approveCourse(@PathVariable Long id) {
        Course course = courseService.findById(id);
        if(course != null){
            course.setDescription(course.getDescription() + "Aprobado");
            return courseService.save(course);
        }
        return null;
    }

    // eliminar un curso por id
    @DeleteMapping("/courses/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.delete(id);
    }

    // ver estadisticas de usuarios y cursos
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.findAll().size());
        stats.put("totalCourses", courseService.findAll().size());
        return stats;
    }
}
