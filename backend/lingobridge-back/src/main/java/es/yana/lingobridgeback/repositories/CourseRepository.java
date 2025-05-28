package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByApproved(boolean approved);
    List<Course> findByTeacherUsername(String teacherUsername);
    @Query("SELECT c FROM Course c WHERE c.approved = true AND c.completed = false")
    List<Course>findActiveCourse();
    Long countByCompleted(Boolean completed);
    Long countByApproved(Boolean approved);

    @Query("SELECT COUNT(c) FROM Course c WHERE c.approved = true AND c.completed = false")
    Long countActiveCourses();
}
