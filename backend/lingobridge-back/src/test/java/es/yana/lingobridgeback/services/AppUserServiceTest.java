package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.user.StudentDto;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.dto.user.UserMapper;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AppUserServiceTest {

    @InjectMocks
    private AppUserService appUserService;
    @Mock
    private AppUserRepository userRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void save_shouldEncodePasswordAndSaveUser() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setName("Juan");
        userDto.setSurname("Pérez");
        userDto.setUsername("juanp");
        userDto.setEmail("juan@example.com");
        userDto.setPassword("plainpass");
        userDto.setRoles(List.of(Role.STUDENT));

        AppUser userEntity = new AppUser();
        userEntity.setName("Juan");
        userEntity.setPassword("plainpass");

        when(userMapper.toEntity(userDto)).thenReturn(userEntity);
        when(passwordEncoder.encode("plainpass")).thenReturn("encodedpass");
        when(userRepository.save(any(AppUser.class))).thenAnswer(i -> i.getArgument(0));

        AppUser result = appUserService.save(userDto);

        assertEquals("encodedpass", result.getPassword());
        assertTrue(result.getRoles().contains(Role.STUDENT));
        verify(userRepository).save(userEntity);
    }

    @Test
    void getStudentsByTeacher_shouldReturnCorrectStudentDtos() {
        String teacherUsername = "profesor1";

        AppUser student1 = AppUser.builder()
                .id(1L)
                .name("Carlos")
                .surname("Ramirez")
                .username("carlosr")
                .build();

        AppUser student2 = AppUser.builder()
                .id(2L)
                .name("Lucía")
                .surname("Martinez")
                .username("luciam")
                .build();

        Course course1 = new Course();
        course1.setName("Inglés Básico");
        course1.setStudents(Set.of(student1));

        Course course2 = new Course();
        course2.setName("Francés Intermedio");
        course2.setStudents(Set.of(student2));

        when(courseRepository.findByTeacherUsername(teacherUsername))
                .thenReturn(List.of(course1, course2));

        List<StudentDto> result = appUserService.getStudentsByTeacher(teacherUsername);

        assertEquals(2, result.size());

        assertTrue(result.stream().anyMatch(dto ->
                dto.getName().equals("Carlos") &&
                        dto.getCourseName().equals("Inglés Básico")
        ));
        assertTrue(result.stream().anyMatch(dto ->
                dto.getName().equals("Lucía") &&
                        dto.getCourseName().equals("Francés Intermedio")
        ));
    }
}