package es.yana.lingobridgeback.dto.activity;

import es.yana.lingobridgeback.entities.Activity;
import es.yana.lingobridgeback.enums.ActivityType;
import lombok.*;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDto {
    private Long id;
    private String title;
    private String description;
    private ActivityType type;
    private LocalDate dueDate;

    public ActivityDto(Activity activity) {
        this.id = activity.getId();
        this.title = activity.getTitle();
        this.description = activity.getDescription();
        this.type = activity.getType();
        this.dueDate = activity.getDueDate();
    }
}
