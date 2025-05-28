## Iniciar el Frontend (Desde VS Code)

1. Ir a la carpeta `frontend/src`:
   ```
   cd frontend/src
   ```
2. Instalar las dependencias:
   ```
   npm install
   ```
3. Ejecutar el proyecto:
   - opcion 1:
   ```
   npm start
   ```
   - opcion 2:
   ```
   npm run dev
   ```

## Iniciar backend (Desde IntelliJ IDEA)

1. Ir a la carpeta `backend/src`:
   ```
   cd backend/src
   ```
2. Compilar:
   ```
   mvn clean install -DskipTests
   ```
   _-DskipTests - ignora los tests_
3. Arrancar:
   ```
   mvn spring-boot:run
   ```
