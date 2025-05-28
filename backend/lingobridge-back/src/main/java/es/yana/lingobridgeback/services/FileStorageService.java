package es.yana.lingobridgeback.services;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;

/*
    se encarga de almacenamiento de archivos
 */
@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir; // Directorio de subida

    // crear directorio de subida si no existe
    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar el directorio de subida", e);
        }
    }

    // guarda el archivo en el directorio
    public String storeFile(MultipartFile file, String courseFolder) throws IOException {
        // limpiar el nombre del archivo
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // directorio donde se almacenará el archivo, por curso
        Path courseDir = Paths.get(uploadDir).resolve("course_" + courseFolder);

        Files.createDirectories(courseDir); // crear los directorios si no existen

        Path targetLocation = courseDir.resolve(fileName); // ruta completa al archivo

        // copiar el archivo al destino
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }


}
