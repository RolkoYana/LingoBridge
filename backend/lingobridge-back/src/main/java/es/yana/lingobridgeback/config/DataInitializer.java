package es.yana.lingobridgeback.config;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.CourseType;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
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
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initData() {
        if(userRepository.count() > 0) {
            return ;
        }

        // crear admin
        AppUser admin = AppUser.builder()
                .name("Yana")
                .surname("Rolko")
                .username("yanarolko")
                .email("rolkoyana@gmail.com")
                .password(passwordEncoder.encode("yanar123"))
                .roles(Set.of(Role.ADMIN))
                .enabled(true)
                .build();
        userRepository.save(admin);

        // crear profesores
        AppUser teacher1 = AppUser.builder()
                .name("Pilar")
                .surname("Martinez")
                .username("pilarmartinez")
                .email("pilarm@lingobridge.com")
                .password(passwordEncoder.encode("pilarm123"))
                .roles(Set.of(Role.TEACHER, Role.STUDENT))
                .languageTaught(Language.SPANISH)
                .enabled(true)
                .build();

        AppUser teacher2 = AppUser.builder()
                .name("Daniel")
                .surname("Schmidt")
                .username("danielschmidt")
                .email("daniels@lingobridge.com")
                .password(passwordEncoder.encode("daniels123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.GERMAN)
                .enabled(true)
                .build();

        AppUser teacher3 = AppUser.builder()
                .name("Alex")
                .surname("Johnson")
                .username("alexjohnson")
                .email("alexj@lingobridge.com")
                .password(passwordEncoder.encode("alexj123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.ENGLISH)
                .enabled(true)
                .build();

        AppUser teacher4 = AppUser.builder()
                .name("Sophie")
                .surname("Dubois")
                .username("sophiedubois")
                .email("sophied@lingobridge.com")
                .password(passwordEncoder.encode("sophied123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.FRENCH)
                .enabled(true)
                .build();

        AppUser teacher5 = AppUser.builder()
                .name("Anna")
                .surname("Lopez")
                .username("annalopez")
                .email("annal@lingobridge.com")
                .password(passwordEncoder.encode("annal123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.SPANISH)
                .enabled(true)
                .build();

        AppUser teacher6 = AppUser.builder()
                .name("Gabriel")
                .surname("Moreau")
                .username("gabrielmoreau")
                .email("gabrielm@lingobridge.com")
                .password(passwordEncoder.encode("gabriel123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.FRENCH)
                .enabled(true)
                .build();

        AppUser teacher7 = AppUser.builder()
                .name("Maria")
                .surname("Gonzalez")
                .username("mariagonzalez")
                .email("mariag@lingobridge.com")
                .password(passwordEncoder.encode("mariag123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.ENGLISH)
                .enabled(true)
                .build();

        AppUser teacher8 = AppUser.builder()
                .name("John")
                .surname("Backer")
                .username("johnbacker")
                .email("johnb@lingobridge.com")
                .password(passwordEncoder.encode("johnb123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.ENGLISH)
                .enabled(true)
                .build();

        AppUser teacher9 = AppUser.builder()
                .name("Emma")
                .surname("Müller")
                .username("emmamuller")
                .email("emmam@lingobridge.com")
                .password(passwordEncoder.encode("emmam123"))
                .roles(Set.of(Role.TEACHER))
                .languageTaught(Language.GERMAN)
                .enabled(true)
                .build();

        userRepository.saveAll(List.of(teacher1, teacher2, teacher3, teacher4, teacher5, teacher6, teacher7, teacher8, teacher9));

        // crear estudiantes
        AppUser student1 = AppUser.builder()
                .name("Laura")
                .surname("Gomez")
                .username("lauragomez")
                .email("laurag@lingobridge.com")
                .password(passwordEncoder.encode("laurag123"))
                .roles(Set.of(Role.STUDENT))
                .enabled(true)
                .build();

        AppUser student2 = AppUser.builder()
                .name("Carlos")
                .surname("Fernandez")
                .username("carlosfernandez")
                .email("carlosf@lingobridge.com")
                .password(passwordEncoder.encode("carlosf123"))
                .roles(Set.of(Role.STUDENT))
                .enabled(true)
                .build();

        AppUser student3 = AppUser.builder()
                .name("Jose")
                .surname("Perez")
                .username("joseperez")
                .email("josep@lingobridge.com")
                .password(passwordEncoder.encode("josep123"))
                .roles(Set.of(Role.STUDENT))
                .enabled(true)
                .build();
        userRepository.saveAll(List.of(student1, student2, student3));

        // mas estudiantes
        List<AppUser> students = List.of(
                AppUser.builder().name("Nina").surname("Rivera").username("ninarivera").email("ninar@lingobridge.com").password(passwordEncoder.encode("nina123")).roles(Set.of(Role.STUDENT)).enabled(true).build(),
                AppUser.builder().name("Leo").surname("Castro").username("leocastro").email("leoc@lingobridge.com").password(passwordEncoder.encode("leo123")).roles(Set.of(Role.STUDENT)).enabled(true).build(),
                AppUser.builder().name("Sara").surname("Martins").username("saramartins").email("saram@lingobridge.com").password(passwordEncoder.encode("sara123")).roles(Set.of(Role.STUDENT)).enabled(true).build(),
                AppUser.builder().name("Mateo").surname("Silva").username("mateosilva").email("mateos@lingobridge.com").password(passwordEncoder.encode("mateo123")).roles(Set.of(Role.STUDENT)).enabled(true).build(),
                AppUser.builder().name("Clara").surname("Weber").username("claraweber").email("claraw@lingobridge.com").password(passwordEncoder.encode("clara123")).roles(Set.of(Role.STUDENT)).enabled(true).build(),
                AppUser.builder().name("Lucia").surname("Ramos").username("luciaramos").email("luciar@lingobridge.com").password(passwordEncoder.encode("lucia123")).roles(Set.of(Role.STUDENT)).enabled(true).build(),
                AppUser.builder().name("Noah").surname("Bauer").username("noahbauer").email("noahb@lingobridge.com").password(passwordEncoder.encode("noah123")).roles(Set.of(Role.STUDENT)).enabled(true).build()
        );
        userRepository.saveAll(students);

        // crear cursos
        Course course1 = Course.builder()
                .name("Ingles Nivel A1")
                .description("Curso basico de ingles")
                .approved(true)
                .teacher(teacher3) // Alex
                .students(Set.of(student1, student2))
                .type(CourseType.INTENSIVO)
                .language(Language.ENGLISH)
                .build();

        Course course2 = Course.builder()
                .name("Frances Nivel A2")
                .description("Curso intermedio de frances")
                .approved(true)
                .teacher(teacher4) // Sophie
                .students(Set.of(student1, student3))
                .type(CourseType.FLEXIBLE)
                .language(Language.FRENCH)
                .build();
        Course course3 = Course.builder()
                .name("Español Nivel B1")
                .description("Curso avanzado de español")
                .approved(true)
                .teacher(teacher1) //Pilar
                .students(Set.of(student2, student3))
                .type(CourseType.GRUPAL)
                .language(Language.SPANISH)
                .build();

        Course course4 = Course.builder()
                .name("English Business B2")
                .description("Business English intensive course")
                .approved(true)
                .teacher(teacher7)
                .students(Set.of(students.get(0), students.get(1), students.get(2)))
                .type(CourseType.INTENSIVO)
                .language(Language.ENGLISH)
                .build();

        Course course5 = Course.builder()
                .name("English Basic A1")
                .description("Basic English course")
                .approved(true)
                .teacher(teacher8)
                .students(Set.of(students.get(1), students.get(3), students.get(4), students.get(5)))
                .type(CourseType.GRUPAL)
                .language(Language.ENGLISH)
                .build();

        Course course6 = Course.builder()
                .name("Deutsch für Anfänger")
                .description("Curso flexible de alemán")
                .approved(true)
                .teacher(teacher9)
                .students(Set.of(students.get(2), students.get(3), students.get(6)))
                .type(CourseType.FLEXIBLE)
                .language(Language.GERMAN)
                .build();

        Course course7 = Course.builder()
                .name("Español Conversacional B1")
                .description("Curso intensivo de español conversacional")
                .approved(true)
                .teacher(teacher1) // Pilar ya existente
                .students(Set.of(students.get(0), students.get(4), students.get(5), students.get(6)))
                .type(CourseType.INTENSIVO)
                .language(Language.SPANISH)
                .build();

        courseRepository.saveAll(List.of(course1, course2, course3, course4, course5, course6, course7));

        // ***** asignar relaciones inversas *****

        // profesores
        teacher1.setCourseGiven(Set.of(course3, course7));
        teacher3.setCourseGiven(Set.of(course1));
        teacher4.setCourseGiven(Set.of(course2));
        teacher7.setCourseGiven(Set.of(course4));
        teacher8.setCourseGiven(Set.of(course5));
        teacher9.setCourseGiven(Set.of(course6));

        // estudiantes
        student1.setCoursesEnrolled(Set.of(course1, course2));
        student2.setCoursesEnrolled(Set.of(course1, course3));
        student3.setCoursesEnrolled(Set.of(course2, course3));
        students.get(0).setCoursesEnrolled(Set.of(course4, course7));
        students.get(1).setCoursesEnrolled(Set.of(course4, course5));
        students.get(2).setCoursesEnrolled(Set.of(course4, course6));
        students.get(3).setCoursesEnrolled(Set.of(course5, course6));
        students.get(4).setCoursesEnrolled(Set.of(course5, course7));
        students.get(5).setCoursesEnrolled(Set.of(course5, course7));
        students.get(6).setCoursesEnrolled(Set.of(course6, course7));

        // Guardar usuarios con relaciones actualizadas
        userRepository.saveAll(List.of(
                teacher1, teacher3, teacher4, teacher7, teacher8, teacher9,
                student1, student2, student3
        ));
        userRepository.saveAll(students);
    }
}