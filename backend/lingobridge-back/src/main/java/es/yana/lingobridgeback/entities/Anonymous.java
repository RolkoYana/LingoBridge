package es.yana.lingobridgeback.entities;


import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Anonymous extends User{
}
