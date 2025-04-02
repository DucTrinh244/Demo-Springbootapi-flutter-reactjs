package com.ManagementProject.demoManagementProject.Payload.Request;


import com.ManagementProject.demoManagementProject.Models.SubTask;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskRequest {
    private String taskName;
    private String description;
    private String assigneeId;  // Người được giao nhiệm vụ
    private String startDate; // Ngày bắt đầu
    private String endDate;   // Ngày kết thúc
    private String priority;  // Mức độ ưu tiên
    private String status;
    private List<SubTask> subtasks;
}