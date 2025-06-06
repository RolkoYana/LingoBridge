package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByUsername(String username);
    AppUser save(AppUser user);

    @Query("SELECT u FROM AppUser u WHERE :role MEMBER OF u.roles")
    List<AppUser> findByRole(@Param("role") Role role);

    // para estadisticas
    @Query("SELECT COUNT(u) FROM AppUser u WHERE :role MEMBER OF u.roles")
    Long countByRole(@Param("role") Role role);

    // buscar por token de verificacion
    Optional<AppUser> findByVerificationToken(String verificationToken);


}


