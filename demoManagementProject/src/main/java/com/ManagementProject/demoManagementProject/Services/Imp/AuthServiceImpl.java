package com.ManagementProject.demoManagementProject.Services.Imp;
import com.ManagementProject.demoManagementProject.DTOS.UserDTO;
import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Payload.Request.SignupRequest;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO creatUser(SignupRequest signupRequest) {

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return null;
        }
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setPhone(signupRequest.getPhone());

       User createUser= userRepository.save(user);
       UserDTO userDTO= new UserDTO();
        userDTO.setEmail(createUser.getEmail());
        userDTO.setName(createUser.getName());
        userDTO.setPhone(createUser.getPhone());
        return userDTO;
    }
}
