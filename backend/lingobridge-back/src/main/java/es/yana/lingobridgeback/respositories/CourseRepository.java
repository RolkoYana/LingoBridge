package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
