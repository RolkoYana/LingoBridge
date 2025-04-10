package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
