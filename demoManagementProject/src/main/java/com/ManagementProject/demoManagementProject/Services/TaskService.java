package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository; // Để lấy thông tin dự án từ Project

    // Tạo nhiệm vụ và liên kết với dự án
    public Task createTask(Task task, String projectId) {
        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        task.setProject(project);  // Liên kết nhiệm vụ với dự án
        return taskRepository.save(task);
    }
}