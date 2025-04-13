package es.yana.lingobridgeback.respositories;

import es.yana.lingobridgeback.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
