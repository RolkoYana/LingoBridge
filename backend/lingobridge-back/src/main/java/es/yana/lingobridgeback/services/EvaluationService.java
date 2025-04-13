package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Evaluation;
import es.yana.lingobridgeback.respositories.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public List<Evaluation> findAll() {
        return evaluationRepository.findAll();
    }

    public Evaluation findById(Long id) {
        return evaluationRepository.findById(id).orElse(null);
    }

    public Evaluation save(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    public void delete(Long id) {
        evaluationRepository.deleteById(id);
    }

    public List<Evaluation> findByStudentId(Long studentId) {
        return evaluationRepository.findByStudentId(studentId);
    }

    public List<Evaluation> findByStudentIdAndIsAutoEvaluationTrue(Long studentId) {
        return evaluationRepository.findByStudentIdAndIsAutoEvaluationTrue(studentId);
    }

    public List<Evaluation> findByCourseIdAndIsAutoEvaluationFalse(Long courseId) {
        return evaluationRepository.findByCourseIdAndIsAutoEvaluationFalse(courseId);
    }
}
