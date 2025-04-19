package es.yana.lingobridgeback.dto.user;

import es.yana.lingobridgeback.entities.AppUser;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface UserMapper {
    UserDto toDto(AppUser user);
    AppUser toEntity(UserDto userDto);

    List<UserDto> toDtoList(List<AppUser> list);
    List<AppUser> toEntityList(List<UserDto> list);
}
