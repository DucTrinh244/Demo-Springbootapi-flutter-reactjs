package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.ProjectFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectFileService {
    // Define the methods that will be implemented in the service class


    ProjectFile storeFile(MultipartFile file,String projectId, String uploadedBy);

    Boolean ProjectIdExists(String projectId);
    public List<ProjectFile> getFilesByProjectId(String projectId);
}
