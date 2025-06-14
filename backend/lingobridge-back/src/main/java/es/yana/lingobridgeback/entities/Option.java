package es.yana.lingobridgeback.entities;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private boolean correct; // la opción correcta

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
}
