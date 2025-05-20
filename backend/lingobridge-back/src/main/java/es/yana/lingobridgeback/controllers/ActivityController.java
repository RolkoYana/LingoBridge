package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.activity.QuestionDto;
import es.yana.lingobridgeback.dto.activity.ActivityDto;
import es.yana.lingobridgeback.dto.activity.ActivityResultDto;
import es.yana.lingobridgeback.dto.activity.TestDto;
import es.yana.lingobridgeback.services.ActivityResultService;
import es.yana.lingobridgeback.services.ActivityService;
import es.yana.lingobridgeback.dto.activity.TestSubmissionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityResultService activityResultService;

    // ***** PROFESOR *****

    // Crear nueva actividad
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/activity/course/{courseId}")
    public ResponseEntity<ActivityDto> createActivity(
            @PathVariable Long courseId,
            @RequestBody ActivityDto activityDto,
            @AuthenticationPrincipal UserDetails teacher) {

        ActivityDto created = activityService.createActivity(courseId, activityDto, teacher.getUsername());
        return ResponseEntity.ok(created);
    }

    // Listar actividades por curso
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/activity/course/{courseId}")
    public ResponseEntity<List<ActivityDto>> getActivitiesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(activityService.getActivitiesByCourse(courseId));
    }

    // ***** ESTUDIANTE *****

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("/student/activity/{activityId}/result")
    public ResponseEntity<ActivityResultDto> submitActivityResult(
            @PathVariable Long activityId,
            @RequestBody ActivityResultDto resultDto,
            @AuthenticationPrincipal UserDetails student) {

        ActivityResultDto saved = activityResultService.submitResult(activityId, student.getUsername(), resultDto);
        return ResponseEntity.ok(saved);
    }

    // Opcional: listar actividades + resultados para mostrar el progreso del estudiante
//    @GetMapping("/course/{courseId}/with-results")
//    @PreAuthorize("hasAuthority('STUDENT')")
//    public ResponseEntity<List<ActivityWithResultDto>> getActivitiesWithResults(
//            @PathVariable Long courseId,
//            @AuthenticationPrincipal UserDetails student) {
//
//        return ResponseEntity.ok(activityService.getActivitiesWithStudentResults(courseId, student.getUsername()));
//    }

    // ***** ACTIVIDAD DE TEST *****
    // Profesor crea test completo
    @PostMapping("/teacher/course/{courseId}/test")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Void> createTest(
            @PathVariable Long courseId,
            @RequestBody TestDto dto,
            @AuthenticationPrincipal UserDetails teacher) {

        activityService.createTestWithQuestions(courseId, dto, teacher.getUsername());
        return ResponseEntity.ok().build();
    }

    // Profesor ve el test completo
    @GetMapping("/teacher/test/{activityId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<TestDto> getTest(@PathVariable Long activityId) {
        return ResponseEntity.ok(activityService.getTestByActivityId(activityId));
    }

    // Estudiante ve preguntas del test
    @GetMapping("/student/activity/{activityId}/questions")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<QuestionDto>> getQuestions(@PathVariable Long activityId) {
        return ResponseEntity.ok(activityService.getQuestionsForActivity(activityId));
    }

    // Estudiante responde test (autocorrección)
    @PostMapping("/student/activity/{activityId}/submit-test")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<ActivityResultDto> submitTest(
            @PathVariable Long activityId,
            @RequestBody TestSubmissionDto dto,
            @AuthenticationPrincipal UserDetails student) {

        ActivityResultDto result = activityResultService.submitAutoEvaluatedTest(
                activityId,
                student.getUsername(),
                dto
        );
        return ResponseEntity.ok(result);
    }







}
