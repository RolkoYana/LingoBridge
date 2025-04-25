package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.dto.jwt.JwtLoginRequest;
import es.yana.lingobridgeback.dto.jwt.JwtLoginResponse;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterRequest;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterResponse;
import es.yana.lingobridgeback.entities.AppUser;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final AppUserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody JwtRegisterRequest jwtRegisterRequest) throws Exception{

        if(jwtRegisterRequest == null){
            return ResponseEntity.badRequest().body(Map.of("error", "Datos invalidos"));
        }

        // validar email y username unicos
        if(userService.findByEmail(jwtRegisterRequest.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body(Map.of("error", "Email ya registrado"));
        }
        if(userService.findByUsername(jwtRegisterRequest.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        // validar que las contraseñas coincidan
        if(!jwtRegisterRequest.getPassword().equals(jwtRegisterRequest.getPasswordConfirm())){
            return ResponseEntity.badRequest().body(Map.of("error", "Las contraseñas no coinciden"));
        }

        try{
            // Cifrar la contraseña antes de guardar
            String encryptedPassword = passwordEncoder.encode(jwtRegisterRequest.getPassword());
            jwtRegisterRequest.setPassword(encryptedPassword);

            // Crear y guardar el usuario
            AppUser savedUser = userService.save(jwtRegisterRequest);

            // Crear respuesta
            JwtRegisterResponse response = JwtRegisterResponse.builder()
                    .id(savedUser.getId())
                    .username(savedUser.getUsername())
                    .registerDate(LocalDateTime.now())
                    .build();

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();

            return ResponseEntity.created(location).body(response);
        }catch (Exception e){
            log.error("Error en el registro", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody JwtLoginRequest loginRequest) throws Exception {
        log.info("Intentando autenticar usuario: {}", loginRequest.getUsername());

        try{
            // paso 1: autenticar el usuario y generar un nuevo token
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), loginRequest.getPassword()
            ));

            // paso 2: obtener detalles del usuario desde la BD
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

            // paso 3: generar el token con los detalles del usuario
            String token = jwtTokenProvider.generateToken(userDetails);

            // paso 4: devolver la respuesta con el token y roles
            AppUser user = userService.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            return ResponseEntity.ok(
                    JwtLoginResponse.builder()
                            .token(token)
                            .username(user.getUsername())
                            .roles(new HashSet<>(user.getRoles()))
                            .build()
            );
        }catch(DisabledException e){
            log.warn("Usuario deshabilitado: {}", e.getMessage());
            return ResponseEntity.status(403).body(Map.of("error", "Usuario deshabilitado"));
        }catch(BadCredentialsException e){
            log.warn("Credenciales incorrectas: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales no validas"));
        }catch(Exception e){
            log.error("Error completo al intentar login: ", e);
            throw e; // Lanza el error para que veas el stacktrace completo en Postman y consola
        }

    }

}
