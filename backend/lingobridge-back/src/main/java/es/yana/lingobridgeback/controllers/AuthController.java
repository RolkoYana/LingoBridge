package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.jwt.JwtLoginRequest;
import es.yana.lingobridgeback.dto.jwt.JwtLoginResponse;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterRequest;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterResponse;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.security.jwt.JwtTokenProvider;
import es.yana.lingobridgeback.services.AppUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://lingobridge.es", "http://localhost:5173"})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final AppUserService userService;
    private final JavaMailSender mailSender;

    // Email desde el cual se envia el mensaje de activacion de cuenta
    @Value("${spring.mail.from:rolkoyana@gmail.com}")
    private String fromEmail;

    // URL del frontend para los enlaces de verificación
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody JwtRegisterRequest jwtRegisterRequest) {
        if (jwtRegisterRequest == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Datos inválidos"));
        }

        Optional<AppUser> existingUserOpt = userService.findByEmail(jwtRegisterRequest.getEmail());

        // Caso 1: El usuario ya existe
        if (existingUserOpt.isPresent()) {
            AppUser existingUser = existingUserOpt.get();
            if (existingUser.isEnabled()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo electrónico ya está registrado y verificado."));
            } else {
                existingUser.setVerificationToken(UUID.randomUUID().toString());
                existingUser.setTokenExpiryDate(LocalDateTime.now().plusHours(24));
                userService.save(existingUser);
                sendVerificationEmail(existingUser);
                return ResponseEntity.ok(Map.of("message", "El correo electrónico ya está registrado pero no verificado. Se ha reenviado el correo de verificación.", "email", existingUser.getEmail()));
            }
        }

        // Caso 2: Usuario nuevo --> validar datos y crear
        if (userService.findByUsername(jwtRegisterRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        if (!jwtRegisterRequest.getPassword().equals(jwtRegisterRequest.getPasswordConfirm())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Las contraseñas no coinciden"));
        }

        try {
            // El método userService.save(jwtRegisterRequest) se encarga de:
            // 1. Cifrar la contraseña
            // 2. Crear y guardar el usuario nuevo
            // 3. Asignar enabled=false, generar verificationToken y tokenExpiryDate
            AppUser savedUser = userService.save(jwtRegisterRequest);

            // Enviar correo de verificación
            try {
                sendVerificationEmail(savedUser);
            } catch (Exception e) {
                log.error("Error al enviar el correo de verificación a {}: {}", savedUser.getEmail(), e.getMessage());
                return ResponseEntity.status(500).body(Map.of("error", "Error al enviar el correo de verificación. Intenta más tarde."));
            }


            JwtRegisterResponse response = JwtRegisterResponse.builder()
                    .id(savedUser.getId())
                    .username(savedUser.getUsername())
                    .registerDate(LocalDateTime.now())
                    .build();

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

            return ResponseEntity.created(location).body(Map.of("message", "Registro exitoso. Se ha enviado un correo de verificación a " + savedUser.getEmail() + ". Por favor, verifica tu cuenta."));
        } catch (Exception e) {
            log.error("Error en el registro", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor al intentar registrar el usuario."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody JwtLoginRequest loginRequest) throws Exception {
        log.info("Intentando autenticar usuario: {}", loginRequest.getUsername());

        try {
            // Paso 1: Obtener detalles del usuario para verificar si está habilitado
            AppUser user = userService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            // Verificar si el usuario está habilitado (email verificado)
            if (!user.isEnabled()) {
                throw new DisabledException("Su cuenta no ha sido verificada. Por favor, revise su correo electrónico para el enlace de verificación.");
            }

            // Paso 2: autenticar el usuario
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), loginRequest.getPassword()
            ));

            // Si la autenticación es exitosa, se procede a generar el token
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

            // Paso 3: generar el token con los detalles del usuario
            String token = jwtTokenProvider.generateToken(userDetails);

            // Paso 4: obtener los cursos del usuario segun su rol
            List<Map<String, Object>> courses = user.getRoles().contains(Role.STUDENT)
                    ? user.getCoursesEnrolled().stream()
                    .map(course -> Map.of("id", (Object)course.getId(), "name", (Object)course.getName()))
                    .toList()
                    : user.getRoles().contains(Role.TEACHER)
                    ? user.getCourseGiven().stream()
                    .map(course -> Map.of("id", (Object)course.getId(), "name", (Object)course.getName()))
                    .toList()
                    : List.of();

            // Paso 5: enviar respuesta con token y roles
            return ResponseEntity.ok(
                    JwtLoginResponse.builder()
                            .token(token)
                            .username(user.getUsername())
                            .name(user.getName())
                            .roles(user.getRoles().stream().map(Role::name).toList())
                            .courses(courses)
                            .build()
            );

        } catch (DisabledException e) {
            log.warn("Usuario deshabilitado: {}", e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage())); // Mensaje más descriptivo
        } catch (BadCredentialsException e) {
            log.warn("Credenciales incorrectas: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales no válidas"));
        } catch (UsernameNotFoundException e) {
            log.warn("Usuario no encontrado: {}", e.getMessage());
            return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
        } catch (Exception e) {
            log.error("Error completo al intentar login: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    // Verificación de email
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        Optional<AppUser> userOpt = userService.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            // Verificar si existe un usuario con ese token ya usado (null)
            // Esto requiere una búsqueda adicional o cambiar la lógica
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Este enlace de verificación ya ha sido usado o ha expirado. Si ya tienes una cuenta, puedes iniciar sesión directamente."
            ));
        }

        AppUser user = userOpt.get();

        if (user.isEnabled()) {
            return ResponseEntity.ok(Map.of("message", "Tu cuenta ya ha sido verificada anteriormente. Puedes iniciar sesión."));
        }

        if (user.getTokenExpiryDate() == null || user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El token de verificación ha expirado. Por favor, intenta registrarte de nuevo o solicita un nuevo correo de verificación."));
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setTokenExpiryDate(null);
        userService.save(user);

        return ResponseEntity.ok(Map.of("message", "¡Tu cuenta ha sido verificada exitosamente! Ahora puedes iniciar sesión."));
    }

    // Método privado para enviar el correo de verificación
    private void sendVerificationEmail(AppUser user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail().trim());
            message.setSubject("Verifica tu cuenta LingoBridge");

            // Construye la URL de verificación que lleva al FRONTEND, no a la API
            String verificationUrl = frontendUrl + "/verify?token=" + user.getVerificationToken();

            // Contenido del correo electrónico
            message.setText("Hola " + user.getUsername() + ",\n\n" +
                    "Gracias por registrarte en LingoBridge. Por favor, haz clic en el siguiente enlace para verificar tu cuenta:\n\n" +
                    verificationUrl + "\n\n" +
                    "Este enlace expirará en 24 horas.\n\n" +
                    "Saludos,\n" +
                    "El equipo de LingoBridge");

            log.info("Enviando correo desde {} hacia {}", fromEmail, user.getEmail());
            mailSender.send(message);
            log.info("Correo de verificación enviado exitosamente a {}", user.getEmail());

        } catch (Exception e) {
            log.error("Error detallado al enviar correo: ", e);
            throw new RuntimeException("Error al enviar correo: " + e.getMessage(), e);
        }
    }
}