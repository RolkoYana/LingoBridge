package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.User;
import es.yana.lingobridgeback.enums.Role;
import es.yana.lingobridgeback.respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAllStudents(){
        return userRepository.findByRole(Role.STUDENT);
    }

    public List<User> findAllTeachers() {
        return userRepository.findByRole(Role.TEACHER);
    }

}
