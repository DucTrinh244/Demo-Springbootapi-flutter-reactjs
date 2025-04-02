package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.ProjectUpdates;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectUpdatesRepository extends MongoRepository<ProjectUpdates,String> {
    List<ProjectUpdates> findByProjectId(String projectId);

    List<ProjectUpdates> findByStatus(String status);

    List<ProjectUpdates> findByUpdatedBy(String updatedBy);
}
