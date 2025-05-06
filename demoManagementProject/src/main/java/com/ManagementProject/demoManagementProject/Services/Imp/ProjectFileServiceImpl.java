package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.ProjectFile;
import com.ManagementProject.demoManagementProject.Repositories.ProjectFileRepository;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.ProjectFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ProjectFileServiceImpl implements ProjectFileService {


    @Autowired
    private ProjectFileRepository projectFileRepository;

    private static final String UPLOAD_DIR = "D:/HOCTAP/FULL_STACK/SOURCE/Demo-Management-project/demoManagementProject/src/main/java/com/ManagementProject/demoManagementProject/uploads/Files/";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository  projectRepository;




    @Override
    public ProjectFile storeFile(MultipartFile file, String projectId, String uploadedBy, String folder, String description) {

        // Lưu file vào hệ thống
        String fileName = file.getOriginalFilename();
        String filePath = UPLOAD_DIR + fileName;

        // Tạo thư mục nếu chưa tồn tại
        Path path = Paths.get(UPLOAD_DIR);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        // Lưu file vào thư mục
        File dest = new File(filePath);
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Tạo đối tượng ProjectFile
        ProjectFile projectFile = new ProjectFile();
        projectFile.setFileId(java.util.UUID.randomUUID().toString());
        projectFile.setProjectId(projectId);
        projectFile.setFileName(fileName);
        projectFile.setFilePath(filePath);
        projectFile.setFolder(folder);
        projectFile.setDescription(description);
        projectFile.setFileType(file.getContentType());
        projectFile.setUploadedBy(uploadedBy);
        projectFile.setUploadedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // Lưu vào MongoDB
        return projectFileRepository.save(projectFile);
    }

    @Override
    public Boolean ProjectIdExists(String projectId) {
        if(projectRepository.existsByProjectId(projectId))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    @Override
    public List<ProjectFile> getFilesByProjectId(String projectId) {
        return projectFileRepository.findByProjectId(projectId);
    }

    @Override
    public ProjectFile getFileById(String fileId) {
        return projectFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }


}
