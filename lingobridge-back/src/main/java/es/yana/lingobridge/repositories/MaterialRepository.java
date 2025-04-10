package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
}
