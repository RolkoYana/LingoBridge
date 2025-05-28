package es.yana.lingobridgeback.converters;

import es.yana.lingobridgeback.enums.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

// esta clase convierte Set<Role> en una cadena de texto antes de guardar en BD
// almacena columna "roles" en la tabla "users" como cadena de texto
// pero en la app sigue manejandola como Set<Role>

@Converter
public class RoleConverter implements AttributeConverter<Set<Role>, String> {
    @Override
    public String convertToDatabaseColumn(Set<Role> roles) {
        return roles != null ? String.join(",", roles.stream().map(Enum::name).toList()) : "";
    }

    @Override
    public Set<Role> convertToEntityAttribute(String dbData) {
        return dbData != null && !dbData.isEmpty() ?
                Arrays.stream(dbData.split(",")).map(Role::valueOf).collect(Collectors.toSet()) : new HashSet<>();
    }
}
