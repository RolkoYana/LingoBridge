package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.activity.ActivityDto;
import es.yana.lingobridgeback.dto.activity.TestDto;
import es.yana.lingobridgeback.dto.activity.QuestionDto;
import es.yana.lingobridgeback.dto.activity.OptionDto;
import es.yana.lingobridgeback.entities.*;
import es.yana.lingobridgeback.enums.ActivityType;
import es.yana.lingobridgeback.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final CourseRepository courseRepository;
    private final AppUserRepository userRepository;
    private final ActivityResultRepository activityResultRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

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
        return activityRepository.findByCourse_Id(courseId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private ActivityDto toDto(Activity activity) {
        return ActivityDto.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .type(activity.getType())
                .dueDate(activity.getDueDate())
                .completed(false) // por defecto, si no se sabe aun
                .build();
    }

    // crear test
    public TestDto createTestWithQuestions(Long courseId, TestDto dto, String teacherUsername) {
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

        TestDto createdTestDto = new TestDto();
        createdTestDto.setId(activity.getId());
        createdTestDto.setTitle(activity.getTitle());
        createdTestDto.setDescription(activity.getDescription());
        createdTestDto.setDueDate(activity.getDueDate());

        List<Question> savedQuestions = questionRepository.findByActivityIdWithOptions(activity.getId());

        List<QuestionDto> questionDtos = savedQuestions.stream().map(q -> {
            QuestionDto qDto = new QuestionDto();
            qDto.setId(q.getId());
            qDto.setText(q.getText());

            List<OptionDto> optionDtos = q.getOptions().stream().map(opt -> {
                OptionDto oDto = new OptionDto();
                oDto.setId(opt.getId());
                oDto.setText(opt.getText());
                oDto.setCorrect(opt.isCorrect());
                return oDto;
            }).toList();

            qDto.setOptions(optionDtos);
            return qDto;
        }).toList();

        createdTestDto.setQuestions(questionDtos);

        return createdTestDto;
    }

    // mostrar el test para el profesor
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

    // mostrar el test para el estudiante
    @Transactional
    public List<QuestionDto> getQuestionsForActivity(Long activityId) {
        List<Question> questions = questionRepository.findByActivityIdWithOptions(activityId);

        return questions.stream()
                .map(q -> new QuestionDto(
                        q.getId(),
                        q.getText(),
                        q.getOptions() != null ? q.getOptions().stream()
                                .map(o -> new OptionDto(o.getId(), o.getText(), false)) // no enviar cuál es la correcta
                                .toList() : new ArrayList<>()
                ))
                .toList();
    }


    // mostrar actividades del curso para estudiante
    public List<ActivityDto> getActivitiesForStudent(Long courseId, String studentUsername) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        AppUser student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        boolean isEnrolled = course.getStudents().stream()
                .anyMatch(s -> s.getUsername().equals(studentUsername));

        if (!isEnrolled) {
            throw new RuntimeException("El estudiante no está inscrito en este curso");
        }

        return activityRepository.findByCourse_Id(courseId)
                .stream()
                .map(activity -> {
                    boolean isCompleted = activityResultRepository
                            .existsByActivityAndStudentAndCompletedTrue(activity, student);

                    return ActivityDto.builder()
                            .id(activity.getId())
                            .title(activity.getTitle())
                            .description(activity.getDescription())
                            .dueDate(activity.getDueDate())
                            .type(activity.getType())
                            .completed(isCompleted)
                            .build();
                })
                .toList();
    }

    // modificar tarea
    public ActivityDto updateActivity(Long activityId, ActivityDto dto, String teacherUsername) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));
        if (!activity.getCourse().getTeacher().getUsername().equals(teacherUsername)) {
            throw new RuntimeException("No autorizado");
        }
        activity.setTitle(dto.getTitle());
        activity.setDescription(dto.getDescription());
        activity.setDueDate(dto.getDueDate());

        activity = activityRepository.save(activity);

        // Mapear a DTO para devolver
        ActivityDto result = new ActivityDto();
        result.setId(activity.getId());
        result.setTitle(activity.getTitle());
        result.setDescription(activity.getDescription());
        result.setDueDate(activity.getDueDate());
        result.setType(activity.getType());

        return result;
    }

    // modificar el test
    @Transactional
    public TestDto updateTest(Long activityId, TestDto dto, String teacherUsername) {
        // 1. Obtener la actividad (test) existente
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        // 2. Verificar permisos
        if (!activity.getCourse().getTeacher().getUsername().equals(teacherUsername)) {
            throw new RuntimeException("No autorizado");
        }

        // 3. Actualizar datos base
        activity.setTitle(dto.getTitle());
        activity.setDescription(dto.getDescription());
        activity.setDueDate(dto.getDueDate());
        activityRepository.save(activity);

        // 4. Eliminar preguntas y opciones viejas
        List<Question> oldQuestions = questionRepository.findByActivity(activity);
        for (Question q : oldQuestions) {
            optionRepository.deleteByQuestion(q);
        }
        optionRepository.flush();

        questionRepository.deleteByActivity(activity);

        // 5. Guardar nuevas preguntas y opciones
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

        // 6. Volver a cargar las preguntas y mapear a DTO
        List<Question> savedQuestions = questionRepository.findByActivity(activity);

        List<QuestionDto> questionDtos = savedQuestions.stream().map(q -> {
            QuestionDto qDto = new QuestionDto();
            qDto.setId(q.getId());
            qDto.setText(q.getText());

            List<OptionDto> optionDtos = q.getOptions().stream().map(opt -> {
                OptionDto oDto = new OptionDto();
                oDto.setId(opt.getId());
                oDto.setText(opt.getText());
                oDto.setCorrect(opt.isCorrect());
                return oDto;
            }).toList();

            qDto.setOptions(optionDtos);
            return qDto;
        }).toList();

        // 7. Devolver resultado
        TestDto updatedTestDto = new TestDto();
        updatedTestDto.setId(activity.getId());
        updatedTestDto.setTitle(activity.getTitle());
        updatedTestDto.setDescription(activity.getDescription());
        updatedTestDto.setDueDate(activity.getDueDate());
        updatedTestDto.setQuestions(questionDtos);

        return updatedTestDto;
    }

    public ActivityDto getTaskByActivityId(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        if (activity.getType() != ActivityType.TASK) {
            throw new RuntimeException("La actividad no es de tipo TASK");
        }

        return toDto(activity);
    }

    // eliminar la actividad
    @Transactional
    public boolean deleteActivity(Long activityId) {
        try {
            if (activityRepository.existsById(activityId)) {
                activityRepository.deleteById(activityId);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar la actividad: " + e.getMessage());
        }
    }






}
