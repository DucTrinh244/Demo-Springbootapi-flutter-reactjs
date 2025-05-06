package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Payload.Response.UserResponse;
import com.ManagementProject.demoManagementProject.Services.UserService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public User createUser(
            @RequestBody User user) {
        return userService.addUser(user);
    }
    @GetMapping("/profile")
    public UserResponse getCurrentUser() {
        String email = CurrentUserUtil.getCurrentUserEmail();
        return userService.getUserByEmail(email);
    }

//    @PutMapping("/profile")
//    public UserResponse updateCurrentUser() {
//        String email = CurrentUserUtil.getCurrentUserEmail();
//        User user = userService.getUserByEmail(email);
//        if (user != null) {
//            user.setName(user.getName());
//            user.setPhone(user.getPhone());
//            userService.addUser(user);
//            return userService.getUserByEmail(email);
//        } else {
//            return null; // Hoặc ném ra một exception tùy ý
//        }
//        return null; // Hoặc ném ra một exception tùy ý
//    }
}