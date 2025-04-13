package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Material;
import es.yana.lingobridgeback.services.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/material")
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping
    public List<Material> getAll(){
        return materialService.findAll();
    }

    @GetMapping("/{id}")
    public Material getById(@PathVariable Long id){
        return materialService.findById(id);
    }

    @PostMapping
    public Material create(@RequestBody Material material){
        return materialService.save(material);
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
