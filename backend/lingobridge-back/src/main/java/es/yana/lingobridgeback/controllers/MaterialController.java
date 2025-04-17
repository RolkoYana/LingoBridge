package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Material;
import es.yana.lingobridgeback.respositories.MaterialRepository;
import es.yana.lingobridgeback.services.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/material")
@CrossOrigin(origins = "*")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    public List<Material> getAll(){
        return materialService.findAll();
    }

    //@PreAuthorize("hasRole({'STUDENT', 'TEACHER'})")
    @GetMapping("/course/{id}")
    public List<Material> getMaterialByCourse(@PathVariable Long id){
        return materialService.findByCourseId(id);
    }

    //@PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/add")
    public ResponseEntity<Material> add(@RequestBody Material material){
        return ResponseEntity.ok(materialService.save(material));
    }

    @PutMapping("/{id}")
    public Material update(@PathVariable Long id, @RequestBody Material updatedMaterial){
        updatedMaterial.setId(id);
        return materialService.save(updatedMaterial);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        materialService.delete(id);
    }
}
