package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Option;
import es.yana.lingobridgeback.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Option, Long> {
    void deleteByQuestion(Question question);

}
