package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Evaluation;
import es.yana.lingobridgeback.respositories.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

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

    public List<Evaluation> findByStudent(Long studentId) {
        return evaluationRepository.findByStudentId(studentId);
    }

}
