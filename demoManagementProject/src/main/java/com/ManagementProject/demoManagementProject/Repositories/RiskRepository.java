package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Risk;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RiskRepository extends MongoRepository<Risk, String> {
}
