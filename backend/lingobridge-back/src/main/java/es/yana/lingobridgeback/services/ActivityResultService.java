package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.activity.ActivityResultDto;
import es.yana.lingobridgeback.dto.activity.AnswerDto;
import es.yana.lingobridgeback.dto.activity.TestSubmissionDto;
import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.entities.ActivityResult;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Option;
import es.yana.lingobridgeback.repositories.ActivityRepository;
import es.yana.lingobridgeback.repositories.ActivityResultRepository;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.repositories.OptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class ActivityResultService {

    private final ActivityRepository activityRepository;
    private final ActivityResultRepository activityResultRepository;
    private final AppUserRepository userRepository;
    private final OptionRepository optionRepository;

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

    public ActivityResultDto getResultForActivity(Long activityId, String studentUsername) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        AppUser student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        ActivityResult result = activityResultRepository.findByActivityAndStudent(activity, student)
                .orElseThrow(() -> new RuntimeException("Resultado no encontrado"));

        return toDto(result);
    }

    private ActivityResultDto toDto(ActivityResult result) {
        return new ActivityResultDto(
                result.getId(),
                result.getScore(),
                result.isCompleted(),
                result.isAutoCorrected(),
                result.getFeedback(),
                result.getCompletedAt()
        );
    }

    // ***** ACTIVIDAD TIPO TEST - AUTOCORRECCION *****

    public ActivityResultDto submitAutoEvaluatedTest(Long activityId, String username, TestSubmissionDto dto) {
        AppUser student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        int total = dto.getAnswers().size();
        int correct = 0;

        for (AnswerDto ans : dto.getAnswers()) {
            Option selected = optionRepository.findById(ans.getSelectedOptionId())
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

        return new ActivityResultDto(result.getId(), result.getScore(), result.isCompleted(), true, result.getFeedback(), result.getCompletedAt());
    }


}
