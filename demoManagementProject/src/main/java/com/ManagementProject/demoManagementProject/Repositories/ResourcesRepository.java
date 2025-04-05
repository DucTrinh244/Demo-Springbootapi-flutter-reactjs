package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Resources;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourcesRepository extends MongoRepository<Resources,String> {
    List<Resources> findByProjectId(String projectId);

}
