package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findByApproved(boolean approved);
    Optional<Course> findByName(String name);
    List<Course> findByTeacherUsername(String teacherUsername);
    @Query("SELECT c FROM Course c WHERE c.approved = true AND c.completed = false")
    List<Course>findActiveCourse();
}
