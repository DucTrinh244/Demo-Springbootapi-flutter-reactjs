package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.DTOS.UserDTO;
import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User addUser(User user) {
        // Kiểm tra xem email đã tồn tại hay chưa
        if (userRepository.existsByEmail(user.getEmail())) {
           return null; // Hoặc ném ra một exception tùy ý
        }
        return userRepository.save(user);
    }


}
