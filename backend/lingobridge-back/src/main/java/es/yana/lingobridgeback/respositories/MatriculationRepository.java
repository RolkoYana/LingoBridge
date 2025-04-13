package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Matriculation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculationRepository extends JpaRepository<Matriculation, Long> {
}
