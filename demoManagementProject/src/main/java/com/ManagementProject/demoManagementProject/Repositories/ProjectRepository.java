package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Project;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import javax.swing.text.Document;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends MongoRepository<Project, String> {
    Optional<Project> findByProjectId(String projectId);

    List<Project> findByProjectName(String projectName);

    Boolean existsByProjectId(String projectId);

    List<Project> findByStatus(String status);

    List<Project> findByProjectOwnerId(String projectOwnerId);

    List<Project> findByMembersContains(String memberId);

}
