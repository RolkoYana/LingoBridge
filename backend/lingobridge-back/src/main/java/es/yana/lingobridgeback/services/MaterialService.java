package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Material;
import es.yana.lingobridgeback.respositories.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    public List<Material> findAll() {
        return materialRepository.findAll();
    }

    public Material findById(Long id) {
        return materialRepository.findById(id).orElse(null);
    }

    public Material save(Material material) {
        return materialRepository.save(material);
    }

    public void delete(Long id) {
        materialRepository.deleteById(id);
    }
}
