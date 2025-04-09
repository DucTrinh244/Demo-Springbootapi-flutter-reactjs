package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    public List<User> getAllUsers();

    public User addUser(User user);
}