package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins ={ "http://192.168.1.124/","http://localhost:5173/"})
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.addUser(user);
    }
}