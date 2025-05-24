package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.entities.Question;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByActivityId(Long activityId);
    List<Question> findByActivity(Activity activity);

    @Modifying // modifica BD en lugar de solo leer
    @Transactional
    @Query("DELETE FROM Question q WHERE q.activity = :activity")
    void deleteByActivity(Activity activity);

    @Modifying
    @Transactional
    @Query("DELETE FROM Option o WHERE o.question = :question")
    void deleteByQuestion(@Param("question") Question question);

    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.options WHERE q.activity.id = :activityId")
    List<Question> findByActivityIdWithOptions(@Param("activityId") Long activityId);
}
