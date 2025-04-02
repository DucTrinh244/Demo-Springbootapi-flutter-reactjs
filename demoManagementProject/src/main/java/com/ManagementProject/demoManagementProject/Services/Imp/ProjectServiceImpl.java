package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;  // Dùng để kiểm tra email người dùng tồn tại

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(String projectId) {
        return projectRepository.findById(projectId);
    }

    @Override
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

    @Override
    // Xóa dự án
    public void deleteProject(String projectId) {
        projectRepository.deleteById(projectId);
    }

    @Override
    public Project addMembersToProject(String projectId, List<String> memberEmails) {
        for (String email : memberEmails) {
            if (userRepository.findByEmail(email) == null) {
                throw new IllegalArgumentException("Email chưa được đăng ký trong hệ thống : " + email);
            }
        }

        Optional<Project> projectOpt = projectRepository.findByProjectId(projectId);
        if (projectOpt.isEmpty()) {
            throw new IllegalArgumentException("Dự án không tồn tại");
        }

        Project project = projectOpt.get();

        if (project.getMembers() == null) {
            project.setMembers(new ArrayList<>());
        }

        List<String> newMembers = memberEmails.stream()
                .filter(email -> !project.getMembers().contains(email)) // Chỉ thêm nếu email chưa có
                .collect(Collectors.toList());
        project.getMembers().addAll(newMembers);

        return projectRepository.save(project);
    }
}
