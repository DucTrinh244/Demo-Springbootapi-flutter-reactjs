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
@Document(collection = "project_updates")
public class ProjectUpdates {

    @Id
    private String id;  // ID duy nhất của bản cập nhật
    private String projectId;  // ID dự án (có thể là ObjectId nếu sử dụng MongoDB)
    private Date updateDate;   // Ngày cập nhật
    private String updateDescription;  // Mô tả về tiến độ dự án
    private String updatedBy;
    private String status;
    private String nextSteps;
}
