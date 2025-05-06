package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.ProjectFile;
import com.ManagementProject.demoManagementProject.Services.ProjectFileService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
            @RequestParam("projectId") String projectId,
            @RequestParam("folder") String folder,
            @RequestParam(value = "description", required = false) String description
    ) throws IOException {

        // Kiểm tra xem projectId có tồn tại không
        if(!projectService.ProjectIdExists(projectId)) {
            return ResponseEntity.ok("Project ID không tồn tại");
        }

        String email = CurrentUserUtil.getCurrentUserEmail();

        ProjectFile uploadedFile = projectFileService.storeFile(file, projectId, email,folder, description);
        return ResponseEntity.ok(uploadedFile);
    }
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getAllFileProject(
            @PathVariable String projectId
    ) {
        // Kiểm tra xem projectId có tồn tại không
        if(!projectService.ProjectIdExists(projectId)) {
            return ResponseEntity.ok("Project ID không tồn tại");
        }

        List<ProjectFile> files = projectFileService.getFilesByProjectId(projectId);
        return ResponseEntity.ok(files);
    }
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) throws IOException {
        ProjectFile fileInfo = projectFileService.getFileById(fileId);
        if (fileInfo == null) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = Paths.get(fileInfo.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());

        // Xác định Content-Type theo file
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream"; // fallback nếu không xác định được
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileInfo.getFileName() + "\"")
                .body(resource);
    }







}
