package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.jwt.JwtMapper;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterRequest;
import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.dto.user.UserMapper;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AppUserService {

    private final AppUserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtMapper jwtMapper;

    public List<AppUser> findAll() {
        return userRepository.findAll();
    }

    public AppUser save(UserDto userDto) {
        AppUser user = userMapper.toEntity(userDto);
        // Asignar roles correctamente
        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>(userDto.getRoles())); // convertir list a set
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // metodo para generar token de verificacion al registrarse
    public AppUser save(JwtRegisterRequest dto){
        AppUser user = jwtMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setEnabled(false); // por defecto, el usuario no está habilitado al registrarse
        user.setVerificationToken(UUID.randomUUID().toString()); // se genera el token unico
        user.setTokenExpiryDate(LocalDateTime.now().plusHours(24)); // token válido por 24 horas

        return userRepository.save(user);
    }

    // buscar por token de verificación!
    public Optional<AppUser> findByVerificationToken(String token) {
        return userRepository.findByVerificationToken(token);
    }

    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<AppUser> findAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    public List<AppUser> findAllTeachers() {
        return userRepository.findByRole(Role.TEACHER);
    }

    public Optional<AppUser> findByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public AppUser save(AppUser user) {
        return userRepository.save(user);
    }

    public List<StudentDto> getStudentsByTeacher(String teacherUsername) {
        List<Course> courses = courseRepository.findByTeacherUsername(teacherUsername);
        List<StudentDto> studentDtos = new ArrayList<>();

        for (Course course : courses) {
            for (AppUser student : course.getStudents()) {
                StudentDto dto = new StudentDto(
                        student.getId(),
                        student.getName(),
                        student.getSurname(),
                        student.getUsername(),
                        course.getName()
                );
                studentDtos.add(dto);
            }
        }
        return studentDtos;
    }

    // convierte AppUser a UserDto (con roles como String)
    public List<UserDto> getAllUsersWithRolesAsStrings(List<AppUser> users) {
        return users.stream()
                // solo estudiantes y profesores
                .filter(user -> user.getRoles().contains(Role.STUDENT) || user.getRoles().contains(Role.TEACHER))
                .map(user -> {
                    List<String> roleNames = user.getRoles().stream()
                            .map(Enum::name)
                            .collect(Collectors.toList());
                    return new UserDto(
                            user.getId(),
                            user.getName(),
                            user.getSurname(),
                            user.getUsername(),
                            user.getEmail(),
                            roleNames
                    );
                })
                .collect(Collectors.toList());
    }

    // **************** PARA ESTADISTICAS ***************************

    // alumnos por idioma
    public Map<Language, Long> countStudentsPerLanguage() {
        List<AppUser> students = userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(Role.STUDENT))
                .toList();

        Map<Language, Set<Long>> studentsByLanguage = new HashMap<>();

        for (AppUser student : students) {
            for (Course course : student.getCoursesEnrolled()) {
                Language language = course.getLanguage();
                if (language != null) {
                    studentsByLanguage
                            .computeIfAbsent(language, k -> new HashSet<>())
                            .add(student.getId());
                }
            }
        }

        return studentsByLanguage.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> (long) e.getValue().size()
                ));
    }

    // profesores por idioma
    public Map<Language, Long> countTeachersPerLanguage() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(Role.TEACHER) && user.getLanguageTaught() != null)
                .collect(Collectors.groupingBy(AppUser::getLanguageTaught, Collectors.counting()));
    }

    public Long countAllTeachers() {
        return userRepository.countByRole(Role.TEACHER);
    }

    public Long countAllStudents() {
        return userRepository.countByRole(Role.STUDENT);
    }


}
