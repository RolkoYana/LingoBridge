package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    List<Evaluation> findByStudentId(Long studentId);
    List<Evaluation> findByStudentIdAndIsAutoEvaluationTrue(Long studentId);
    List<Evaluation> findByCourseIdAndIsAutoEvaluationFalse(Long courseId);
}
