package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Material;
import es.yana.lingobridgeback.respositories.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    public List<Material> findAll() {
        return materialRepository.findAll();
    }

    public List<Material> findByCourseId(Long id) {
        return materialRepository.findByCourseId(id);
    }

    public Material save(Material material) {
        return materialRepository.save(material);
    }

    public void delete(Long id) {
        materialRepository.deleteById(id);
    }
}
