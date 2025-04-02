package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
//    User findFirstByEmail(String email);

}
