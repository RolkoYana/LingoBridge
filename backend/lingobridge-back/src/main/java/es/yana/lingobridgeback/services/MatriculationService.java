package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Matriculation;
import es.yana.lingobridgeback.respositories.MatriculationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatriculationService {

    @Autowired
    private MatriculationRepository matriculationRepository;

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

    public List<Matriculation> getMatriculationByStudent(Long studentId) {
        return matriculationRepository.findByStudentId(studentId);
    }
}
