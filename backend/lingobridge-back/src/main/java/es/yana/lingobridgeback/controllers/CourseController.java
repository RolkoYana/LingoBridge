package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.services.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/all")
    public List<Course> getAllCourses(){
        return courseService.findAll();
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<Course> getPendingCourses(){
        return courseService.getPendingApprovalCourse();
    }

    //@PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/teacher/{id}")
    public List<Course> getCoursesByTeacher(@PathVariable Long id){
        return courseService.getCoursesByTeacher(id);
    }

    //@PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course course){
        return ResponseEntity.ok(courseService.save(course));
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveCourse(@PathVariable Long id){
        courseService.approveCourse(id);
        return ResponseEntity.ok("Curso aprobado");
    }

}
