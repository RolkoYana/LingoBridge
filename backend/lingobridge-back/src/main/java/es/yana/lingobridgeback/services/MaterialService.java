package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.entities.Material;
import es.yana.lingobridgeback.repositories.CourseRepository;
import es.yana.lingobridgeback.repositories.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;

    public List<Material> findByCourseId(Long id) {
        return materialRepository.findByCourseId(id);
    }

    public Material save(Material material) {
        return materialRepository.save(material);
    }

    // subir material
    public void uploadMaterial(Long courseId, MultipartFile file, String title, String youtubeLink, String username) throws IOException {
        Material material = new Material();

        material.setTitle(title);
        material.setYoutubeLink(youtubeLink);
        material.setUploadedAt(LocalDateTime.now());

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + courseId));

        material.setCourse(course);

        if (file != null && !file.isEmpty()) {
            String filename = fileStorageService.storeFile(file, courseId.toString());
            material.setFilename(filename);
        }

        materialRepository.save(material);
    }

    public void deleteMaterial(Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        if (material.getFilename() != null) {
            fileStorageService.deleteFile(material.getFilename(), material.getCourse().getId().toString());
        }

        materialRepository.delete(material);
    }


    public void updateMaterial(Long materialId, MultipartFile file, String title, String youtubeLink) throws IOException {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        if (file != null && !file.isEmpty()) {
            if (material.getFilename() != null) {
                fileStorageService.deleteFile(material.getFilename(), material.getCourse().getId().toString());
            }

            String newFilename = fileStorageService.storeFile(file, material.getCourse().getId().toString());
            material.setFilename(newFilename);
        }

        material.setTitle(title);
        material.setYoutubeLink(youtubeLink);
        material.setUploadedAt(LocalDateTime.now());

        materialRepository.save(material);
    }





}
