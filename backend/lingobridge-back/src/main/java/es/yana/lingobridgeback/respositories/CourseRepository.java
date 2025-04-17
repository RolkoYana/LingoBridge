package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findByApproved(boolean approved);
}
