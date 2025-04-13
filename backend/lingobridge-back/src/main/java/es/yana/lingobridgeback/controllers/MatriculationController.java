package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Matriculation;
import es.yana.lingobridgeback.services.MatriculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/matriculations")
public class MatriculationController {
    private final MatriculationService matriculationService;

    @GetMapping
    public List<Matriculation> getAll(){
        return matriculationService.findAll();
    }

    @GetMapping("/{id}")
    public Matriculation getById(@PathVariable Long id){
        return matriculationService.findById(id);
    }

    @PostMapping
    public Matriculation create(@RequestBody Matriculation matriculation){
        return matriculationService.save(matriculation);
    }

    @PutMapping("/{id}")
    public Matriculation update(@PathVariable Long id, @RequestBody Matriculation updatedMatriculation){
        updatedMatriculation.setId(id);
        return matriculationService.save(updatedMatriculation);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        matriculationService.delete(id);
    }

}
