package com.ManagementProject.demoManagementProject.Payload.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectFileRequest {

    private String projectId;  // Dự án mà tệp này thuộc về
    private String fileName;   // Tên tệp
    private String folder;     // Thư mục chứa tệp
    private String description;
    private String filePath;   // Đường dẫn đến tệp (có thể là URL hoặc đường dẫn lưu trữ tệp)
    private String fileType;   // Loại tệp (ví dụ: "PDF", "DOCX", "XLSX", ...)
    private String uploadedAt = String.valueOf(System.currentTimeMillis()); // Thời gian tải lên

}