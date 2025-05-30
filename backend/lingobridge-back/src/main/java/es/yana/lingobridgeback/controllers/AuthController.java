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
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;
    private final AppUserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody JwtRegisterRequest jwtRegisterRequest) {
        if (jwtRegisterRequest == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Datos inválidos"));
        }

        Optional<AppUser> existingUserOpt = userService.findByEmail(jwtRegisterRequest.getEmail());

        // Caso 1: El usuario ya existe --> añadir roles si son nuevos
        if (existingUserOpt.isPresent()) {
            AppUser existingUser = existingUserOpt.get();

            Set<Role> requestedRoles = jwtRegisterRequest.getRoles();
            Set<Role> currentRoles = existingUser.getRoles();

            // Si ya tiene todos los roles solicitados → error
            if (currentRoles.containsAll(requestedRoles)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Este usuario ya tiene los roles asignados"));
            }

            // Añadir nuevos roles
            currentRoles.addAll(requestedRoles);
            existingUser.setRoles(currentRoles);

            // Guardar actualización
            userService.save(existingUser);

            return ResponseEntity.ok(Map.of(
                    "message", "Roles añadidos correctamente",
                    "roles_actuales", currentRoles.stream().map(Role::name).toList()
            ));
        }

        // Caso 2: Usuario nuevo --> validar datos y crear
        if (userService.findByUsername(jwtRegisterRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        if (!jwtRegisterRequest.getPassword().equals(jwtRegisterRequest.getPasswordConfirm())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Las contraseñas no coinciden"));
        }

        try {
            // Cifrar contraseña
            String encryptedPassword = passwordEncoder.encode(jwtRegisterRequest.getPassword());
            jwtRegisterRequest.setPassword(encryptedPassword);

            // Crear y guardar usuario nuevo
            AppUser savedUser = userService.save(jwtRegisterRequest);

            JwtRegisterResponse response = JwtRegisterResponse.builder()
                    .id(savedUser.getId())
                    .username(savedUser.getUsername())
                    .registerDate(LocalDateTime.now())
                    .build();

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

            return ResponseEntity.created(location).body(response);
        } catch (Exception e) {
            log.error("Error en el registro", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }




    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody JwtLoginRequest loginRequest) throws Exception {
        log.info("Intentando autenticar usuario: {}", loginRequest.getUsername());

            try {
                // Paso 1: autenticar el usuario
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(), loginRequest.getPassword()
                ));

                // Paso 2: obtener detalles del usuario
                UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
                AppUser user = userService.findByUsername(loginRequest.getUsername())
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

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
                        : List.of(); // si es admin - no tiene cursos

                // Paso 4: convertir Set<Role> en List<String> antes de enviarlo al frontend
//                List<String> roles = user.getRoles().stream()
//                        .map(Role::name) // Convertir enum Role a String
//                        .toList();

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
                return ResponseEntity.status(403).body(Map.of("error", "Usuario deshabilitado"));
            } catch (BadCredentialsException e) {
                log.warn("Credenciales incorrectas: {}", e.getMessage());
                return ResponseEntity.status(401).body(Map.of("error", "Credenciales no válidas"));
            } catch (Exception e) {
                log.error("Error completo al intentar login: ", e);
                throw e;
            }
    }







}
