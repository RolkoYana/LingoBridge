package es.yana.lingobridgeback.dto.jwt;

import es.yana.lingobridgeback.entities.AppUser;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring"
)
public interface JwtMapper {
    JwtRegisterResponse toDto(AppUser entity);
    AppUser toEntity(JwtRegisterRequest dto);

}
