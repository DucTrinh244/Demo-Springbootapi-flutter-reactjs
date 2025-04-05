package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins ={ "http://172.26.8.178/","http://localhost:5173/"})
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // API tạo dự án mới
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
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
}