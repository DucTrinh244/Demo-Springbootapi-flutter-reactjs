package com.ManagementProject.demoManagementProject.Payload.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgressProjectResponse {
    private double progressPercentage;
    private int totalTasks;
    private int completedTasks;
    private int overdueTasks;
}
