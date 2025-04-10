package es.yana.lingobridge.repositories;

import es.yana.lingobridge.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Administrator, Long> {
}
