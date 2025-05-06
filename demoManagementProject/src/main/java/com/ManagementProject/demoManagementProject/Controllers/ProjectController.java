package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Response.ProjectResponse;
import com.ManagementProject.demoManagementProject.Services.ProjectService;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private TaskService taskService;

    // API tạo dự án mới
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
            String email = CurrentUserUtil.getCurrentUserEmail();
        project.setProjectOwnerId(email);

        // Xử lý tránh null pointer
        List<String> members = project.getMembers();
        if (members == null) {
            members = new ArrayList<>();
        }

        // Tránh thêm trùng email
        if (!members.contains(email)) {
            members.add(email);
        }

        project.setMembers(members);
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.ok(createdProject);
    }

    // API lấy tất cả dự án
    @GetMapping
    public List<Project> getAllProjects() {

        return projectService.getAllProjects();
    }

    // API lấy dự án theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // API cập nhật dự án
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project projectDetails) {
        Project updatedProject = projectService.updateProject(id, projectDetails);
        return updatedProject != null ? ResponseEntity.ok(updatedProject) : ResponseEntity.notFound().build();
    }

    // API xóa dự án
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // API để thêm thành viên vào dự án
    @PutMapping("/{projectId}/members")
    public ResponseEntity<Project> addMembersToProject(@PathVariable String projectId,
                                                       @RequestBody List<String> memberEmails) {
        try {
            Project updatedProject = projectService.addMembersToProject(projectId, memberEmails);
            return ResponseEntity.ok(updatedProject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/my-project")
    public ResponseEntity<List<Project>> getProjectsByMemberEmail() {
        String email= CurrentUserUtil.getCurrentUserEmail();
        List<Project> projects = projectService.findByMembersContaining(email);
        if(projects.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/created-projects")
    public ResponseEntity<List<Project>> getProjectsByMemberEmailCreated() {
        String email= CurrentUserUtil.getCurrentUserEmail();
        List<Project> projects = projectService.getProjectsByOwner(email);
        if(projects.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(projects);
    }

    // get project and task
    @GetMapping("/project-and-task/{id}")
    public ResponseEntity<ProjectResponse> getProjectAndTask(@PathVariable String id) {
        Optional<Project> project = projectService.getProjectById(id);
        List<Task> task = taskService.getTasksByProjectId(id);
        if (project.isPresent()) {
            ProjectResponse projectResponse = new ProjectResponse();
            projectResponse.setProject(project.get());
            projectResponse.setTasks(task);
            return ResponseEntity.ok(projectResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}