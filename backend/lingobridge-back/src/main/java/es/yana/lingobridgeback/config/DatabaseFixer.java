package es.yana.lingobridgeback.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔧 Iniciando DatabaseFixer...");

        try {
            // Primero verificar cuántos usuarios tienen enabled = null
            Integer nullCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE enabled IS NULL",
                    Integer.class
            );
            System.out.println("📊 Usuarios con enabled=null: " + nullCount);

            if (nullCount != null && nullCount > 0) {
                // Actualizar los registros
                int updated = jdbcTemplate.update("UPDATE users SET enabled = true WHERE enabled IS NULL");
                System.out.println("✅ Actualizados " + updated + " usuarios con enabled=null");
            } else {
                System.out.println("ℹ️ No hay usuarios con enabled=null");
            }

            // Verificar después del update
            Integer nullCountAfter = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE enabled IS NULL",
                    Integer.class
            );
            System.out.println("📊 Usuarios con enabled=null después del update: " + nullCountAfter);

        } catch (Exception e) {
            System.out.println("❌ Error en DatabaseFixer: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
