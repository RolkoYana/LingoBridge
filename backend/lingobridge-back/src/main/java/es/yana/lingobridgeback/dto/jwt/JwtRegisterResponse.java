package es.yana.lingobridgeback.dto.jwt;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtRegisterResponse {
    private Long id;
    private String username;
    private LocalDateTime registerDate;
}
