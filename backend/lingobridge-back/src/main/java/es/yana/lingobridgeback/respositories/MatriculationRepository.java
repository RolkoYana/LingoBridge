package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Matriculation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatriculationRepository extends JpaRepository<Matriculation, Long> {
    List<Matriculation> findByStudentId(Long studentId);
    List<Matriculation> findByCourseId(Long courseId);
}
