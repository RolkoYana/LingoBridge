package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.services.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public List<Course> getAll(){
        return courseService.findAll();
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id){
        return courseService.findById(id);
    }

    // se activa al hacer la peticion POST para crear un nuevo curso
    @PostMapping
    public Course create(@RequestBody Course course){
        return courseService.save(course);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course updatedCourse){
        updatedCourse.setId(id);
        return courseService.save(updatedCourse);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        courseService.delete(id);
    }
}
