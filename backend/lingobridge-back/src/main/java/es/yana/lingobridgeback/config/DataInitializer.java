package es.yana.lingobridgeback.config;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.entities.Language;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
import es.yana.lingobridgeback.repositories.LanguageRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final AppUserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LanguageRepository languageRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initData() {
        if(userRepository.count() > 0) {
            return ;
        }

        // crear idiomas
        Language english = languageRepository.save(Language.builder().name("English").build());
        Language french = languageRepository.save(Language.builder().name("French").build());
        Language spanish = languageRepository.save(Language.builder().name("Spanish").build());
        Language german = languageRepository.save(Language.builder().name("German").build());

        // crear admin
        AppUser admin = AppUser.builder()
                .name("Yana")
                .surname("Rolko")
                .username("yanarolko")
                .email("rolkoyana@gmail.com")
                .password(passwordEncoder.encode("yanar123"))
                .roles(Set.of(Role.ADMIN))
                .build();
        userRepository.save(admin);

        // crear profesores
        AppUser teacher1 = AppUser.builder()
                .name("Pilar")
                .surname("Martinez")
                .username("pilarmartinez")
                .email("pilarm@lingobridge.com")
                .password(passwordEncoder.encode("pilarm123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(spanish)
                .build();

        AppUser teacher2 = AppUser.builder()
                .name("Daniel")
                .surname("Schmidt")
                .username("danielschmidt")
                .email("daniels@lingobridge.com")
                .password(passwordEncoder.encode("daniels123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(german)
                .build();

        AppUser teacher3 = AppUser.builder()
                .name("Alex")
                .surname("Johnson")
                .username("alexjohnson")
                .email("alexj@lingobridge.com")
                .password(passwordEncoder.encode("alexj123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(english)
                .build();

        AppUser teacher4 = AppUser.builder()
                .name("Sophie")
                .surname("Dubois")
                .username("sophiedubois")
                .email("sophied@lingobridge.com")
                .password(passwordEncoder.encode("sophied123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(french)
                .build();

        AppUser teacher5 = AppUser.builder()
                .name("Anna")
                .surname("Lopez")
                .username("annalopez")
                .email("annal@lingobridge.com")
                .password(passwordEncoder.encode("annal123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(spanish)
                .build();

        AppUser teacher6 = AppUser.builder()
                .name("Gabriel")
                .surname("Moreau")
                .username("gabrielmoreau")
                .email("gabrielm@lingobridge.com")
                .password(passwordEncoder.encode("gabriel123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(french)
                .build();
        userRepository.saveAll(List.of(teacher1, teacher2, teacher3, teacher4, teacher5, teacher6));

        // crear alumnos
        AppUser student1 = AppUser.builder()
                .name("Laura")
                .surname("Gomez")
                .username("lauragomez")
                .email("laurag@lingobridge.com")
                .password(passwordEncoder.encode("laurag123"))
                .roles(Set.of(Role.STUDENT))
                .build();

        AppUser student2 = AppUser.builder()
                .name("Carlos")
                .surname("Fernandez")
                .username("carlosfernandez")
                .email("carlosf@lingobridge.com")
                .password(passwordEncoder.encode("carlosf123"))
                .roles(Set.of(Role.STUDENT))
                .build();

        AppUser student3 = AppUser.builder()
                .name("Jose")
                .surname("Perez")
                .username("joseperez")
                .email("josep@lingobridge.com")
                .password(passwordEncoder.encode("josep123"))
                .roles(Set.of(Role.STUDENT))
                .build();
        userRepository.saveAll(List.of(student1, student2, student3));

        // crear cursos
        Course course1 = Course.builder()
                .name("Ingles Nivel A1")
                .description("Curso basico de ingles")
                .approved(true)
                .teacher(teacher3) // Alex
                .students(Set.of(student1, student2))
                .build();

        Course course2 = Course.builder()
                .name("Frances Nivel A2")
                .description("Curso intermedio de frances")
                .approved(true)
                .teacher(teacher4) // Sophie
                .students(Set.of(student1, student3))
                .build();
        Course course3 = Course.builder()
                .name("Español Nivel B1")
                .description("Curso avanzado de español")
                .approved(true)
                .teacher(teacher1) //Pilar
                .students(Set.of(student2, student3))
                .build();
        courseRepository.saveAll(List.of(course1, course2, course3));


        // Asignar relaciones inversas

        // Profesores
        teacher1.setCourseGiven(Set.of(course3));
        teacher3.setCourseGiven(Set.of(course1));
        teacher4.setCourseGiven(Set.of(course2));

        // Alumnos
        student1.setCoursesEnrolled(Set.of(course1, course2));
        student2.setCoursesEnrolled(Set.of(course1, course3));
        student3.setCoursesEnrolled(Set.of(course2, course3));

        // Guardar usuarios con relaciones actualizadas
        userRepository.saveAll(List.of(teacher1, teacher3, teacher4, student1, student2, student3));
    }
}