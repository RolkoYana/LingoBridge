# Guía de Despliegue - LingoBridge

## Despliegue del Backend (Railway)

### Preparación del proyecto

1. **Generar el archivo JAR ejecutable**
   ```
   cd backend/lingobridge-back
   ./mvnw clean package
   ```

2. **Configurar archivo `system.properties`**
   
   Crear el archivo `system.properties` en la raíz del proyecto backend:
   ```
   java.runtime.version=21
   ```

3. **Configurar variables de entorno para Railway**
   
   En el archivo `application.properties`:
   ```
   # Base de datos (Railway las configura automáticamente)
   spring.datasource.url=jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}
   spring.datasource.username=${PGUSER}
   spring.datasource.password=${PGPASSWORD}

   # JWT
   jwt.secret=${JWT_SECRET}
   jwt.expiration=${JWT_EXPIRATION}

   # Email
   spring.mail.host=${SPRING_MAIL_HOST}
   spring.mail.port=${SPRING_MAIL_PORT}
   spring.mail.username=${SPRING_MAIL_USERNAME}
   spring.mail.password=${SPRING_MAIL_PASSWORD}

   # Frontend URL
   app.frontend.url=${APP_FRONTEND_URL}

   # Perfil de producción
   spring.profiles.active=${SPRING_PROFILES_ACTIVE}
   ```

### Despliegue en Railway

1. **Subir cambios al repositorio de GitHub**

2. **Configurar proyecto en Railway**
   - Ir a [Railway](https://railway.app)
   - Crear nuevo proyecto desde el repositorio de GitHub
   - **Root directory**: `backend/lingobridge-back`
   - Railway detectará automáticamente el `pom.xml`

3. **Configurar variables de entorno en Railway**
   ```
   JWT_SECRET=tu_clave_secreta_jwt_segura
   JWT_EXPIRATION=86400
   SPRING_MAIL_HOST=smtp-relay.brevo.com
   SPRING_MAIL_PORT=587
   SPRING_MAIL_USERNAME=***
   SPRING_MAIL_PASSWORD=***
   SPRING_MAIL_FROM=rolkoyana@dominio.com
   APP_FRONTEND_URL=https://lingobridge.es
   SPRING_PROFILES_ACTIVE=prod
   ```

4. **Desplegar**
   - Railway iniciará automáticamente el build y despliegue
   - El proceso ejecutará: `mvn clean install` y `java -jar target/app.jar`

---

## Despliegue del Frontend (Netlify)

### Preparación del proyecto

1. **Generar build de producción**
   ```
   cd frontend
   npm run build
   ```
   
   > **Nota**: Con Vite se genera la carpeta `dist` en lugar de `build`

2. **Subir cambios a GitHub**

### Configuración en Netlify

1. **Crear nuevo proyecto en Netlify**
   - Ir a [Netlify](https://netlify.com)
   - "Import an existing project" y conectar con el respositorio de GitHub

2. **Configuración de build**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

3. **Variables de entorno**
   ```
   VITE_API_BASE_URL=https://kind-inspiration-production.up.railway.app/api
   ```

4. **Configurar redirects para React Router**
   
   Crear archivo `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

5. **Desplegar**
   - Netlify iniciará automáticamente el build
   - El proceso ejecutará: `npm run build` y desplegará desde `frontend/dist`

### URL final de producción
```
https://lingobridge.es
```

---

## Configuración de Dominio Personalizado

### Dominio en INWX

1. **Configurar DNS en INWX**

2. **Configurar dominio personalizado en Netlify**
   - "Site settings" → "Domain management"
   - "Add custom domain": `lingobridge.es`
   - Netlify configurará automáticamente SSL/TLS

### URL final de producción
```
https://lingobridge.es
```

---


# INFORMACION SOBRE EL ARRANQUE EN LOCAL

## Iniciar el Frontend (Desde VS Code)

1. En la carpeta `frontend/src`:
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

1. En la carpeta `backend/src`:
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
