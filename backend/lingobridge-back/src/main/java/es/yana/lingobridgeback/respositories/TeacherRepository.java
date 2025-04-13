package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
