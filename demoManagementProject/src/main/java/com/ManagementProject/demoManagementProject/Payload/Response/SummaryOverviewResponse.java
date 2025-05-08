package com.ManagementProject.demoManagementProject.Payload.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SummaryOverviewResponse {
    // Project Stats
    private int totalProjects;
    private int activeProjects;
    private int completedProjects;
    private double projectCompletionRate;

    // Task Stats
    private int totalTasks;
    private int ongoingTasks;
    private int completedTasks;
    private double taskCompletionRate;
}
