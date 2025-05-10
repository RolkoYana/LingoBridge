package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.jwt.JwtMapper;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterRequest;
import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.dto.user.UserMapper;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public AppUser findById(Long id) {
        return userRepository.findById(id).orElse(null);
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

    // metodo save() para JWT
    public AppUser save(JwtRegisterRequest dto){
        AppUser user = jwtMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<AppUser> findAllStudents() {
        return userRepository.findByRole("STUDENT");
    }

    public List<AppUser> findAllTeachers() {
        return userRepository.findByRole("TEACHER");
    }

    public AppUser findByUsernameOrEmail(String input){
        return userRepository.findByUsername(input)
                .orElseGet(() -> userRepository.findByEmail(input).orElse(null));
    }

    public Optional<AppUser> findByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public AppUser save(AppUser user) {
        return userRepository.save(user);
    }

    // recupera los estudiantes de los cursos del profesor autenticado
//    public List<UserDto> getStudentsByTeacher(String teacherUsername){
//        List<AppUser> students = userRepository.findStudentsByTeacher(teacherUsername);
//        return students.stream()
//                .filter(s -> s.getRoles().contains(Role.STUDENT))
//                .map(userMapper::toDto)
//                .collect(Collectors.toList());
//    }

    public List<StudentDto> getStudentsByTeacher(String teacherUsername) {

        // Obtener todos los cursos del profesor
        List<Course> courses = courseRepository.findByTeacherUsername(teacherUsername);

        // Lista para almacenar los estudiantes que están matriculados en estos cursos
        List<StudentDto> studentDtos = new ArrayList<>();

        // Para cada curso que imparte el profesor
        for (Course course : courses) {
            // Para cada estudiante matriculado en ese curso
            for (AppUser student : course.getStudents()) {
                // Creamos el StudentDto con el nombre, apellido y nombre del curso
                StudentDto dto = new StudentDto(
                        student.getName(),
                        student.getSurname(),
                        student.getUsername(),
                        course.getName() // Nombre del curso en el que está matriculado
                );
                studentDtos.add(dto);
            }
        }

        return studentDtos;
    }


}
