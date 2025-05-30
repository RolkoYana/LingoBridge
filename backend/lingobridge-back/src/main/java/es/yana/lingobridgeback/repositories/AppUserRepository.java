package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByUsername(String username);
    AppUser save(AppUser user);
    @Query("SELECT DISTINCT s FROM Course c JOIN c.students s WHERE c.teacher.username = :teacherUsername")
    List<AppUser> findStudentsByTeacher(@Param("teacherUsername") String teacherUsername);

    @Query("SELECT u FROM AppUser u WHERE :role MEMBER OF u.roles")
    List<AppUser> findByRole(@Param("role") Role role);

    // para estadisticas
    @Query("SELECT COUNT(u) FROM AppUser u WHERE :role MEMBER OF u.roles")
    Long countByRole(@Param("role") Role role);


}


