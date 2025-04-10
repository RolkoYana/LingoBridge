package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
