package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.services.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping
    public List<Activity> getAll(){
        return evaluationService.findAll();
    }

    //@PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{id}")
    public List<Activity> getEvaluationByStudent(@PathVariable Long id){
        return evaluationService.findByStudent(id);
    }

    //@PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<Activity> createEvaluation(@RequestBody Activity activity){
        return ResponseEntity.ok(evaluationService.save(activity));
    }

}
