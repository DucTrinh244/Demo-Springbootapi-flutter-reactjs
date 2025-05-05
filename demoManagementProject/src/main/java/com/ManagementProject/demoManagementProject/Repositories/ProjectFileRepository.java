package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.ProjectFile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectFileRepository extends MongoRepository<ProjectFile, String> {

    Boolean  existsByProjectId(String projectId);

    List<ProjectFile> findByProjectId(String projectId);

}
