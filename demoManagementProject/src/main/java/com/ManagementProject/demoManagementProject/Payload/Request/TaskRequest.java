package com.ManagementProject.demoManagementProject.Payload.Request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {

    private String taskName;
    private String description;
    private String assignee;  // Người được giao nhiệm vụ
    private String startDate; // Ngày bắt đầu
    private String endDate;   // Ngày kết thúc
    private String priority;  // Mức độ ưu tiên
    private String status;    // Trạng thái của nhiệm vụ (e.g. "In Progress", "Completed")
}