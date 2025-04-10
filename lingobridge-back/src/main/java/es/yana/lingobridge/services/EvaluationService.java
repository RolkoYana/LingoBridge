package es.yana.lingobridge.services;

import es.yana.lingobridge.entities.Evaluation;
import es.yana.lingobridge.repositories.EvaluationRepository;
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

}
