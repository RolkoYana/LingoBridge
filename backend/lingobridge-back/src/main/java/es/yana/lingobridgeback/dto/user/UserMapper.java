package es.yana.lingobridgeback.dto.user;

import es.yana.lingobridgeback.dto.CourseDto;
import es.yana.lingobridgeback.entities.AppUser;
import es.yana.lingobridgeback.entities.Course;
import es.yana.lingobridgeback.entities.Language;
import es.yana.lingobridgeback.enums.Role;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(
        componentModel = "spring"
)
public interface UserMapper {

    // Métodos auxiliares para filtrar datos según el rol del usuario
    default List<CourseDto> mapCourseGiven(AppUser user) {
        return user.getRoles().contains(Role.TEACHER)
                ? user.getCourseGiven().stream()
                    .map(course -> new CourseDto(course.getId(), course.getName()))
                    .toList()
                : List.of();
    }

    default List<CourseDto> mapCoursesEnrolled(AppUser user) {
        return user.getRoles().contains(Role.STUDENT)
                ? user.getCoursesEnrolled().stream()
                    .map(course -> new CourseDto(course.getId(), course.getName()))
                    .toList()
                : List.of();
    }

    default Language mapLanguageTaught(AppUser user) {
        return user.getRoles().contains(Role.TEACHER) ? user.getLanguageTaught() : null;
    }

    @Mapping(target = "passwordConfirm", source = "password")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "courseGiven", expression = "java(mapCourseGiven(user))")
    @Mapping(target = "coursesEnrolled", expression = "java(mapCoursesEnrolled(user))")
    @Mapping(target = "languageTaught", expression = "java(mapLanguageTaught(user))")
    UserDto toDto(AppUser user);
    AppUser toEntity(UserDto userDto);

    List<UserDto> toDtoList(List<AppUser> list);
    List<AppUser> toEntityList(List<UserDto> list);
}
