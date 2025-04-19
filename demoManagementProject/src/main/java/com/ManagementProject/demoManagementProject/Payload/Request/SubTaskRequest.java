package com.ManagementProject.demoManagementProject.Payload.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubTaskRequest {
    private String subtaskName;
    private String description;
    private String assigneeEmail;
    private String startDate;
    private String endDate;
    private String status= "Pending";
}
