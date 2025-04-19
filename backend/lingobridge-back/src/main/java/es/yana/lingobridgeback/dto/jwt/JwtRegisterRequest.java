package es.yana.lingobridgeback.dto.jwt;

import es.yana.lingobridgeback.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtRegisterRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String surname;
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    @NotNull
    private String email;
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    private Set<Role> roles;

}
