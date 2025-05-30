package es.yana.lingobridgeback;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/*
    CLASE PARA COMUNICACION ENTRE FRONT Y BACK
 */
@Configuration
@EnableWebMvc // activa configuraciones web de Spring
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins("https://lingobridge.es")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
