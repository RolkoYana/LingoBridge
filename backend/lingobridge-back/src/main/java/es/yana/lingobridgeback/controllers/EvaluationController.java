package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Evaluation;
import es.yana.lingobridgeback.services.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping
    public List<Evaluation> getAll(){
        return evaluationService.findAll();
    }

    @GetMapping("/{id}")
    public Evaluation getById(@PathVariable Long id){
        return evaluationService.findById(id);
    }

    // crear evaluacion para el estudiante
    @PostMapping
    public Evaluation create(@RequestBody Evaluation evaluation){
        return evaluationService.save(evaluation);
    }

    @PutMapping("/{id}")
    public Evaluation update(@PathVariable Long id, @RequestBody Evaluation updatedEvaluation){
        updatedEvaluation.setId(id);
        return evaluationService.save(updatedEvaluation);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        evaluationService.delete(id);
    }

    // ver notas del alumno
    @GetMapping("/by-student/{studentId}")
    public List<Evaluation> getEvaluationByStudentId(@PathVariable Long studentId){
        return evaluationService.findByStudentId(studentId);
    }

    // crear autoevaluacion por elumno
    //@PreAuthorize ("hasRole('STUDENT')") --> para mas adelante en SpringSecurity
    @PostMapping("/auto")
    public Evaluation createAutoEvaluation(@RequestBody Evaluation evaluation){
        evaluation.setAutoEvaluation(true);
        evaluation.setEvaluationDate(LocalDate.now());
        return evaluationService.save(evaluation);
    }

    // ver solo las evaluacioes de un alumno
    @GetMapping("/auto/by-student/{studentId}")
    public List<Evaluation> getAutoEvaluations(@PathVariable Long studentId){
        return evaluationService.findByStudentIdAndIsAutoEvaluationTrue(studentId);
    }
}
