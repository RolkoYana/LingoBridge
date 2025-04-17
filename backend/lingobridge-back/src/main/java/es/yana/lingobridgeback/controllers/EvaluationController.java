package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Evaluation;
import es.yana.lingobridgeback.services.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping
    public List<Evaluation> getAll(){
        return evaluationService.findAll();
    }

    //@PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{id}")
    public List<Evaluation> getEvaluationByStudent(@PathVariable Long id){
        return evaluationService.findByStudent(id);
    }

    //@PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation){
        return ResponseEntity.ok(evaluationService.save(evaluation));
    }

}
