package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.User;
import es.yana.lingobridgeback.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
