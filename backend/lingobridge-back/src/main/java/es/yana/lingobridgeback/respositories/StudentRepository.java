package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
