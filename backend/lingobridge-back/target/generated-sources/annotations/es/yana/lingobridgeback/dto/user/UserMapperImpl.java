package es.yana.lingobridgeback.dto.user;

import es.yana.lingobridgeback.entities.AppUser;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-18T20:52:04+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(AppUser user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        userDto.name( user.getName() );
        userDto.surname( user.getSurname() );
        userDto.username( user.getUsername() );
        userDto.password( user.getPassword() );
        userDto.email( user.getEmail() );

        return userDto.build();
    }

    @Override
    public AppUser toEntity(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        AppUser.AppUserBuilder appUser = AppUser.builder();

        appUser.name( userDto.getName() );
        appUser.surname( userDto.getSurname() );
        appUser.username( userDto.getUsername() );
        appUser.email( userDto.getEmail() );
        appUser.password( userDto.getPassword() );

        return appUser.build();
    }

    @Override
    public List<UserDto> toDtoList(List<AppUser> list) {
        if ( list == null ) {
            return null;
        }

        List<UserDto> list1 = new ArrayList<UserDto>( list.size() );
        for ( AppUser appUser : list ) {
            list1.add( toDto( appUser ) );
        }

        return list1;
    }

    @Override
    public List<AppUser> toEntityList(List<UserDto> list) {
        if ( list == null ) {
            return null;
        }

        List<AppUser> list1 = new ArrayList<AppUser>( list.size() );
        for ( UserDto userDto : list ) {
            list1.add( toEntity( userDto ) );
        }

        return list1;
    }
}
