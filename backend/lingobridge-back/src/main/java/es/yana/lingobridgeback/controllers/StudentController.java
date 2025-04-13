package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.services.StudentService;
import es.yana.lingobridgeback.entities.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public List<Student> getAll(){
        return studentService.findAll();
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id){
        return studentService.findById(id);
    }

    @PostMapping
    public Student create(@RequestBody Student student){
        return studentService.save(student);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student updatedStudent){
        updatedStudent.setId(id);
        return studentService.save(updatedStudent);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        studentService.delete(id);
    }
}
