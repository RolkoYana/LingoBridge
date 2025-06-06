package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.Material;
import es.yana.lingobridgeback.services.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"https://lingobridge.es", "http://localhost:5173"})
public class MaterialController {

    private final MaterialService materialService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /// ////////////////////
    ///     PROFESOR
    /// ///////////////////

    // subir material al curso
    @PreAuthorize("hasAuthority('TEACHER')")
    @PostMapping("/teacher/course/{courseId}/add-material")
    public ResponseEntity<?> uploadMaterial(
            @PathVariable Long courseId,
            @RequestParam(value = "file", required = false) MultipartFile file, // required = false --> que no es obligatorio
            @RequestParam("title") String title,
            @RequestParam(value = "youtubeLink", required = false) String youtubeLink,
            Principal principal
    ) {
        try {
            materialService.uploadMaterial(courseId, file, title, youtubeLink, principal.getName());
            return ResponseEntity.ok("Material subido correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir el material: " + e.getMessage());
        }
    }

    // ver material del curso
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/course/{courseId}/material")
    public ResponseEntity<List<Material>> getMaterialsByCourse(@PathVariable Long courseId) {
        List<Material> materials = materialService.findByCourseId(courseId);

        for (Material material : materials) {
            // extraer solo el nombre del archivo del filePath
            String filename = material.getFilename();
            material.setFilename(filename);
        }

        return ResponseEntity.ok(materials);
    }

    // descargar archivo
    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping("/teacher/course/{courseId}/material/download/{filename}")
    public ResponseEntity<Resource> downloadMaterial(
            @PathVariable Long courseId,
            @PathVariable String filename) {
        try {
            // ruta completa: /uploads/course_{courseId}/filename
            Path filePath = Paths.get(uploadDir)
                    .resolve("course_" + courseId)
                    .resolve(filename);

            Resource resource = new FileSystemResource(filePath);

            if (!resource.exists()) {
                System.out.println("Archivo no encontrado: " + filePath.toAbsolutePath());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // eliminar material
    @PreAuthorize("hasAuthority('TEACHER')")
    @DeleteMapping("/teacher/material/{materialId}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long materialId) {
        try {
            materialService.deleteMaterial(materialId);
            return ResponseEntity.ok("Material eliminado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el material: " + e.getMessage());
        }
    }

    // modificar material
    @PreAuthorize("hasAuthority('TEACHER')")
    @PutMapping("/teacher/material/{materialId}")
    public ResponseEntity<?> updateMaterial(
            @PathVariable Long materialId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "youtubeLink", required = false) String youtubeLink
    ) {
        try {
            materialService.updateMaterial(materialId, file, title, youtubeLink);
            return ResponseEntity.ok("Material actualizado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el material: " + e.getMessage());
        }
    }


    /// ////////////////////
    ///     ESTUDIANTE
    /// ////////////////////

    // ver material del curso
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/course/{courseId}/material")
    public ResponseEntity<List<Material>> getMaterialsByCourseForStudent(@PathVariable Long courseId) {
        List<Material> materials = materialService.findByCourseId(courseId);

        for (Material material : materials) {
            // Extraer solo el nombre del archivo del filePath
            String filename = material.getFilename();
            material.setFilename(filename);
        }

        return ResponseEntity.ok(materials);
    }

    // descargar archivo
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/student/course/{courseId}/material/download/{filename}")
    public ResponseEntity<Resource> downloadMaterialForStudent(
            @PathVariable Long courseId,
            @PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir)
                    .resolve("course_" + courseId)
                    .resolve(filename);

            Resource resource = new FileSystemResource(filePath);

            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
