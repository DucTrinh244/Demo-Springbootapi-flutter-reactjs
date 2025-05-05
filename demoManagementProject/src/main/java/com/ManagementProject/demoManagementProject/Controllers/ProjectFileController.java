package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.ProjectFile;
import com.ManagementProject.demoManagementProject.Services.ProjectFileService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/project-files")
public class ProjectFileController {

    @Autowired
    private  ProjectFileService projectFileService;

    @Autowired
    private ProjectFileService projectService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
                @RequestParam("file") MultipartFile file,
            @RequestParam("projectId") String projectId) throws IOException {

        // Kiểm tra xem projectId có tồn tại không
        if( projectService.ProjectIdExists(projectId)) {
            return ResponseEntity.ok("Project ID không tồn tại");
        }

        String email = CurrentUserUtil.getCurrentUserEmail();

        ProjectFile uploadedFile = projectFileService.storeFile(file, projectId, email);
        return ResponseEntity.ok(uploadedFile);
    }
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getFilesByProjectId(@PathVariable String projectId) {
        if( projectService.ProjectIdExists(projectId)) {
            return ResponseEntity.ok("Project ID không tồn tại");
        }

        List<ProjectFile> files = projectFileService.getFilesByProjectId(projectId);
        return ResponseEntity.ok(files);
    }

}
