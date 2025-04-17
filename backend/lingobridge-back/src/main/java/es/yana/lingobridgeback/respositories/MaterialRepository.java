package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCourseId(Long courseId);
}
