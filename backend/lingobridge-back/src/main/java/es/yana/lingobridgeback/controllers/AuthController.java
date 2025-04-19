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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final AppUserService userService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody JwtLoginRequest loginRequest) throws Exception {
        log.info("Intentando login para: {}", loginRequest.getUsername());
        try{
            // decimos que autentique el usuario y genere un nuevo token
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), loginRequest.getPassword()
            ));
        }catch(DisabledException e){
            throw new Exception("USER_DISABLED", e);
        }catch(BadCredentialsException e){
            throw new Exception("INVALID_CREDENTIALS", e);
        }

        // si todo OK, carga todos datos de usuario de BD en UserDetails (obj usuario de spring)
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = jwtTokenProvider.generateToken(userDetails); // genera token, utiliza el secreto de app.propertires
        AppUser user = userService.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // genera la respuesta con token, usuario y roles
        return ResponseEntity.ok(
                JwtLoginResponse.builder()
                        .token(token)
                        .username(user.getUsername())
                        .roles(new HashSet<>(user.getRoles()))
                        .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody JwtRegisterRequest jwtRegisterRequest) throws Exception{

        if(jwtRegisterRequest == null){
            return ResponseEntity.badRequest().body(Map.of("error", "Datos invalidos"));
        }
        if(userService.findByEmail(jwtRegisterRequest.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body(Map.of("error", "Email ya registrado"));
        }
        if(userService.findByUsername(jwtRegisterRequest.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        try{
            AppUser savedUser = userService.save(jwtRegisterRequest);

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

}
