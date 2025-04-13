package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.entities.Teacher;
import es.yana.lingobridgeback.services.CourseService;
import es.yana.lingobridgeback.services.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;
    private final CourseService courseService;

    @GetMapping
    public List<Teacher> getAll(){
        return teacherService.findAll();
    }

    @GetMapping("/{id}")
    public Teacher getById(@PathVariable Long id){
        return teacherService.findById(id);
    }

    @PostMapping
    public Teacher create(@RequestBody Teacher teacher){
        return teacherService.save(teacher);
    }

    @PutMapping("/{id}")
    public Teacher update(@PathVariable Long id, @RequestBody Teacher updatedTeacher){
        updatedTeacher.setId(id);
        return teacherService.save(updatedTeacher);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        teacherService.delete(id);
    }

    // crear un curso como profesor
    @PostMapping("/{professorId}/courses")
    public Course createCourse(@PathVariable Long teacherId, @RequestBody Course course){
        Teacher teacher = teacherService.findById(teacherId);
        course.setTeacher(teacher); // indicar que profesor imparte el curso
        return courseService.save(course);
    }
}
