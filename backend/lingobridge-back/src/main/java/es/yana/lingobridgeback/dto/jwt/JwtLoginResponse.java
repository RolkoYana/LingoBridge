package es.yana.lingobridgeback.dto.jwt;

import es.yana.lingobridgeback.enums.Role;
import lombok.*;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtLoginResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String name;
    private String username;
    private List<String> roles; // convertimos Set a List
    private List<Map<String, Object>> courses;
}
