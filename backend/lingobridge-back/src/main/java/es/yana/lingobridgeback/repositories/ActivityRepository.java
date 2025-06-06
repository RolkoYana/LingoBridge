package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByCourse_Id(Long courseId);

    void deleteById(Long id);

}
