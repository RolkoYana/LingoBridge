package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.activity.ActivityDto;
import es.yana.lingobridgeback.dto.activity.ActivityResultDto;
import es.yana.lingobridgeback.dto.activity.TestDto;
import es.yana.lingobridgeback.dto.activity.QuestionDto;
import es.yana.lingobridgeback.dto.activity.OptionDto;
import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.entities.ActivityResult;
import es.yana.lingobridgeback.entities.Option;
import es.yana.lingobridgeback.entities.Question;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.enums.ActivityType;
import es.yana.lingobridgeback.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final CourseRepository courseRepository;
    private final AppUserRepository userRepository;
    private final ActivityResultRepository activityResultRepository;
    private final QuestionRepository questionRepository;

    public ActivityDto createActivity(Long courseId, ActivityDto dto, String teacherUsername) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!course.getTeacher().getUsername().equals(teacherUsername)) {
            throw new RuntimeException("No tienes permisos para este curso");
        }

        Activity activity = Activity.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(dto.getType())
                .dueDate(dto.getDueDate())
                .course(course)
                .build();

        activity = activityRepository.save(activity);

        return toDto(activity);
    }

    public List<ActivityDto> getActivitiesByCourse(Long courseId) {
        return activityRepository.findByCourseId(courseId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ACTIVIDADES CON RESULTADOS (para estudiante)
//    public List<ActivityWithResultDto> getActivitiesWithStudentResults(Long courseId, String studentUsername) {
//        AppUser student = userRepository.findByUsername(studentUsername)
//                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
//
//        List<Activity> activities = activityRepository.findByCourseId(courseId);
//
//        return activities.stream()
//                .map(activity -> {
//                    Optional<ActivityResult> resultOpt = activityResultRepository.findByActivityAndStudent(activity, student);
//                    return new ActivityWithResultDto(
//                            toDto(activity),
//                            resultOpt.map(this::toResultDto).orElse(null)
//                    );
//                })
//                .toList();
//    }

    private ActivityDto toDto(Activity activity) {
        return new ActivityDto(
                activity.getId(),
                activity.getTitle(),
                activity.getDescription(),
                activity.getType(),
                activity.getDueDate()
        );
    }

    private ActivityResultDto toResultDto(ActivityResult result) {
        return new ActivityResultDto(
                result.getId(),
                result.getScore(),
                result.isCompleted(),
                result.isAutoCorrected(),
                result.getFeedback(),
                result.getCompletedAt()
        );
    }

    // ***** ACTIVIDADES TIPO TEST *****

    public void createTestWithQuestions(Long courseId, TestDto dto, String teacherUsername) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!course.getTeacher().getUsername().equals(teacherUsername)) {
            throw new RuntimeException("No autorizado");
        }

        Activity activity = Activity.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(ActivityType.TEST)
                .dueDate(dto.getDueDate())
                .course(course)
                .build();

        activity = activityRepository.save(activity);

        for (QuestionDto questionDto : dto.getQuestions()) {
            Question question = Question.builder()
                    .text(questionDto.getText())
                    .activity(activity)
                    .build();

            List<Option> options = questionDto.getOptions().stream()
                    .map(optDto -> Option.builder()
                            .text(optDto.getText())
                            .correct(optDto.isCorrect())
                            .question(question)
                            .build())
                    .toList();

            question.setOptions(options);
            questionRepository.save(question);
        }
    }

    public List<QuestionDto> getQuestionsForActivity(Long activityId) {
        return questionRepository.findByActivityId(activityId).stream()
                .map(q -> new QuestionDto(
                        q.getId(),
                        q.getText(),
                        q.getOptions().stream()
                                .map(o -> new OptionDto(o.getId(), o.getText(), false)) // no enviar cuál es la correcta
                                .toList()
                ))
                .toList();
    }

    public TestDto getTestByActivityId(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        if (activity.getType() != ActivityType.TEST) {
            throw new RuntimeException("La actividad no es de tipo TEST");
        }

        List<QuestionDto> questions = questionRepository.findByActivityId(activityId)
                .stream()
                .map(q -> new QuestionDto(
                        q.getId(),
                        q.getText(),
                        q.getOptions().stream()
                                .map(o -> new OptionDto(o.getId(), o.getText(), o.isCorrect()))
                                .toList()
                ))
                .toList();

        return TestDto.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .dueDate(activity.getDueDate())
                .questions(questions)
                .build();
    }

}
