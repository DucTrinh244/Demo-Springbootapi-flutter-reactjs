package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task,String> {
    List<Task> findByProjectId(String projectId);
    Task findFirstByProjectId(String projectId);
    boolean existsByProjectId(String projectId);

    List<Task> findByAssigneeEmail(String email);
}
