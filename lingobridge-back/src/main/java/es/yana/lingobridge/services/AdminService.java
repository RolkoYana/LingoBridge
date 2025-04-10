package es.yana.lingobridge.services;

import es.yana.lingobridge.entities.Administrator;
import es.yana.lingobridge.repositories.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public List<Administrator> findAll() {
        return adminRepository.findAll();
    }

    public Administrator findById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Administrator save(Administrator admin) {
        return adminRepository.save(admin);
    }

    public void delete(Long id) {
        adminRepository.deleteById(id);
    }
}
