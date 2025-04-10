package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}
