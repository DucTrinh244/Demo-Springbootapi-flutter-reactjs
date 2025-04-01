package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    // Tạo mới dự án
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Lấy tất cả các dự án
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Lấy một dự án theo ID
    public Optional<Project> getProjectById(String projectId) {
        return projectRepository.findById(projectId);
    }

    // Cập nhật dự án
    public Project updateProject(String projectId, Project projectDetails) {
        Optional<Project> existingProject = projectRepository.findById(projectId);
        if (existingProject.isPresent()) {
            Project updatedProject = existingProject.get();
            updatedProject.setProjectName(projectDetails.getProjectName());
            updatedProject.setDescription(projectDetails.getDescription());
            updatedProject.setStartDate(projectDetails.getStartDate());
            updatedProject.setEndDate(projectDetails.getEndDate());
            updatedProject.setStatus(projectDetails.getStatus());
            updatedProject.setBudget(projectDetails.getBudget());
            return projectRepository.save(updatedProject);
        }
        return null;
    }

    // Xóa dự án
    public void deleteProject(String projectId) {
        projectRepository.deleteById(projectId);
    }
}
