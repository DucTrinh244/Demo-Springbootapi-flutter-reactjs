package com.ManagementProject.demoManagementProject.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "project_files")
public class ProjectFile {

    @Id
    private String fileId;
    private String projectId;  // Dự án mà tệp này thuộc về
    private String fileName;   // Tên tệp
    private String filePath;   // Đường dẫn đến tệp (có thể là URL hoặc đường dẫn lưu trữ tệp)
    private String fileType;   // Loại tệp (ví dụ: "PDF", "DOCX", "XLSX", ...)
    private String uploadedBy; // ID của nhân viên tải tệp lên
    private String uploadedAt; // Thời gian tải lên

}