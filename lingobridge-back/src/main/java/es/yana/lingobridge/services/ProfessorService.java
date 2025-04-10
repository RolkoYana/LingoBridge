package es.yana.lingobridge.services;

import es.yana.lingobridge.entities.Professor;
import es.yana.lingobridge.repositories.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    public ProfessorService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    public List<Professor> findAll() {
        return professorRepository.findAll();
    }

    public Professor findById(Long id) {
        return professorRepository.findById(id).orElse(null);
    }

    public Professor save(Professor professor) {
        return professorRepository.save(professor);
    }

    public void delete(Long id) {
        professorRepository.deleteById(id);
    }
}
