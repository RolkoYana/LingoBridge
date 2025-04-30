package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Matriculation;
import es.yana.lingobridgeback.services.MatriculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/matriculations")
@CrossOrigin(origins = "http://localhost:5173")
public class MatriculationController {

    @Autowired
    private MatriculationService matriculationService;

    @GetMapping
    public List<Matriculation> getAll(){
        return matriculationService.findAll();
    }

    @GetMapping("/student/{id}")
    public List<Matriculation> getMatriculationByStudent(@PathVariable Long id){
        return matriculationService.getMatriculationByStudent(id);
    }

    //@PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/enroll")
    public ResponseEntity<Matriculation> enroll(@RequestBody Matriculation matriculation){
        return ResponseEntity.ok(matriculationService.save(matriculation));
    }

}
