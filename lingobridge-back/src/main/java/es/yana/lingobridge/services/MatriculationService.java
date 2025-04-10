package es.yana.lingobridge.services;

import es.yana.lingobridge.entities.Matriculation;
import es.yana.lingobridge.repositories.MatriculationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatriculationService {

    private final MatriculationRepository matriculationRepository;

    public MatriculationService(MatriculationRepository matriculationRepository) {
        this.matriculationRepository = matriculationRepository;
    }

    public List<Matriculation> findAll() {
        return matriculationRepository.findAll();
    }

    public Matriculation findById(Long id) {
        return matriculationRepository.findById(id).orElse(null);
    }

    public Matriculation save(Matriculation matriculation) {
        return matriculationRepository.save(matriculation);
    }

    public void delete(Long id) {
        matriculationRepository.deleteById(id);
    }
}
