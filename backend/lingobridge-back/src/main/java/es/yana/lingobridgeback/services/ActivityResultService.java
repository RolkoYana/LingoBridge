package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.activity.*;
import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.entities.ActivityResult;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Option;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.ActivityType;
import es.yana.lingobridgeback.repositories.ActivityRepository;
import es.yana.lingobridgeback.repositories.ActivityResultRepository;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.OptionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ActivityResultService {

    private final ActivityRepository activityRepository;
    private final ActivityResultRepository activityResultRepository;
    private final AppUserRepository userRepository;
    private final OptionRepository optionRepository;

    @Transactional
    public ActivityResultDto submitResult(Long activityId, String studentUsername, ActivityResultDto dto) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        AppUser student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        // Si ya existe un resultado, lo actualiza
        ActivityResult result = activityResultRepository
                .findByActivityAndStudent(activity, student)
                .orElse(ActivityResult.builder()
                        .activity(activity)
                        .student(student)
                        .build());

        result.setScore(dto.getScore());
        result.setCompleted(true);
        result.setAutoCorrected(dto.isAutoCorrected());
        result.setFeedback(dto.getFeedback());
        result.setCompletedAt(LocalDate.now());

        ActivityResult saved = activityResultRepository.save(result);

        return toDto(saved);
    }

    private ActivityResultDto toDto(ActivityResult result) {
        return new ActivityResultDto(result);
    }

    // ***** ACTIVIDAD TIPO TEST - AUTOCORRECCION *****
    public ActivityResultDto submitAutoEvaluatedTest(Long activityId, String username, TestSubmissionDto dto) {
        System.out.println("DTO recibido: " + dto);
        AppUser student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        int total = dto.getAnswers().size();
        int correct = 0;

        for (AnswerDto ans : dto.getAnswers()) {
            Long selectedOptionId = ans.getSelectedOptionId();
            if (selectedOptionId == null) {
                throw new RuntimeException("El ID de la opción seleccionada no puede ser null");
            }

            Option selected = optionRepository.findById(selectedOptionId)
                    .orElseThrow(() -> new RuntimeException("Opción inválida"));
            if (selected.isCorrect()) {
                correct++;
            }
        }

        double finalScore = (double) correct / total * 10;

        ActivityResult result = ActivityResult.builder()
                .activity(activity)
                .student(student)
                .score(finalScore)
                .completed(true)
                .autoCorrected(true)
                .feedback("Corregido automáticamente")
                .completedAt(LocalDate.now())
                .build();

        result = activityResultRepository.save(result);

        return new ActivityResultDto(result);
    }

    // ver lista de tareas realizadas
    public List<TeacherActivityResultDto> getResultsForTeacher(String teacherUsername) {
        AppUser professor = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

        Set<Course> courses = professor.getCourseGiven();

        Set<AppUser> students = courses.stream()
                .flatMap(course -> course.getStudents().stream())
                .collect(Collectors.toSet());

        List<ActivityResult> results = activityResultRepository.findByStudentIn(new ArrayList<>(students));

        return results.stream()
                .map(r -> new TeacherActivityResultDto(
                        r.getId(),
                        r.getActivity().getId(),
                        r.getActivity().getTitle(),
                        r.getStudent().getId(),
                        r.getStudent().getName() + " " + r.getStudent().getSurname(),
                        r.getStudent().getUsername(),
                        r.getTextAnswer(),
                        r.getFileName(),
                        r.getCompletedAt(),
                        r.isCompleted(),
                        r.getFeedback(),
                        r.getScore()
                ))
                .collect(Collectors.toList());
    }

    // obtener resultados para el estudiante
    public List<StudentActivityResultDto> getResultsForStudent(String username) {
        List<ActivityResult> results = activityResultRepository.findByStudentUsername(username);

        return results.stream().map(result -> {
            var activity = result.getActivity();
            var course = activity.getCourse();
            var teacher = course.getTeacher();

            return StudentActivityResultDto.builder()
                    .activityResultId(result.getId())
                    .activityTitle(activity.getTitle())
                    .courseName(course.getName())
                    .score(result.getScore())
                    .feedback(result.getFeedback())
                    .completedAt(result.getCompletedAt())
                    .teacherName(teacher.getName() + " " + teacher.getSurname())
                    .build();
        }).toList();
    }

}
