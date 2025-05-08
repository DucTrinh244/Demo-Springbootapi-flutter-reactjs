package com.ManagementProject.demoManagementProject.Payload.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SummaryProjectResponse {
    private int totalProjects;
    private int completedProjects;
    private int overdueProjects;
    private int upcomingDeadlines;
}
