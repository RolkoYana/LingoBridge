package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
}
