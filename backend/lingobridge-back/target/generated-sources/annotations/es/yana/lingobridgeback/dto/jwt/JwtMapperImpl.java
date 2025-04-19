package es.yana.lingobridgeback.dto.jwt;

import es.yana.lingobridgeback.entities.AppUser;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T20:52:04+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class JwtMapperImpl implements JwtMapper {

    @Override
    public JwtRegisterResponse toDto(AppUser entity) {
        if ( entity == null ) {
            return null;
        }

        JwtRegisterResponse.JwtRegisterResponseBuilder jwtRegisterResponse = JwtRegisterResponse.builder();

        jwtRegisterResponse.id( entity.getId() );
        jwtRegisterResponse.username( entity.getUsername() );

        return jwtRegisterResponse.build();
    }

    @Override
    public AppUser toEntity(JwtRegisterRequest dto) {
        if ( dto == null ) {
            return null;
        }

        AppUser.AppUserBuilder appUser = AppUser.builder();

        appUser.name( dto.getName() );
        appUser.surname( dto.getSurname() );
        appUser.username( dto.getUsername() );
        appUser.email( dto.getEmail() );
        appUser.password( dto.getPassword() );

        return appUser.build();
    }
}
