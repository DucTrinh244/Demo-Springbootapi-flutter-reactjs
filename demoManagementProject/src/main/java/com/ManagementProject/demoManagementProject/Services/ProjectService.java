package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface ProjectService {

    Project createProject(Project project);

     List<Project> getAllProjects();

     Optional<Project> getProjectById(String projectId);

     Project updateProject(String projectId, Project projectDetails);

     void deleteProject(String projectId);

     Project addMembersToProject(String projectId, List<String> memberEmails);
}
