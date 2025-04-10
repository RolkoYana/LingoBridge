package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}

