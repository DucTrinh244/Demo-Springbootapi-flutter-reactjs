package com.ManagementProject.demoManagementProject.Payload.Request;

import lombok.Data;

@Data
public class TaskCompletionRequest {
    private String projectId;
    private String taskName;
    private String updatedBy;
}
