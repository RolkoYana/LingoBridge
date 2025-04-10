package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.Matriculation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculationRepository extends JpaRepository<Matriculation, Long> {
}
