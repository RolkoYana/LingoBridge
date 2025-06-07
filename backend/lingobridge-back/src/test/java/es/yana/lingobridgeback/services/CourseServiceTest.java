package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.CourseType;
import es.yana.lingobridgeback.enums.Language;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private CourseService courseService;

    private Course testCourse;
    private AppUser testStudent;
    private AppUser testTeacher;

    @BeforeEach
    void setUp() {
        // Crear un profesor de prueba
        testTeacher = AppUser.builder()
                .id(1L)
                .username("profesor1")
                .name("Juan")
                .surname("García")
                .roles(Set.of(Role.TEACHER))
                .build();

        // Crear un estudiante de prueba
        testStudent = AppUser.builder()
                .id(2L)
                .username("estudiante1")
                .name("María")
                .surname("López")
                .roles(Set.of(Role.STUDENT))
                .coursesEnrolled(new HashSet<>())
                .build();

        // Crear un curso de prueba
        testCourse = Course.builder()
                .id(1L)
                .name("Inglés Básico")
                .description("Curso de inglés para principiantes")
                .type(CourseType.FLEXIBLE)
                .language(Language.ENGLISH)
                .teacher(testTeacher)
                .approved(true)
                .completed(false)
                .students(new HashSet<>())
                .build();
    }

    @Test
    void testEnrollInCourseSuccess() {
        Long courseId = 1L;
        String username = "estudiante1";

        when(appUserRepository.findByUsername(username)).thenReturn(Optional.of(testStudent));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(courseRepository.save(any(Course.class))).thenReturn(testCourse);

        courseService.enrollInCourse(courseId, username);

        assertTrue(testCourse.getStudents().contains(testStudent),
                "El estudiante debería estar inscrito en el curso");

        verify(courseRepository, times(1)).save(testCourse);
        verify(appUserRepository, times(1)).findByUsername(username);
        verify(courseRepository, times(1)).findById(courseId);
    }

    @Test
    @DisplayName("Test 2: No poder inscribirse en un curso ya completado")
    void testEnrollInCompletedCourseShouldFail() {
        // Preparar datos de prueba con un curso completado
        Long courseId = 1L;
        String username = "estudiante1";

        // Marcar el curso como completado
        testCourse.setCompleted(true);
        testCourse.setCompletedAt(new Date());

        // Configurar mocks
        when(appUserRepository.findByUsername(username)).thenReturn(Optional.of(testStudent));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        // Verificar que se lanza la excepción esperada
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> courseService.enrollInCourse(courseId, username),
                "Debería lanzar excepción al intentar inscribirse en curso completado"
        );

        assertEquals("No puedes inscribirte en un curso completado.", exception.getMessage());

        // Verificar que NO se guardó nada
        verify(courseRepository, never()).save(any(Course.class));

        // Verificar que el estudiante NO fue añadido al curso
        assertFalse(testCourse.getStudents().contains(testStudent),
                "El estudiante NO debería estar inscrito en un curso completado");
    }
}