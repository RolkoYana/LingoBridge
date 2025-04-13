package es.yana.lingobridgeback.controllers;

import es.yana.lingobridgeback.entities.User;
import es.yana.lingobridgeback.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAll(){
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id){
        return userService.findById(id);
    }

    @PostMapping
    public User create(@RequestBody User user){
        return userService.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User updatedUser){
        updatedUser.setId(id);
        return userService.save(updatedUser);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        userService.delete(id);
    }
}
