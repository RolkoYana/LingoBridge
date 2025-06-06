package es.yana.lingobridgeback.repositories;

import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.entities.ActivityResult;
import es.yana.lingobridgeback.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ActivityResultRepository extends JpaRepository<ActivityResult, Long> {

    List<ActivityResult> findByStudentUsername(String username);

    Optional<ActivityResult> findByActivityAndStudent(Activity activity, AppUser student);

    boolean existsByActivityAndStudentAndCompletedTrue(Activity activity, AppUser student);

    List<ActivityResult> findByStudentIn(Collection<AppUser> students);


}
