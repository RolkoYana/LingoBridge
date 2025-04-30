-- Insertar usuarios
INSERT INTO users (name, surname, username, email, password, roles)
VALUES
    ('Yana', 'Rolko', 'yanarolko', 'rolkoyana@gmail.com', 'yanar123', '{ADMIN}'),
    ('Pilar', 'Martinez', 'pilarmartinez', 'pilarm@lingobridge.com', 'pilarm123', '{TEACHER}'),
    ('Daniel', 'Schmidt', 'danielschmidt', 'daniels@lingobridge.com', 'daniels123', '{TEACHER}'),
    ('Alex', 'Johnson', 'alexjohnson', 'alexj@lingobridge.com', 'alexj123', '{TEACHER,STUDENT}'),
    ('Sophie', 'Dubois', 'sophiedubois', 'sophied@lingobridge.com', 'sophied123', '{TEACHER}'),
    ('Laura', 'Gomez', 'lauragomez', 'laurag@lingobridge.com', 'laurag123', '{STUDENT}'),
    ('Carlos', 'Fernandez', 'carlosfernandez', 'carlosf@lingobridge.com', 'carlosf123', '{STUDENT}'),
    ('Jose', 'Perez', 'joseperez', 'josep@lingobridge.com', 'josep123', '{STUDENT}');

-- Insertar idiomas
-- NSERT INTO language (name) VALUES ('English'), ('French'), ('Spanish'), ('German');

-- Insertar cursos
-- INSERT INTO course (name, description, approved, teacher_id)
-- VALUES
   -- ('Ingles Nivel A1', 'Curso basico de ingles', true, (SELECT id FROM users WHERE username='alexjohnson')),
   -- ('Frances Nivel A2', 'Curso intermedio de frances', true, (SELECT id FROM users WHERE username='sophiedubois')),
   -- ('Español Nivel B1', 'Curso avanzado de español', true, (SELECT id FROM users WHERE username='pilarmartinez'));