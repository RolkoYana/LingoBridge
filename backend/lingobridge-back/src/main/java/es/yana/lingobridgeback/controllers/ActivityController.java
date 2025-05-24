package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.activity.*;
import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.entities.ActivityResult;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.enums.ActivityType;
import es.yana.lingobridgeback.repositories.ActivityRepository;
import es.yana.lingobridgeback.repositories.ActivityResultRepository;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import es.yana.lingobridgeback.services.ActivityResultService;
import es.yana.lingobridgeback.services.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityResultService activityResultService;
    private final AppUserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final ActivityResultRepository activityResultRepository;


    // ********* PROFESOR *********

    // crear una actividad
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/course/{courseId}/activity")
    public ResponseEntity<ActivityDto> createActivity(
            @PathVariable Long courseId,
            @RequestBody ActivityDto activityDto,
            @AuthenticationPrincipal UserDetails teacher) {

        ActivityDto created = activityService.createActivity(courseId, activityDto, teacher.getUsername());
        return ResponseEntity.ok(created);
    }

    // crear un test
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/course/{courseId}/test")
    public ResponseEntity<TestDto> createTest(
            @PathVariable Long courseId,
            @RequestBody TestDto dto,
            @AuthenticationPrincipal UserDetails teacher) {

        TestDto createdTest = activityService.createTestWithQuestions(courseId, dto, teacher.getUsername());
        return ResponseEntity.ok(createdTest);
    }

    // ver actividades del curso
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/course/{courseId}/activity")
    public ResponseEntity<List<ActivityDto>> getActivitiesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(activityService.getActivitiesByCourse(courseId));
    }

    // abrir el test completo
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/test/{activityId}")
    public ResponseEntity<TestDto> getTest(@PathVariable Long activityId) {
        return ResponseEntity.ok(activityService.getTestByActivityId(activityId));
    }

    // modificar actividad
    @PreAuthorize("hasAuthority('TEACHER')")
    @PutMapping("/teacher/activity/{activityId}")
    public ResponseEntity<ActivityDto> updateActivity(
            @PathVariable Long activityId,
            @RequestBody ActivityDto activityDto,
            @AuthenticationPrincipal UserDetails teacher) {

        ActivityDto updated = activityService.updateActivity(activityId, activityDto, teacher.getUsername());
        return ResponseEntity.ok(updated);
    }

    // modificar el test
    @PreAuthorize("hasAuthority('TEACHER')")
    @PutMapping("/teacher/test/{activityId}")
    public ResponseEntity<TestDto> updateTest(
            @PathVariable Long activityId,
            @RequestBody TestDto testDto,
            @AuthenticationPrincipal UserDetails teacher) {

        TestDto updated = activityService.updateTest(activityId, testDto, teacher.getUsername());
        return ResponseEntity.ok(updated);
    }

    // ver tareas entregadas
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/activity-results")
    public ResponseEntity<List<TeacherActivityResultDto>> getActivityResultsForTeacher(
            @AuthenticationPrincipal UserDetails teacher) {

        List<TeacherActivityResultDto> results = activityResultService.getResultsForTeacher(teacher.getUsername());
        return ResponseEntity.ok(results);
    }

    // evaluar la tarea
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/activity/{activityId}/evaluate")
    public ActivityResultDto evaluateStudentTask(
            @PathVariable Long activityId,
            @RequestParam String username,
            @RequestBody ActivityResultDto dto
    ) {
        return activityResultService.submitResult(activityId, username, dto);
    }

    // cargar fichero adjunto en la entrega de la tarea
    @GetMapping("activity-result/{activityResultId}/download")
    public ResponseEntity<byte[]> openPdfFromDb(@PathVariable Long activityResultId) {
        ActivityResult result = activityResultRepository.findById(activityResultId)
                .orElseThrow(() -> new RuntimeException("Resultado no encontrado"));

        byte[] fileData = result.getFileData();
        if (fileData == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + result.getFileName() + "\"")
                .body(fileData);
    }


    /// ///////////////////////////////////////
    // ********* ESTUDIANTE *********
    /// ///////////////////////////////////////

    // ver todas actividades del curso
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/course/{courseId}/activity")
    public ResponseEntity<List<ActivityDto>> getActivitiesForStudent(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(activityService.getActivitiesForStudent(courseId, userDetails.getUsername()));
    }

    // ver preguntas del test
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/activity/{activityId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestions(@PathVariable Long activityId) {
        return ResponseEntity.ok(activityService.getQuestionsForActivity(activityId));
    }

    // entregar un test (autocorrección)
    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("/student/activity/{activityId}/submit-test")
    public ResponseEntity<ActivityResultDto> submitTest(
            @PathVariable Long activityId,
            @RequestBody TestSubmissionDto dto,
            @AuthenticationPrincipal UserDetails student) {

        System.out.println("DTO recibido: " + dto);
        dto.getAnswers().forEach(answer -> {
            System.out.println("Answer recibida - questionId: " + answer.getQuestionId() +
                    ", selectedOptionId: " + answer.getSelectedOptionId());
        });

        ActivityResultDto result = activityResultService.submitAutoEvaluatedTest(
                activityId,
                student.getUsername(),
                dto
        );
        return ResponseEntity.ok(result);
    }

    // ver la tarea
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/activity/{activityId}/task")
    public ResponseEntity<ActivityDto> getTask(@PathVariable Long activityId) {
        ActivityDto task = activityService.getTaskByActivityId(activityId);
        return ResponseEntity.ok(task);
    }


    // entregar la tarea (que no sea test)
    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("/student/activity/{activityId}/submit-task")
    public ActivityResultDto submitTaskResult(
            @PathVariable Long activityId,
            @RequestParam String username,
            @RequestParam(required = false) String textAnswer,
            @RequestParam(required = false) MultipartFile file
    ) throws IOException {

        AppUser student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        if (!activity.getType().equals(ActivityType.TASK)) {
            throw new IllegalArgumentException("Esta actividad no es una tarea");
        }

        ActivityResult result = new ActivityResult();
        result.setActivity(activity);
        result.setStudent(student);
        result.setCompleted(true);
        result.setCompletedAt(LocalDate.now());
        result.setAutoCorrected(false); // ya que no es test
        result.setTextAnswer(textAnswer); // puede ser null
        result.setFileName(file.getOriginalFilename());
        result.setFileData(file.getBytes());

        ActivityResult saved = activityResultRepository.save(result);

        return new ActivityResultDto(saved);
    }


    // editar o rrenviar resultados (A LO MEJO RINNECESARIO)
//    @PreAuthorize("hasAuthority('STUDENT')")
//    @PostMapping("student/activity/{activityId}/result")
//    public ResponseEntity<ActivityResultDto> submitActivityResult(
//            @PathVariable Long activityId,
//            @RequestBody ActivityResultDto resultDto,
//            @AuthenticationPrincipal UserDetails student) {
//
//        ActivityResultDto saved = activityResultService.submitResult(activityId, student.getUsername(), resultDto);
//        return ResponseEntity.ok(saved);
//    }

    // obtener todas las evaluaciones del estudiante
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/activity-results")
    public ResponseEntity<List<StudentActivityResultDto>> getMyActivityResults(
            @AuthenticationPrincipal UserDetails student
    ) {
        List<StudentActivityResultDto> results = activityResultService.getResultsForStudent(student.getUsername());
        return ResponseEntity.ok(results);
    }








}
