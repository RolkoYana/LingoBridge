package es.yana.lingobridgeback.dto.jwt;

import es.yana.lingobridgeback.enums.Role;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtLoginResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private Set<Role> roles;
}
