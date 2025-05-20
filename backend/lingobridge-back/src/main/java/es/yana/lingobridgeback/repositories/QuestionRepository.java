package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByActivityId(Long activityId);
}
