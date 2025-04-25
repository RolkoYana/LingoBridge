package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.dto.jwt.JwtMapper;
import es.yana.lingobridgeback.dto.jwt.JwtRegisterRequest;
import es.yana.lingobridgeback.dto.user.UserDto;
import es.yana.lingobridgeback.dto.user.UserMapper;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AppUserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtMapper jwtMapper;

    public List<AppUser> findAll() {
        return userRepository.findAll();
    }

    public AppUser findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public AppUser save(UserDto userDto) {
        AppUser user = userMapper.toEntity(userDto);
        // Asignar roles correctamente
        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>(userDto.getRoles())); // convertir list a set
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // metodo save() para JWT
    public AppUser save(JwtRegisterRequest dto){
        AppUser user = jwtMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<AppUser> findAllStudents(){
        return userRepository.findByRole(Role.STUDENT);
    }

    public List<AppUser> findAllTeachers() {
        return userRepository.findByRole(Role.TEACHER);
    }

    public AppUser findByUsernameOrEmail(String input){
        return userRepository.findByUsername(input)
                .orElseGet(() -> userRepository.findByEmail(input).orElse(null));
    }

    public Optional<AppUser> findByUsername(String username){
        return userRepository.findByUsername(username);
    }

}
