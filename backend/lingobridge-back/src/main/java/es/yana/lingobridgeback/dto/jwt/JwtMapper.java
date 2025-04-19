package es.yana.lingobridgeback.dto.jwt;

import es.yana.lingobridgeback.entities.AppUser;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface JwtMapper {
    JwtRegisterResponse toDto(AppUser entity);
    AppUser toEntity(JwtRegisterRequest dto);

}
