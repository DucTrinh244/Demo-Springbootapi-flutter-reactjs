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
    private String assigneeEmail;  // Người được giao nhiệm vụ
    private String startDate;
    private String endDate;
    private String priority;
    private String status;
    private List<SubTask> subtasks;
}