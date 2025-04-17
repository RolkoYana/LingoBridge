package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    List<Evaluation> findByStudentId(Long studentId);
    List<Evaluation> findByCourseId(Long courseId);
}
